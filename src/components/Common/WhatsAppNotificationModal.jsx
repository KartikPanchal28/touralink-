import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  User,
  Car,
  Building2,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  MessageSquare
} from 'lucide-react';

export default function WhatsAppNotificationModal({
  isOpen,
  onClose,
  dispatchRecord
}) {
  const [activeTab, setActiveTab] = useState('traveler'); // 'traveler' | 'driver' | 'fleet'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !dispatchRecord) return null;

  const { bookingId, traveler, driver, fleetOwner } = dispatchRecord;

  const currentParty =
    activeTab === 'traveler'
      ? traveler
      : activeTab === 'driver'
      ? driver
      : fleetOwner;

  const handleCopyMessage = () => {
    if (!currentParty?.message) return;
    navigator.clipboard.writeText(currentParty.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col text-slate-900 max-h-[92vh]">
        
        {/* Header with WhatsApp Emerald Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0">
              <MessageSquare className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-100">
                  Instant WhatsApp Dispatch
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-white/25 text-white">
                  Ref #{bookingId}
                </span>
              </div>
              <h3 className="text-base font-black font-display text-white">
                Booking Details Dispatched to WhatsApp
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/15 hover:bg-black/30 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Callout Bar */}
        <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900 font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Successfully routed to 3 active WhatsApp recipients in real-time.</span>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-700">0% Commission Payout</span>
        </div>

        {/* 3 Party Tabs: User, Driver, Fleet Owner */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('traveler')}
            className={`py-3 px-3 flex items-center justify-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'traveler'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate">Traveler (User)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('driver')}
            className={`py-3 px-3 flex items-center justify-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'driver'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span className="truncate">Chauffeur</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fleet')}
            className={`py-3 px-3 flex items-center justify-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'fleet'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate">Fleet Owner</span>
          </button>
        </div>

        {/* Content Body: Chat Bubble View & Recipient Info */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-100/50">
          
          {/* Recipient Details Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {activeTab === 'traveler'
                  ? 'Traveler WhatsApp Contact'
                  : activeTab === 'driver'
                  ? 'Assigned Driver WhatsApp'
                  : 'Fleet Partner Agency WhatsApp'}
              </span>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {currentParty?.name || currentParty?.agencyName}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
                <span>📱 {currentParty?.phone}</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Verified WhatsApp
                </span>
              </div>
            </div>

            <a
              href={currentParty?.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer shrink-0"
            >
              <span>Open in WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* WhatsApp Chat Preview Bubble */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
              <span>Formatted WhatsApp Message Preview:</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] font-extrabold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-60 overflow-y-auto">
              {currentParty?.message}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              All parties have received encrypted WhatsApp payload. Chauffeur and Traveler can directly communicate via WhatsApp call or text.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-semibold hidden sm:block">
            Touralink WhatsApp Bot Engine • Automated 24/7 Dispatch
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs transition-colors cursor-pointer ml-auto"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
