import React from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { CompanyInfo, SocialMediaLink } from '../../types';

interface FooterProps {
  companyInfo: CompanyInfo;
  socialLinks: SocialMediaLink[];
  onOpenPolicy: (policyKey: 'about' | 'contact' | 'privacy' | 'terms' | 'shipping' | 'refund' | 'faq') => void;
}

export const Footer: React.FC<FooterProps> = ({
  companyInfo,
  socialLinks,
  onOpenPolicy,
}) => {
  // Filter social links that owner has enabled and made visible on public footer
  const publicFooterSocials = socialLinks
    .filter(link => link.isEnabled && link.visibility.footer)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <footer className="bg-[#0B0B0D] text-gray-400 border-t border-[#1F1F26] text-sm">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-[#1A1A22] bg-[#101014] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#690D18]/30 border border-[#C9A646]/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#E1C574]" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold tracking-wide uppercase">Global Delivery</h4>
              <p className="text-[11px] text-gray-400">Doorstep courier to 150+ countries</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#690D18]/30 border border-[#C9A646]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E1C574]" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold tracking-wide uppercase">100% Authentic</h4>
              <p className="text-[11px] text-gray-400">Verified multi-vendor artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#690D18]/30 border border-[#C9A646]/30 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-[#E1C574]" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold tracking-wide uppercase">30-Day Guarantee</h4>
              <p className="text-[11px] text-gray-400">Hassle-free return &amp; refund protection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#690D18]/30 border border-[#C9A646]/30 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-[#E1C574]" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold tracking-wide uppercase">VIP Concierge</h4>
              <p className="text-[11px] text-gray-400">Direct WhatsApp &amp; Email support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Tagline Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#690D18] via-[#0B0B0D] to-[#8C1422] border border-[#C9A646]/60 flex items-center justify-center shadow-lg">
                <span className="font-serif font-black text-lg text-[#E1C574]">DH</span>
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white tracking-wider">DH&amp;Co</span>
                <p className="text-[10px] text-[#77777F] uppercase tracking-widest font-semibold">
                  {companyInfo.fullName}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#E1C574] font-medium tracking-wide">
              "{companyInfo.tagline}"
            </p>

            <p className="text-xs text-gray-400 leading-relaxed pr-4">
              DH&amp;Co connects global buyers, certified independent ateliers, and premier dropshipping fulfillment partners in a unified, secure international commerce ecosystem.
            </p>

            {/* Public Contact Details */}
            <div className="space-y-2 text-xs pt-2">
              {companyInfo.isEmailPublic && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C9A646]" />
                  <a href={`mailto:${companyInfo.email}`} className="text-gray-300 hover:text-[#E1C574] transition-colors">
                    {companyInfo.email}
                  </a>
                </div>
              )}

              {companyInfo.isPhonePublic && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C9A646]" />
                  <a href={`tel:${companyInfo.phone}`} className="text-gray-300 hover:text-[#E1C574] transition-colors">
                    {companyInfo.phone}
                  </a>
                </div>
              )}

              {companyInfo.isWhatsappPublic && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C9A646]" />
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20DH%26Co%20Team`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E1C574] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>WhatsApp VIP: {companyInfo.whatsapp}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {companyInfo.isAddressPublic && companyInfo.publicAddressText && (
                <div className="flex items-start gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-[#C9A646] shrink-0 mt-0.5" />
                  <span>{companyInfo.publicAddressText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenPolicy('faq')} className="hover:text-[#E1C574] transition-colors">
                  Help Center &amp; FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('contact')} className="hover:text-[#E1C574] transition-colors">
                  Contact Support Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-[#E1C574] transition-colors">
                  Shipping &amp; Courier Zones
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('refund')} className="hover:text-[#E1C574] transition-colors">
                  Returns &amp; Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('contact')} className="hover:text-[#E1C574] transition-colors">
                  Track Consignment
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Corporate */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenPolicy('about')} className="hover:text-[#E1C574] transition-colors">
                  About DH&amp;Co
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#E1C574] transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-[#E1C574] transition-colors">
                  Privacy &amp; Data Rights
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#E1C574] transition-colors">
                  Seller Merchant Agreement
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-[#E1C574] transition-colors">
                  Dropshipping Compliance
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media & Payment Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Connect With Us
            </h4>
            <p className="text-xs text-gray-400">
              Follow our official channels for private drops, flash vaults, and product drops.
            </p>

            {/* Dynamic Owner-Controlled Social Links */}
            <div className="flex flex-wrap gap-2 pt-1">
              {publicFooterSocials.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded bg-[#16161C] border border-[#2B2B33] hover:border-[#C9A646] text-xs text-gray-300 hover:text-[#E1C574] flex items-center gap-1.5 transition-all shadow-sm"
                  title={link.label}
                >
                  <span className="font-semibold">{link.platform}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
              {publicFooterSocials.length === 0 && (
                <span className="text-xs text-gray-500 italic">No public social channels visible.</span>
              )}
            </div>

            <div className="pt-3">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Supported Payment Methods
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Visa', 'MasterCard', 'Amex', 'Apple Pay', 'Google Pay', 'PayPal', 'COD'].map(badge => (
                  <span
                    key={badge}
                    className="px-2 py-0.5 rounded bg-[#18181E] border border-white/10 text-[10px] font-bold text-gray-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#1C1C22] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#77777F]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#C9A646]" />
            <span>&copy; {new Date().getFullYear()} {companyInfo.fullName} ({companyInfo.domain}). All rights reserved.</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-gray-500">
            <span className="text-[#C9A646] font-semibold">Demo Sandbox:</span> Multi-vendor, dropshipping feeds, and payment gateways operate in typed simulation mode.
          </div>
        </div>
      </div>
    </footer>
  );
};
