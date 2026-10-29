import React, { useState } from 'react';
import {
  Store,
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
} from 'lucide-react';
import { SellerProfile, Product, Order, CurrencyConfig, ProductVariant } from '../../types';
import { formatPrice } from '../../utils/ecommerceCalculations';

interface SellerPortalProps {
  sellers: SellerProfile[];
  products: Product[];
  orders: Order[];
  activeCurrency: CurrencyConfig;
  onRegisterSeller: (seller: SellerProfile) => void;
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
}

export const SellerPortal: React.FC<SellerPortalProps> = ({
  sellers,
  products,
  orders,
  activeCurrency,
  onRegisterSeller,
  onAddProduct,
  onUpdateOrderStatus,
}) => {
  // We can pick an active seller for demo or allow registration
  const approvedSeller = sellers.find(s => s.status === 'approved') || sellers[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'payouts' | 'register'>('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Watches & Jewelry');
  const [newBrand, setNewBrand] = useState('Aura Luxe Chrono');
  const [newPrice, setNewPrice] = useState(199);
  const [newCostPrice, setNewCostPrice] = useState(80);
  const [newStock, setNewStock] = useState(25);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80');

  // Seller registration form
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('Malaysia');
  const [regType, setRegType] = useState<'business' | 'personal'>('business');
  const [regDescription, setRegDescription] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const sellerProducts = products.filter(p => p.sellerId === approvedSeller.id);
  const sellerOrders = orders.filter(o => o.items.some(i => i.sellerId === approvedSeller.id));

  const totalSellerRevenue = sellerProducts.reduce((sum, p) => sum + (p.price * 5), 0); // simulated sales

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd: Product = {
      id: `prod-sel-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDescription.trim() || 'Handcrafted luxury item verified by DH&Co atelier inspection.',
      shortDescription: newTitle.trim(),
      category: newCategory,
      subcategory: 'Artisan Atelier Collection',
      brand: newBrand.trim(),
      price: Number(newPrice),
      costPrice: Number(newCostPrice),
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      stock: Number(newStock),
      images: [newImageUrl],
      variants: [],
      sellerId: approvedSeller.id,
      sellerName: approvedSeller.businessName,
      fulfillmentType: 'seller_fulfilled',
      rating: 5.0,
      reviewCount: 0,
      isPublished: true,
      isApproved: true,
      isFeatured: false,
      isFlashSale: false,
      tags: ['New Arrival', newCategory],
      weightKg: 0.5,
      countryOfOrigin: approvedSeller.country,
      returnPolicyDays: 30,
      specifications: {
        Craftsmanship: 'Verified Artisan Atelier Handcrafted',
        Inspection: 'Passed 12-point DH&Co Quality Check',
      },
      createdAt: new Date().toISOString(),
    };

    onAddProduct(newProd);
    setNewTitle('');
    setShowAddProductModal(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regBusinessName.trim() || !regEmail.trim()) return;

    const newSeller: SellerProfile = {
      id: `seller-${Date.now()}`,
      businessName: regBusinessName.trim(),
      ownerName: regOwnerName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      sellerType: regType,
      country: regCountry,
      payoutCurrency: 'USD',
      status: 'pending',
      commissionRatePercent: 12.0,
      fixedFeePerOrder: 1.0,
      totalSales: 0,
      eligiblePayoutBalance: 0,
      storeDescription: regDescription.trim(),
      appliedAt: new Date().toISOString(),
    };

    onRegisterSeller(newSeller);
    setRegSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Seller Header */}
      <div className="bg-[#14141B] rounded-2xl border border-[#C9A646]/30 p-6 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#690D18] to-[#0B0B0D] border-2 border-[#C9A646] flex items-center justify-center text-[#E1C574] font-serif font-black text-xl shadow-lg">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-black text-white">
                {approvedSeller.businessName}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                approvedSeller.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {approvedSeller.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Owner: {approvedSeller.ownerName} • Commission Fee: {approvedSeller.commissionRatePercent}% + ${approvedSeller.fixedFeePerOrder} • Payout Currency: {approvedSeller.payoutCurrency}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-[#0B0B0D] p-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Catalog ({sellerProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Orders ({sellerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'payouts'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Payouts &amp; Statement
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Onboarding Application
          </button>
        </div>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Gross Merchandise Value</span>
              <div className="text-2xl font-black text-[#E1C574]">
                {formatPrice(approvedSeller.totalSales, activeCurrency)}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">+18.4% this cycle</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Eligible Payout Balance</span>
              <div className="text-2xl font-black text-white">
                {formatPrice(approvedSeller.eligiblePayoutBalance, activeCurrency)}
              </div>
              <span className="text-[10px] text-gray-400">Next remittance on 1st &amp; 15th</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Catalog SKUs</span>
              <div className="text-2xl font-black text-white">
                {sellerProducts.length}
              </div>
              <span className="text-[10px] text-[#C9A646]">All verified authentic</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Marketplace Fee</span>
              <div className="text-2xl font-black text-rose-300">
                {approvedSeller.commissionRatePercent}%
              </div>
              <span className="text-[10px] text-gray-400">+ ${approvedSeller.fixedFeePerOrder} order fee</span>
            </div>
          </div>

          {/* Quick Action banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#180A0E] via-[#14141C] to-[#180A0E] border border-[#C9A646]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Ready to list a new artisan collection?</h3>
              <p className="text-xs text-gray-400 mt-0.5">Submit product specifications for automated inspection and storefront publishing.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] font-bold text-xs flex items-center gap-2 border border-[#C9A646]/40 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Product</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Products Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-serif font-bold text-white">
              Atelier Product Listings ({sellerProducts.length})
            </h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellerProducts.map(prod => (
              <div key={prod.id} className="bg-[#121217] rounded-xl border border-white/10 p-4 space-y-3">
                <img src={prod.images[0]} alt={prod.title} className="w-full h-40 object-cover rounded-lg" />
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>SKU: {prod.sku}</span>
                    <span className="text-emerald-400 font-bold">{prod.stock} in stock</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">{prod.title}</h4>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-sm font-black text-[#E1C574]">{formatPrice(prod.price, activeCurrency)}</span>
                    <span className="text-[10px] text-gray-400">Cost: ${prod.costPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-base font-serif font-bold text-white">Seller Order Dispatch Queue</h3>
          {sellerOrders.length > 0 ? (
            sellerOrders.map(ord => (
              <div key={ord.id} className="p-4 rounded-xl bg-[#121217] border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono text-[#E1C574] font-bold mr-2">{ord.orderNumber}</span>
                    <span className="text-gray-300">Customer: {ord.customerName} ({ord.shippingAddress.country})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#690D18] text-[#E1C574] uppercase">
                      {ord.status}
                    </span>
                    {ord.status === 'confirmed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'processing', 'Seller packed product into branded box.')}
                        className="px-2 py-1 rounded bg-blue-900 text-blue-200 text-[10px] font-bold"
                      >
                        Mark Packed
                      </button>
                    )}
                    {ord.status === 'processing' && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'shipped', 'Handed over to courier with tracking.')}
                        className="px-2 py-1 rounded bg-emerald-900 text-emerald-200 text-[10px] font-bold"
                      >
                        Dispatch &amp; Ship
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-[#121217] rounded-xl text-gray-400 text-xs">
              No orders assigned to your storefront at this time.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Payouts & Commission Statement */}
      {activeTab === 'payouts' && (
        <div className="bg-[#121217] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Settlement &amp; Commission Statement</h3>
              <p className="text-xs text-gray-400">All payouts calculated and validated server-side in production.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-[#1C1C24] hover:bg-[#282834] text-gray-200 text-xs font-bold flex items-center gap-2 border border-white/10">
              <FileText className="w-4 h-4 text-[#C9A646]" />
              <span>Download Statement (PDF)</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0E0E12] border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Gross Marketplace Orders Handled:</span>
              <span className="text-white font-bold">{formatPrice(approvedSeller.totalSales, activeCurrency)}</span>
            </div>
            <div className="flex justify-between text-rose-300">
              <span>DH&amp;Co Platform Commission (10%):</span>
              <span>-{formatPrice(approvedSeller.totalSales * 0.1, activeCurrency)}</span>
            </div>
            <div className="flex justify-between text-rose-300">
              <span>Fixed Handling Fees (Estimated):</span>
              <span>-{formatPrice(24.0, activeCurrency)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-white/10">
              <span>Net Eligible Payout Balance:</span>
              <span className="text-base">{formatPrice(approvedSeller.eligiblePayoutBalance, activeCurrency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Seller Registration / Onboarding Form */}
      {activeTab === 'register' && (
        <div className="bg-[#121217] rounded-2xl border border-white/10 p-6 max-w-2xl mx-auto space-y-5">
          <div>
            <h3 className="text-base font-serif font-bold text-white">
              Seller &amp; Artisan Onboarding Application
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Apply to become an approved DH&amp;Co vendor. Applications are reviewed by Super Admin.
            </p>
          </div>

          {regSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">Application Received!</div>
              <p className="text-xs text-gray-300">
                Your application for <strong>{regBusinessName}</strong> has been registered in the platform audit log. The Super Admin can now review and approve your account from the Admin Portal.
              </p>
              <button
                onClick={() => setRegSuccess(false)}
                className="px-4 py-2 rounded-lg bg-[#690D18] text-[#E1C574] text-xs font-bold"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Business / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Silk & Cashmere"
                    value={regBusinessName}
                    onChange={e => setRegBusinessName(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Legal Representative Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={regOwnerName}
                    onChange={e => setRegOwnerName(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@brand.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Business Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+60..."
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Storefront Description &amp; Heritage</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your craft, materials, origin, and certifications..."
                  value={regDescription}
                  onChange={e => setRegDescription(e.target.value)}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#16161F] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Upload className="w-4 h-4 text-[#C9A646]" />
                  <span>Verification Documents (Simulated Upload)</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Certificate of incorporation and quality test reports simulated for testing.
                </p>
                <div className="text-[10px] text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
                  &check; Mock Business License Attached: CERT-MY-2026-DHCO.pdf
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] font-bold text-xs uppercase tracking-wider border border-[#C9A646]/50 shadow-lg transition-all"
              >
                Submit Seller Application
              </button>
            </form>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141C] border border-[#C9A646]/50 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Submit New Product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Chronometer Limited Edition"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  >
                    <option value="Watches & Jewelry">Watches &amp; Jewelry</option>
                    <option value="Fashion & Bags">Fashion &amp; Bags</option>
                    <option value="Electronics & Gadgets">Electronics &amp; Gadgets</option>
                    <option value="Home & Kitchen">Home &amp; Kitchen</option>
                    <option value="Beauty & Personal Care">Beauty &amp; Personal Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={e => setNewBrand(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Retail Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Atelier Cost ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newCostPrice}
                    onChange={e => setNewCostPrice(Number(e.target.value))}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-3 py-1.5 rounded-lg text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#690D18] text-[#E1C574] font-bold"
                >
                  Save &amp; Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
