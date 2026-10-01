# 🚗 Touralink — Direct Outstation Cabs & Verified Chauffeurs Platform

> **India's Transparent Peer-to-Peer Intercity Fleet & Chauffeur Network**  
> Direct Driver Rates • 0% Middleman Platform Commission • 100% Police & Commercial Badge Verified  
> Operational across **Maharashtra, Goa, Gujarat & Karnataka**.

---

## 📖 Overview

**Touralink** is a modern, high-performance web platform that bridges travelers directly with verified commercial taxi fleets and personal car chauffeurs. Unlike traditional aggregator applications that impose 25–35% middleman commission markups and hidden surcharges, Touralink connects travelers directly to drivers and fleet owners with 100% transparent per-km billing and direct UPI payouts.

The application features an **Apple Music-inspired frosted glassmorphic UI** (`backdrop-blur-2xl`, `saturate-[190%]`), ambient cinematic background video, and tailored flows for both **Travelers** and **Driver / Fleet Partners**.

---

## 🌟 Key Features & Workflows

### 1. 🧳 Traveler Experience

#### A. Dual Rental Choice Cards
From the home dashboard, travelers can pick between two core rental modalities:
1. **Car + Verified Driver (Outstation & City Cabs)**: Complete commercial AC vehicle (Toyota Innova Crysta, Maruti Ertiga, Kia Carens, Maruti Dzire, Hyundai Aura, Force Urbania) with an assigned commercial chauffeur.
2. **Driver Only / Personal Chauffeur (For Your Own Car)**: Hire verified, experienced drivers for personal cars or commercial fleets (specialists in steep Western Ghat hairpin turns, overnight expressways, coastal Goa roads, or corporate automatic/luxury vehicles).

#### B. Trip Requirements & Live Fare Estimation Flow (`TripEstimationPage`)
Instead of dumping users into raw car lists, clicking either card triggers a comprehensive journey planning and estimation interface:
- **Interactive Multi-Stop Route Builder**:
  - **Point A (Pickup Location)**: Quick-select presets for major airports and cities (Mumbai BOM, Pune Baner, Panaji Goa, Ahmedabad, Bengaluru BLR, etc.) or custom address search.
  - **Additional Pickup / En-Route Stops**: Dynamic `+ Add Pickup Point / En-Route Stop` builder allowing travelers to configure intermediate pickup points (e.g., Dadar Circle, Lonavala Toll) with real-time removal.
  - **Point B (Final Destination / Drop-off)**: Quick-select presets for popular destinations (North Goa, Mahabaleshwar, Shirdi, Statue of Unity, Mysuru, Coorg) or custom drop-offs.
  - **Trip Type**: One-Way vs. Round-Trip calculation.
