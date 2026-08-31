import React from 'react';
import Logo from '../Common/Logo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Car, 
  UserCheck, 
  Clock, 
  Heart, 
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/90 backdrop-blur-xl border-t border-slate-200 mt-20 text-slate-600 font-sans">
      
      {/* Top Value Banner */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-800">
          
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">0% Middleman Markup</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Pay direct transparent per-km rates to drivers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">100% KYC & Police Verified</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Commercial badge verified chauffeurs & safe rides</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-adventure-50 border border-adventure-200/60 flex items-center justify-center text-adventure-600 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">24x7 Roadside & Trip Support</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Direct helpline across Maharashtra, Goa, Gujarat & KA</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Bio (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="md" />
            
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium max-w-sm">
              India's transparent platform for direct driver & cab rentals. We eliminate middleman commissions and connect travelers directly with 100% verified chauffeurs across Maharashtra, Goa, Gujarat, and Karnataka.
            </p>

            {/* Quick Contact Chips */}
            <div className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Serving Mumbai, Pune, Ahmedabad, Surat, Bengaluru, Panaji & 40+ Cities</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-adventure-600 shrink-0" />
                <a href="mailto:support@touralink.in" className="hover:text-brand-600 transition-colors">support@touralink.in</a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 WhatsApp Support: +91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular State Corridors */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Popular Corridors
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-500">
              <li>
                <a href="#corridor-mumbai-goa" className="hover:text-brand-600 transition-colors flex items-center justify-between group">
                  <span>Mumbai ⇄ Goa Coastal</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#corridor-pune-mahabaleshwar" className="hover:text-brand-600 transition-colors flex items-center justify-between group">
                  <span>Pune ⇄ Mahabaleshwar</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#corridor-ahmedabad-kutch" className="hover:text-brand-600 transition-colors flex items-center justify-between group">
                  <span>Ahmedabad ⇄ Rann of Kutch</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#corridor-bengaluru-coorg" className="hover:text-brand-600 transition-colors flex items-center justify-between group">
                  <span>Bengaluru ⇄ Coorg / Mysuru</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#corridor-surat-somnath" className="hover:text-brand-600 transition-colors flex items-center justify-between group">
                  <span>Surat ⇄ Somnath & Dwarka</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Rental Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Rental Services
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-500">
              <li>
                <a href="#car-driver" className="hover:text-brand-600 transition-colors">
                  Car + Verified Driver (Innova / Ertiga)
                </a>
              </li>
              <li>
                <a href="#driver-only" className="hover:text-brand-600 transition-colors flex items-center gap-1.5">
                  <span>Chauffeur Only (For Your Car)</span>
                  <span className="text-[9px] font-extrabold bg-adventure-100 text-adventure-700 px-1.5 py-0.5 rounded">Hot</span>
                </a>
              </li>
              <li>
                <a href="#outstation" className="hover:text-brand-600 transition-colors">
                  Intercity Outstation Fixed ₹/KM
                </a>
              </li>
              <li>
                <a href="#hourly" className="hover:text-brand-600 transition-colors">
                  Local Hourly City Chauffeur
                </a>
              </li>
              <li>
                <a href="#airport" className="hover:text-brand-600 transition-colors">
                  Airport Direct Transfers
                </a>
              </li>
              <li>
                <a href="#wedding" className="hover:text-brand-600 transition-colors">
                  Wedding & Corporate Fleet
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Driver Partners & Fleet Owners */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              For Drivers & Partners
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-500">
              <li>
                <a href="#driver-register" className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                  <span>Register as Driver Partner</span>
                  <Sparkles className="w-3 h-3 text-adventure-500" />
                </a>
              </li>
              <li>
                <a href="#fleet-owner" className="hover:text-brand-600 transition-colors">
                  Attach Vehicle / Fleet
                </a>
              </li>
              <li>
                <a href="#zero-commission" className="hover:text-brand-600 transition-colors">
                  0% Commission Policy
                </a>
              </li>
              <li>
                <a href="#driver-safety" className="hover:text-brand-600 transition-colors">
                  Driver KYC & Verification Guide
                </a>
              </li>
              <li>
                <a href="#partner-support" className="hover:text-brand-600 transition-colors">
                  Driver Partner Helpline
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Legal Sub-Bar */}
      <div className="border-t border-slate-200 bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          
          <div className="flex items-center gap-1.5 text-slate-600">
            <span>© {new Date().getFullYear()} Touralink Technologies India Pvt. Ltd.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> for Indian Road Trips
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-6">
            <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#driver-agreement" className="hover:text-slate-900 transition-colors">Driver Agreement</a>
            <a href="#cancellation" className="hover:text-slate-900 transition-colors">Refund & Cancellation</a>
            <a href="#safety" className="hover:text-slate-900 transition-colors">Safety Standards</a>
          </div>

        </div>
      </div>

    </footer>
  );
}
