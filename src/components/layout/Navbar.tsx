import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Globe,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Phone,
  MessageSquare,
  User,
  Store,
  Truck,
  SlidersHorizontal,
} from 'lucide-react';
import { CurrencyConfig, UserRole, CompanyInfo, Product } from '../../types';
import { formatPrice } from '../../utils/ecommerceCalculations';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeCurrency: CurrencyConfig;
  currencies: CurrencyConfig[];
  onCurrencyChange: (currency: CurrencyConfig) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  companyInfo: CompanyInfo;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateHome: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeCurrency,
  currencies,
  onCurrencyChange,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  companyInfo,
  products,
  onSelectProduct,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  onOpenContact,
}) => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const categories = [
    'All Categories',
    'Watches & Jewelry',
    'Electronics & Gadgets',
    'Fashion & Bags',
    'Home & Kitchen',
    'Beauty & Personal Care',
  ];

  // Autocomplete search suggestions
  const filteredSuggestions = searchQuery.trim().length > 1
    ? products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0D]/95 backdrop-blur-md border-b border-[#24242A]">
      {/* Top Announcement Bar */}
      <div className="bg-[#690D18] text-white text-xs px-4 py-1.5 flex flex-wrap justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold tracking-wider text-[#E1C574]">
            <Sparkles className="w-3.5 h-3.5" />
            DH&amp;Co EXCLUSIVE
          </span>
          <span className="hidden sm:inline text-gray-200">
            {companyInfo.tagline}
          </span>
          <span className="bg-[#8C1422] text-[#E1C574] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            Free Worldwide Shipping $150+
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          {/* Quick Contact Links if made public */}
          {companyInfo.isWhatsappPublic && (
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#E1C574] hover:text-white transition-colors"
              title="Official WhatsApp Concierge"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp: {companyInfo.whatsapp}</span>
            </a>
          )}

          {companyInfo.isPhonePublic && (
            <a
              href={`tel:${companyInfo.phone}`}
              className="hidden lg:flex items-center gap-1 hover:text-[#E1C574] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{companyInfo.phone}</span>
            </a>
          )}

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-white hover:text-[#E1C574] px-2 py-0.5 rounded bg-black/30 border border-white/10"
              aria-label="Select Currency"
            >
              <span>{activeCurrency.flag}</span>
              <span className="font-bold">{activeCurrency.code}</span>
              <ChevronDown className="w-3 h-3 text-[#E1C574]" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-[#141418] border border-[#C9A646]/30 rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] text-[#77777F] uppercase tracking-wider font-bold border-b border-white/5">
                  Select Currency
                </div>
                {currencies.filter(c => c.isEnabled).map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      onCurrencyChange(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#690D18]/40 transition-colors ${
                      curr.code === activeCurrency.code ? 'text-[#E1C574] font-bold bg-[#690D18]/20' : 'text-gray-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </span>
                    <span className="text-[#77777F]">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="DH&Co Home"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#690D18] via-[#0B0B0D] to-[#8C1422] border border-[#C9A646]/60 flex items-center justify-center shadow-lg shadow-[#690D18]/30 group-hover:border-[#E1C574] transition-all">
              <span className="font-serif font-black text-lg text-[#E1C574] tracking-tight">DH</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl tracking-wider text-white group-hover:text-[#E1C574] transition-colors">
                  DH&amp;Co
                </span>
                <span className="text-[10px] bg-[#C9A646]/15 text-[#E1C574] px-1.5 py-0.5 rounded border border-[#C9A646]/30 font-medium">
                  GLOBAL
                </span>
              </div>
              <p className="text-[9px] text-[#77777F] tracking-widest uppercase font-semibold">
                Daily Heaven &amp; Company
              </p>
            </div>
          </button>

          {/* Search Bar with Autocomplete Dropdown */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search luxury chronometers, designer bags, spatial audio..."
                className="w-full bg-[#141418] border border-[#2B2B33] focus:border-[#C9A646] rounded-full py-2.5 pl-11 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C9A646] transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions list */}
            {searchFocused && filteredSuggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-[#16161B] border border-[#C9A646]/30 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5">
                <div className="px-4 py-2 text-[11px] text-[#E1C574] font-semibold tracking-wider uppercase bg-[#0B0B0D]">
                  Suggested Products
                </div>
                {filteredSuggestions.map(product => (
                  <button
                    key={product.id}
                    onMouseDown={() => onSelectProduct(product)}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#690D18]/25 flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-9 h-9 rounded object-cover border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white font-medium truncate">{product.title}</div>
                      <div className="text-[10px] text-[#77777F]">{product.category} • {product.brand}</div>
                    </div>
                    <div className="text-xs font-bold text-[#E1C574]">
                      {formatPrice(product.price, activeCurrency)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher & Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C9A646]/40 bg-[#141418] hover:border-[#E1C574] text-xs font-medium transition-all"
                title="Switch Portal Views in Demo Mode"
              >
                {currentRole === 'buyer' && <User className="w-3.5 h-3.5 text-[#E1C574]" />}
                {currentRole === 'seller' && <Store className="w-3.5 h-3.5 text-[#E1C574]" />}
                {currentRole === 'supplier' && <Truck className="w-3.5 h-3.5 text-[#E1C574]" />}
                {currentRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-[#E1C574]" />}
                <span className="capitalize text-white font-semibold">{currentRole}</span>
                <span className="text-[9px] bg-[#690D18] text-[#E1C574] px-1 py-0.2 rounded font-bold uppercase">Demo</span>
                <ChevronDown className="w-3 h-3 text-[#77777F]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-[#16161C] border border-[#C9A646]/40 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#77777F] uppercase tracking-wider border-b border-white/5">
                    Demo Role Selector
                  </div>
                  <button
                    onClick={() => { onRoleChange('buyer'); setRoleDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 text-xs hover:bg-[#690D18]/30 transition-colors ${currentRole === 'buyer' ? 'text-[#E1C574] font-bold bg-[#690D18]/15' : 'text-gray-300'}`}
                  >
                    <User className="w-4 h-4 text-[#C9A646]" />
                    <div>
                      <div>Buyer / Customer</div>
                      <div className="text-[10px] text-[#77777F]">Shop, cart, orders, reviews</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onRoleChange('seller'); setRoleDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 text-xs hover:bg-[#690D18]/30 transition-colors ${currentRole === 'seller' ? 'text-[#E1C574] font-bold bg-[#690D18]/15' : 'text-gray-300'}`}
                  >
                    <Store className="w-4 h-4 text-[#C9A646]" />
                    <div>
                      <div>Seller / Vendor</div>
                      <div className="text-[10px] text-[#77777F]">Storefront, products, payouts</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onRoleChange('supplier'); setRoleDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 text-xs hover:bg-[#690D18]/30 transition-colors ${currentRole === 'supplier' ? 'text-[#E1C574] font-bold bg-[#690D18]/15' : 'text-gray-300'}`}
                  >
                    <Truck className="w-4 h-4 text-[#C9A646]" />
                    <div>
                      <div>Supplier / Dropshipper</div>
                      <div className="text-[10px] text-[#77777F]">Catalog sync, PO fulfillment</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onRoleChange('admin'); setRoleDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 text-xs hover:bg-[#690D18]/30 transition-colors ${currentRole === 'admin' ? 'text-[#E1C574] font-bold bg-[#690D18]/15' : 'text-gray-300'}`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C9A646]" />
                    <div>
                      <div>Owner Super Admin</div>
                      <div className="text-[10px] text-[#77777F]">Platform, social, commission</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-lg text-gray-300 hover:text-[#E1C574] hover:bg-[#1C1C22] transition-colors"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#690D18] text-[#E1C574] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#C9A646]/50">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#690D18] hover:bg-[#8C1422] text-[#F1F1F3] border border-[#C9A646]/40 shadow-md shadow-[#690D18]/20 transition-all"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#E1C574]" />
              <span className="text-xs font-bold hidden sm:inline">
                {formatPrice(cartTotal, activeCurrency)}
              </span>
              <span className="bg-[#0B0B0D] text-[#E1C574] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#C9A646]/40">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search products, brands, luxury items..."
              className="w-full bg-[#141418] border border-[#2B2B33] rounded-lg py-2 pl-9 pr-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A646]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Strip */}
      <nav className="bg-[#121216] border-t border-[#1C1C22] overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-1 py-1.5 text-xs whitespace-nowrap">
          <div className="flex items-center gap-1">
            {categories.map(cat => {
              const isSelected = (cat === 'All Categories' && !activeCategory) || activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat === 'All Categories' ? '' : cat)}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    isSelected
                      ? 'bg-[#690D18] text-[#E1C574] font-semibold border border-[#C9A646]/40'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-[#77777F]">
            <button
              onClick={onOpenContact}
              className="hover:text-[#E1C574] transition-colors"
            >
              VIP Support
            </button>
            <span>•</span>
            <span className="text-[#E1C574] font-semibold">100% Authentic Guaranteed</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141418] border-b border-[#24242A] px-4 py-4 space-y-3">
          <div className="text-xs font-bold text-[#E1C574] uppercase tracking-wider">
            Switch Portal (Demo Mode)
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['buyer', 'seller', 'supplier', 'admin'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => {
                  onRoleChange(role);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize text-center border ${
                  currentRole === role
                    ? 'bg-[#690D18] text-[#E1C574] border-[#C9A646]'
                    : 'bg-[#0B0B0D] text-gray-300 border-[#24242A]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
            <span className="text-gray-400">Currency: {activeCurrency.code} ({activeCurrency.symbol})</span>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="text-[#E1C574] font-medium"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
