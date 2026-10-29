import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { CompanyInfo } from '../../types';

interface PolicyModalProps {
  policyKey: 'about' | 'contact' | 'privacy' | 'terms' | 'shipping' | 'refund' | 'faq' | null;
  onClose: () => void;
  companyInfo: CompanyInfo;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  policyKey,
  onClose,
  companyInfo,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!policyKey) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#C9A646]/50 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#24242F] bg-[#16161F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C9A646]" />
            <h3 className="text-base font-serif font-bold text-white capitalize">
              {policyKey === 'about' && 'About DH&Co'}
              {policyKey === 'contact' && 'VIP Customer Concierge & Contact'}
              {policyKey === 'privacy' && 'Privacy & Data Rights'}
              {policyKey === 'terms' && 'Terms of Service'}
              {policyKey === 'shipping' && 'Global Shipping & Logistics Policy'}
              {policyKey === 'refund' && 'Returns, Refunds & Exchange Policy'}
              {policyKey === 'faq' && 'Frequently Asked Questions (FAQ)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-xs text-gray-300 space-y-4 leading-relaxed">
          {policyKey === 'about' && (
            <div className="space-y-3">
              <div className="text-center pb-3 border-b border-white/5 space-y-1">
                <h4 className="text-lg font-serif font-bold text-white">{companyInfo.fullName}</h4>
                <p className="text-[#E1C574] font-semibold tracking-wider">"{companyInfo.tagline}"</p>
              </div>
              <p>
                Founded on the premise that exceptional craft, independent horology, and high-performance lifestyle technology should be accessible across every continent, <strong>DH&amp;Co</strong> connects verified international multi-vendor ateliers and automated dropshipping centers into one unified marketplace.
              </p>
              <p>
                Every seller is vetted for quality authenticity and ethical sourcing. Our platform supports native multi-currency checkout, tracked global couriers, and dedicated VIP customer concierge assistance.
              </p>
            </div>
          )}

          {policyKey === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0E0E12] border border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Mail className="w-3.5 h-3.5 text-[#C9A646]" />
                    <span>Official Email</span>
                  </div>
                  <a href={`mailto:${companyInfo.email}`} className="text-[#E1C574] hover:underline">
                    {companyInfo.email}
                  </a>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Phone className="w-3.5 h-3.5 text-[#C9A646]" />
                    <span>Direct Telephone</span>
                  </div>
                  <a href={`tel:${companyInfo.phone}`} className="text-[#E1C574] hover:underline">
                    {companyInfo.phone}
                  </a>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <MessageSquare className="w-3.5 h-3.5 text-[#C9A646]" />
                    <span>WhatsApp VIP Concierge</span>
                  </div>
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E1C574] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{companyInfo.whatsapp} (Click to open chat)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-bold text-white">Message Dispatched</div>
                  <p className="text-gray-300">
                    Thank you, {contactName}. A DH&amp;Co concierge specialist will reply to {contactEmail} within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Direct Concierge Message Form
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Inquiry or order assistance request..."
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#690D18] text-[#E1C574] font-bold"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {policyKey === 'shipping' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white">Global Dispatch &amp; Couriers</h4>
              <p>
                DH&amp;Co delivers worldwide via DHL Express, FedEx International, and registered national postal systems. All shipments include insured GPS tracking.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-400">
                <li><strong>Free Shipping:</strong> Automatically applied on orders of $150 USD or higher.</li>
                <li><strong>Express Air Priority:</strong> 2-4 business days worldwide with door-to-door signature.</li>
                <li><strong>Customs &amp; Tariffs:</strong> International orders include standardized commercial invoices for expedited customs processing.</li>
              </ul>
            </div>
          )}

          {policyKey === 'refund' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white">30-Day Inspection &amp; Returns</h4>
              <p>
                We stand behind every timepiece, leather article, and sound device. If an item does not meet your expectations, return it within 30 days of arrival in original packaging with serial tags intact for a 100% refund or exchange.
              </p>
              <p>
                To initiate a return, navigate to your Buyer Hub, select the order, and click "Request Return", or message our WhatsApp concierge at {companyInfo.whatsapp}.
              </p>
            </div>
          )}

          {policyKey === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white">Privacy &amp; Data Rights</h4>
              <p>
                Your privacy is paramount. DH&amp;Co never sells your personal information. Payment transactions are tokenized via certified PCI-DSS compliant providers. You retain the right to view, export, or request permanent deletion of your customer profile at any time.
              </p>
            </div>
          )}

          {policyKey === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white">Marketplace Terms &amp; Conditions</h4>
              <p>
                By placing an order on dailyheaven.com or our mobile apps, you agree to these Terms of Service. Sellers operating on DH&amp;Co must maintain verified commercial credentials, accurate product descriptions, and fulfill orders within published SLAs.
              </p>
            </div>
          )}

          {policyKey === 'faq' && (
            <div className="space-y-3">
              <div className="border-b border-white/5 pb-2">
                <div className="font-bold text-white">How does multi-currency pricing work?</div>
                <p className="text-gray-400">All prices dynamically convert in real time using updated foreign exchange rates with transparent decimal rounding.</p>
              </div>
              <div className="border-b border-white/5 pb-2">
                <div className="font-bold text-white">Is Cash on Delivery available worldwide?</div>
                <p className="text-gray-400">COD is enabled for qualifying orders in Malaysia, UAE, Saudi Arabia, and Singapore up to a $500 USD limit.</p>
              </div>
              <div className="border-b border-white/5 pb-2">
                <div className="font-bold text-white">How can I become an approved vendor?</div>
                <p className="text-gray-400">Switch to the "Seller" role tab in the top navigation, complete the onboarding application, and our Super Admin will review your verification credentials.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
