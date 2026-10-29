import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe2, Clock } from 'lucide-react';
import { CompanyInfo } from '../../types';

interface HeroBannerProps {
  companyInfo: CompanyInfo;
  onExploreClick: () => void;
  onBecomeSellerClick: () => void;
  onCategoryClick: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  companyInfo,
  onExploreClick,
  onBecomeSellerClick,
  onCategoryClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#14080B] via-[#0B0B0D] to-[#0B0B0D] border-b border-[#24242C] py-16 lg:py-24">
      {/* Background radial glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#690D18]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A646]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#690D18]/40 border border-[#C9A646]/40 text-[#E1C574] text-xs font-bold tracking-wider uppercase shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#E1C574]" />
              <span>International Luxury Marketplace</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-tight">
                {companyInfo.brandName}
              </h1>
              <p className="text-xl sm:text-2xl font-serif tracking-widest text-[#E1C574] font-bold uppercase gold-gradient-text">
                {companyInfo.tagline}
              </p>
            </div>

            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Explore watches, leather goods, audio, and everyday essentials in the Daily Heaven & Company collection. Discover your next favorite, all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#690D18] via-[#8C1422] to-[#690D18] text-white font-bold text-sm tracking-wide border border-[#C9A646]/60 shadow-xl shadow-[#690D18]/30 hover:shadow-[#C9A646]/20 hover:border-[#E1C574] flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
              >
                <span>Shop Premier Collection</span>
                <ArrowRight className="w-4 h-4 text-[#E1C574]" />
              </button>

              <button
                onClick={onBecomeSellerClick}
                className="px-6 py-3.5 rounded-xl bg-[#14141A] hover:bg-[#1D1D24] text-[#E1C574] font-bold text-sm border border-[#C9A646]/40 hover:border-[#E1C574] transition-all"
              >
                Sell on DH&amp;Co
              </button>
            </div>

            {/* Micro Trust Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#C9A646]" />
                <span>150+ Countries Shipped</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A646]" />
                <span>Certified Vendor Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#C9A646]" />
                <span>Instant Mobile Checkout</span>
              </div>
            </div>
          </div>

          {/* Hero Featured Card / Vault Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#14141A] border border-[#C9A646]/30 p-6 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E1C574] animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    Curated Spotlight
                  </span>
                </div>
                <span className="text-[11px] bg-[#690D18] text-[#E1C574] font-bold px-2 py-0.5 rounded border border-[#C9A646]/40">
                  Global Vault
                </span>
              </div>

              {/* Showcase Image */}
              <div className="relative mt-4 rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer" onClick={() => onCategoryClick('Watches & Jewelry')}>
                <img
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80"
                  alt="Aethelgard Imperial Tourbillon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="text-[10px] text-[#E1C574] uppercase font-bold tracking-widest">
                    Aethelgard Genève • Caliber 8812
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    Imperial Tourbillon Mechanical Chronometer
                  </div>
                  <div className="text-xs text-gray-300 flex items-center justify-between mt-1">
                    <span className="font-semibold text-[#E1C574]">$349.00 USD</span>
                    <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                      In Stock: 24 units
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Category Chips */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5 text-center">
                <button
                  onClick={() => onCategoryClick('Watches & Jewelry')}
                  className="p-2 rounded-lg bg-[#0B0B0D] hover:bg-[#690D18]/30 border border-white/5 hover:border-[#C9A646]/40 transition-all text-xs"
                >
                  <div className="font-bold text-white">Watches</div>
                  <div className="text-[10px] text-[#77777F]">Timepieces</div>
                </button>
                <button
                  onClick={() => onCategoryClick('Fashion & Bags')}
                  className="p-2 rounded-lg bg-[#0B0B0D] hover:bg-[#690D18]/30 border border-white/5 hover:border-[#C9A646]/40 transition-all text-xs"
                >
                  <div className="font-bold text-white">Fashion</div>
                  <div className="text-[10px] text-[#77777F]">Italian Leather</div>
                </button>
                <button
                  onClick={() => onCategoryClick('Electronics & Gadgets')}
                  className="p-2 rounded-lg bg-[#0B0B0D] hover:bg-[#690D18]/30 border border-white/5 hover:border-[#C9A646]/40 transition-all text-xs"
                >
                  <div className="font-bold text-white">Audio Lab</div>
                  <div className="text-[10px] text-[#77777F]">ANC Spatial</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
