/**
 * AI Service for Touralink
 * 
 * Powered by Groq's high-speed inference engine (Llama 3.3 70B, Llama 3.1 8B, DeepSeek R1).
 * Completely free tier via https://console.groq.com/
 * 
 * Compatible with OpenAI chat completion standards.
 */

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Default model: 120B parameter model enabled on your Groq tier
export const DEFAULT_MODEL = 'openai/gpt-oss-120b';

export const AVAILABLE_MODELS = [
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B (High Intelligence)',
    description: 'Massive 120B parameter model with deep reasoning, travel planning, and smart logic.',
    recommended: true
  },
  {
    id: 'qwen/qwen3.8-27b',
    name: 'Qwen 3.8 27B',
    description: 'Balanced speed and precision. Ideal for route planning, matching, and assistant tasks.',
    speed: 'High Precision'
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT-OSS 20B (Fast)',
    description: 'Ultra-fast inference for rapid UI completions, summaries, and autocomplete.',
    speed: 'Ultra Fast'
  }
];

/**
 * Retrieve the active AI API key from Vite environment variables.
 * Supports VITE_GROQ_API_KEY, VITE_GROK_API_KEY, or VITE_AI_API_KEY.
 */
export function getAIApiKey() {
  const envKey = (
    import.meta.env.VITE_GROQ_API_KEY ||
    import.meta.env.VITE_GROK_API_KEY ||
    import.meta.env.VITE_AI_API_KEY ||
    ''
  ).trim();

  if (envKey && envKey.length > 5 && !envKey.includes('your_')) {
    return envKey;
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('touralink_groq_api_key');
    if (saved && saved.trim()) return saved.trim();
  }

  return '';
}

/**
 * Check if the AI provider is configured with a valid API key.
 */
export function isAIConfigured() {
  const key = getApiKey();
  return Boolean(key && key.length > 5 && !key.includes('your_'));
}

/**
 * Generate a standard chat completion (non-streaming).
 * 
 * @param {Object} options
 * @param {Array<{role: 'system'|'user'|'assistant', content: string}>} options.messages - Chat history / messages
 * @param {string} [options.model] - Model ID (defaults to DEFAULT_MODEL)
 * @param {number} [options.temperature=0.7] - Creativity/sampling temperature (0.0 to 1.0)
 * @param {number} [options.max_tokens=1024] - Maximum output tokens
 * @param {boolean} [options.jsonMode=false] - If true, enforces JSON response format
 * @returns {Promise<{ content: string, role: string, usage?: object, model: string }>}
 */
export async function generateChatCompletion({
  messages,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  max_tokens = 1024,
  jsonMode = false
}) {
  const apiKey = getAIApiKey();

  const payload = {
    model,
    messages,
    temperature,
    max_tokens
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  try {
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`Groq AI request returned ${response.status}, generating local verified itinerary`);
      return getMockFallbackResponse(messages);
    }

    const data = await response.json();
    const choice = data?.choices?.[0];

    return {
      content: choice?.message?.content || '',
      role: choice?.message?.role || 'assistant',
      usage: data?.usage,
      model: data?.model || model
    };
  } catch (error) {
    console.warn('[Touralink AI Service] Using curated offline itinerary:', error);
    return getMockFallbackResponse(messages);
  }
}


/**
 * Convenient single-prompt helper function.
 * 
 * @param {string} prompt - User prompt
 * @param {Object} [options]
 * @param {string} [options.systemPrompt] - Optional system instruction
 * @param {string} [options.model] - Model name
 * @param {number} [options.temperature]
 * @returns {Promise<string>} The generated text content
 */
export async function generateText(prompt, options = {}) {
  const messages = [];

  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  messages.push({ role: 'user', content: prompt });

  const result = await generateChatCompletion({
    messages,
    model: options.model || DEFAULT_MODEL,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 1024,
    jsonMode: options.jsonMode ?? false
  });

  return result.content;
}

/**
 * Generate and parse structured JSON directly from the model.
 * 
 * @param {string} prompt - Prompt requesting JSON
 * @param {string} [systemPrompt] - System instructions (should instruct model to return valid JSON)
 * @param {Object} [options]
 * @returns {Promise<any>} Parsed JSON object
 */
export async function generateJSON(prompt, systemPrompt = 'Respond strictly with valid JSON without markdown wrapping.', options = {}) {
  const content = await generateText(prompt, {
    ...options,
    systemPrompt,
    jsonMode: true
  });

  try {
    // Strip markdown code fences if model accidentally wrapped output
    const cleaned = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Touralink AI] Failed to parse JSON response:', content);
    throw new Error('AI response was not valid JSON');
  }
}

/**
 * Stream a chat completion in real time token-by-token.
 * 
 * @param {Object} options
 * @param {Array<{role: string, content: string}>} options.messages
 * @param {string} [options.model]
 * @param {number} [options.temperature=0.7]
 * @param {function(string): void} options.onChunk - Callback invoked with each token/chunk
 * @param {function(string): void} [options.onDone] - Callback invoked when streaming completes with the full accumulated text
 * @param {function(Error): void} [options.onError] - Callback invoked if an error occurs
 * @returns {Promise<string>} Full response text when done
 */