- **Date & Pickup Time Scheduler**: Select travel date and time slots (Early Ghat Drive 06:00 AM, Morning Highway 09:00 AM, Evening, Overnight, etc.).
- **Passenger & Luggage Configurator**:
  - **Passenger Counter**: 1 to 15+ passengers with dynamic vehicle suitability advice.
  - **Luggage Breakdown**: Separate counters for **Large / Trolley Suitcases (24"+)** and **Small / Cabin Backpacks**.
  - **Luggage Capacity Advisory**: Alerts travelers if luggage exceeds boot space or recommends vehicle upgrades (e.g. *7-Seater MUV recommended for 5 travelers & 3 large bags*).
- **Vehicle Class Preferences**:
  - Filter for Car + Driver: All Fleet, 4-Seater Sedans, 7-Seater Premium MUVs, 13-Seater Luxury Group Vans.
  - For Chauffeurs: Specify your personal vehicle type (SUV, Sedan, Luxury, Hatchback) and transmission (Automatic vs. Manual).
- **Real-Time Fare & Distance Calculator**:
  - Distance estimation matrix for standard routes (e.g., Mumbai ⇄ Pune: 150 KM, Mumbai ⇄ Goa: 585 KM, Pune ⇄ Mahabaleshwar: 120 KM, Bengaluru ⇄ Coorg: 265 KM).
  - Estimated travel duration (hours & minutes).
  - Transparent estimated fare range with **0% Platform Commission Guarantee**.
- **Seamless Handover**: Direct CTA button (*"View Matching Cars & Drivers"* or *"View Verified Chauffeurs"*) passing the configured trip parameters to directory listings.

#### C. Verified Commercial Fleet Directory (`FleetPage`)
- **Active Trip Context Banner**: Displays the traveler's active route, distance (KM), duration, traveler count, luggage count, and pickup date, with an **"Edit Requirements"** button to modify parameters without losing state.
- **Dynamic Per-Trip Fare Calculations**: Each vehicle card dynamically calculates and displays the trip total based on route distance (e.g., `₹2,250 for 150 KM`).
- **Smart Compatibility Badges**:
  - `✓ Fits X Travelers` (or warnings if group exceeds seating).
  - `✓ Boot: Fits X Large Bags`.
- **Category Filters**: Instant switching between All Fleet, 7-Seater MUVs, Sedans, and Luxury Group Vans.
- **Vehicle Details & Inspection Modal (`VehicleDetailsModal`)**:
  - Multi-photo carousel flip for interior, exterior, and boot space.
  - Full specifications (seating layout, luggage boot, fuel type, dual-zone AC, All-India AITP permit).
  - Live customized trip quote breakdown.
  - Assigned driver profile with direct call option.
  - RTO commercial fitness and Fastag clearance confirmation.

#### D. Verified Personal Chauffeurs Directory (`DriversPage`)
- **Active Journey Context Banner**: Preserves route and vehicle transmission requirements.
- **Driver Categories & Badges**:
  - 🏔️ *Ghats & Hill Road Specialists* (Sahyadri, Pasarni, Amboli, Coorg, Ooty).
  - 🛣️ *Long Highway & Night Drives Pro* (National Expressways, Mumbai–Gujarat corridor).
  - 🌴 *Goa Coastline & Tourist Guides* (North/South Goa, heritage churches, coastal roads).
  - ✨ *Luxury & Automatic Chauffeurs* (Mercedes-Benz, BMW, Audi, Lexus, Fortuner).
- **Police & KYC Badge Verification**: Live badge registration numbers (e.g. MH-12-8821, GA-01-4419).
- **Direct Hire Connect Modal**: Direct daily chauffeur wages, zero middleman fees, and instant driver phone connection.

#### E. Comprehensive Fleet Photo Gallery (`FleetGalleryModal`)
- Interactive multi-photo gallery accessible directly from the home choice cards.
- View 8+ verified photos per car category, including captain seat layouts, dashboard, luggage boot, and exterior angles.

---

### 2. 👔 Driver Partner (Chauffeur) Experience (`DriverPartnerHome`)

- **Live Trip Broadcast Feed**: Real-time broadcasts from travelers booking outstation cabs or requesting personal car drivers across Western India.
- **Direct Payout Cards**: Displays exact customer pickup/drop locations, vehicle type, passenger/luggage specs, urgency tags, and transparent direct UPI payouts.
- **Special Route Notes**: Highlights critical drive requirements (e.g., rainy ghat curves, automatic 4x4 skill, language preferences).
- **Driver Duty Status & Rate Card Settings**: Toggle between "On Duty / Taking Trips" and "Resting", with custom daily and night outstation rate cards.

---

### 3. 🏢 Fleet Partner (Tour & Taxi Operator) Experience (`FleetPartnerHome`)

- **Commercial Fleet Management**: Operators can manage multi-car fleets (Innova Crysta, Ertiga, Carens, Dzire, Aura, Force Urbania).
- **Indian Vehicle RTO & VAHAN RC Verification Engine (`rtoVerificationService.js`)**:
  - Live parser for Indian commercial registration number plates across all 28 states & 8 UTs (e.g. `MH 12 RN 8821`, `GA 01 T 4419`, `KA 05 AB 1234`, `GJ 06 TC 9012`).
  - Automatic jurisdiction mapping to 40+ Indian RTO offices (Tardeo, Andheri, Pune, Panaji, Ahmedabad, Bengaluru, etc.).
  - Simulates authentic VAHAN commercial RC details: Fitness Valid Until, Commercial Road Tax, All-India Tourist Permit (AITP), Fastag Bank, Pollution Under Control (PUC), and Commercial Insurance.
- **Add Vehicle Wizard**: 3-step wizard (Vehicle Model selection from Indian commercial catalog -> Live RTO Plate verification -> Assigned Chauffeur & Per-KM rate configuration).
- **Fleet Statistics**: Real-time counters for Active Fleet Vehicles, Dispatched Trips, and Revenue.

---

### 4. 🔐 Authentication & Onboarding (`AuthModal`)

- **Multi-Role Login & Signup**:
  - **Traveler Mode**: Quick access with email or one-click demo credentials.
  - **Driver / Fleet Partner Mode**: Specialized 3-step onboarding:
    1. Account Credentials & Mobile OTP verification.
    2. Partner Type Selection (Individual Chauffeur vs. Fleet Agency Operator).
    3. Fleet Agency Setup (Agency Name, Operating State/City, Fleet Size).
- **Persistent Sessions**: Seamless role switching and session handling.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS 3](https://tailwindcss.com/) with custom Apple glassmorphism tokens |
| **Typography** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Body) & [Outfit](https://fonts.google.com/specimen/Outfit) (Display Headings) |
| **Icons** | [Lucide React](https://lucide.dev/) (Comprehensive icon set) |
| **Video & Media** | HTML5 ambient background video with backdrop filter blur overlay |
| **Verification Engine** | Native Client-Side Indian RTO & VAHAN Registration Parsing Service |
| **State & Navigation** | URL hash-based routing (`#home`, `#estimate`, `#fleet`, `#drivers`) with full browser history support |

---

## 📁 Project Structure

```
touralink/
├── public/
│   ├── images/                     # Vehicle photos, avatars, and fleet media
│   └── videos/                     # Ambient background video (cape-goa.mp4)
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── AuthModal.jsx       # Multi-role authentication & partner onboarding
│   │   │   ├── ShowcasePanel.jsx   # Hero marketing panel in auth modal
│   │   │   └── SocialButtons.jsx   # Social login buttons
│   │   ├── Common/
│   │   │   ├── Input.jsx           # Form input component
│   │   │   └── Logo.jsx            # Touralink branding & regional badges
│   │   ├── Dashboard/
│   │   │   └── MockDashboard.jsx   # Partner analytics dashboard
│   │   ├── Fleet/
│   │   │   ├── FleetGalleryModal.jsx    # 8+ photo multi-vehicle gallery modal
│   │   │   └── VehicleDetailsModal.jsx  # Vehicle inspection modal with trip quote
│   │   └── Footer/
│   │       └── Footer.jsx          # Touralink platform footer
│   ├── pages/
│   │   ├── TravelerHome.jsx        # Traveler dashboard with rental choice cards
│   │   ├── TripEstimationPage.jsx  # Route, stops, passenger, luggage & fare estimator
│   │   ├── FleetPage.jsx           # Commercial car fleet directory with dynamic trip quotes
│   │   ├── DriversPage.jsx         # Verified personal chauffeurs directory
│   │   ├── DriverPartnerHome.jsx   # Individual chauffeur dashboard with broadcast trips
│   │   └── FleetPartnerHome.jsx    # Fleet operator dashboard with RTO verification
│   ├── services/
│   │   └── rtoVerificationService.js # Indian RTO plate parser & VAHAN RC simulation
│   ├── App.jsx                     # Core application router, state & video container
│   ├── index.css                   # Tailwind directives & frosted glassmorphism utilities
│   └── main.jsx                    # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KartikPanchal28/touralink-.git
   cd touralink
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173/`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs optimized static production bundle in the `dist/` directory.

---

## 🧭 Application Routes (Hash Navigation)

| Route Hash | Page / View | Description |
| :--- | :--- | :--- |
| `/#home` | **Traveler / Partner Home** | Dashboard with rental choice cards or partner operations |
| `/#estimate` | **Trip Estimation Page** | Multi-stop route builder, luggage/passenger counters & fare estimation |
| `/#fleet` | **Fleet Directory** | Matched commercial cabs with dynamic per-km quotes & trip banner |
| `/#drivers` | **Chauffeurs Directory** | Verified personal chauffeurs with route specialty tags & direct hire |

---

## 🔒 Security & Safety Guarantees

- **100% Police Background Check**: Every chauffeur is checked against state criminal databases.
- **Commercial Badge Verification**: Only commercial badge holders (MH, GA, GJ, KA) are assigned for passenger transport.
- **Zero Commission Guarantee**: 100% of the trip fare goes directly to the driver via UPI upon journey completion.
- **Real-Time GPS Tracking**: Vehicles are equipped with live MVD-certified tracking and SOS support.

---

## 📄 License

This project is proprietary and confidential. Developed for Touralink India.