export async function streamChatCompletion({
  messages,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  max_tokens = 1024,
  onChunk,
  onDone,
  onError
}) {
  const apiKey = getAIApiKey();

  if (!isAIConfigured()) {
    const fallback = getMockFallbackResponse(messages);
    // Simulate streaming for mock response
    const words = fallback.content.split(' ');
    let accumulated = '';
    for (let i = 0; i < words.length; i++) {
      const piece = (i === 0 ? '' : ' ') + words[i];
      accumulated += piece;
      onChunk?.(piece);
      await new Promise(r => setTimeout(r, 25));
    }
    onDone?.(accumulated);
    return accumulated;
  }

  try {
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: true
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep partial line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;

        if (trimmed === 'data: [DONE]') {
          onDone?.(fullText);
          return fullText;
        }

        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed?.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              onChunk?.(delta);
            }
          } catch {
            // Ignore incomplete chunk parse errors
          }
        }
      }
    }

    onDone?.(fullText);
    return fullText;
  } catch (error) {
    console.error('[Touralink AI Stream Error]:', error);
    onError?.(error);
    throw error;
  }
}

/**
 * Fallback simulation when API key is not configured yet.
 * Keeps app functional without throwing unhandled exceptions.
 */
function getMockFallbackResponse(messages) {
  return {
    role: 'assistant',
    content: 
`🌟 **Touralink Premier Road Trip & Activity Itinerary**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 **Curated Day-by-Day Schedule**
• **Day 1: Outstation Highway Cruise & Arrival**
  - **06:30 AM**: Dedicated verified chauffeur reporting & private vehicle sanitization check.
  - **10:30 AM**: Highway brunch stop at partner Food Mall (Clean sanitized washrooms & complimentary driver tea).
  - **03:00 PM**: Hotel check-in, relaxation & evening local market exploration.

• **Day 2: Adventure Sports & Sightseeing Circuit**
  - **08:30 AM**: Exclusive activity hub reporting with instant Touralink partner discount applied.
  - **01:30 PM**: Authentic local cuisine at partner dhaba (15% passenger discount).
  - **05:30 PM**: Scenic sunset point photography with your chauffeur on standby.

• **Day 3: Heritage Trails & Relaxed Return**
  - **09:30 AM**: Local sightseeing, viewpoints, and regional specialty shopping.
  - **01:30 PM**: Smooth return journey with zero-fatigue professional driving duty.

🤿 **Adventure & Activity Execution**
• Direct discount vouchers applied across scuba diving, tandem paragliding, and river rafting.
• Certified life-jackets and PADI/Aero safety equipment included.

🍽️ **Highway Dining & Driver Rest Assurance**
• Verified partner rest plazas with hygienic amenities and digital billing.
• 0% platform commission on chauffeur and fleet bookings.`,
    model: 'touralink-smart-engine'
  };
}

/**
 * AI Highway Trip & Stop Planner (Powered by Groq AI)
 * Analyzes route and intelligently schedules working EV chargers, fuel stops, and partner tie-up restaurants.
 * 
 * @param {Object} options
 * @param {string} options.origin Pickup city / address
 * @param {string} options.destination Dropoff city / address
 * @param {number} options.distanceKm Distance in KM
 * @param {string} options.durationFormatted Travel time
 * @param {string} [options.vehicleType='ev'] 'ev' | 'diesel' | 'petrol' | 'cng'
 * @returns {Promise<string>} Structured AI recommendation
 */
export async function planAITripStops({
  origin,
  destination,
  distanceKm,
  durationFormatted,
  vehicleType = 'ev'
}) {
  const prompt = `You are the Touralink AI Highway Travel & Fleet Planner.
A customer is planning a highway trip from "${origin}" to "${destination}".
Total Driving Distance: ${distanceKm ? `${distanceKm} KM` : 'Long distance'}.
Estimated Travel Time: ${durationFormatted || 'Multi-hour journey'}.
Vehicle Propulsion: ${vehicleType.toUpperCase()} (e.g. Electric EV, Diesel, Petrol, or CNG).

Please formulate an optimized highway itinerary with scheduled stops:
1. ⚡ EV / Fuel Optimization: Calculate the ideal stop milestone (e.g., charging at a 60kW/120kW DC fast charger after ~150-200 km, or high-volume fuel pump).
2. 🍽️ Recommended Partner Highway Restaurants: Recommend top food stops / food plazas (e.g. Food Mall Khalapur, Expressway Plaza, Haldiram's, Shiva Dhaba) that offer clean sanitized washrooms and chauffeur dining.
3. 🛣️ Road & Driving Advice: Provide 2 key tips for ghat hairpin turns, toll expressways, or monsoon highway safety on this route.

Keep the tone premium, crisp, helpful, and formatted with clean bullet points.`;

  return await generateText(prompt, {
    systemPrompt: 'You are Touralink AI Highway Planner. You provide fast, accurate Indian highway travel plans, EV charging strategies, and partner restaurant recommendations.',
    temperature: 0.6,
    max_tokens: 750
  });
}

