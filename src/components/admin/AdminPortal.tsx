import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Store,
  Truck,
  Settings,
  Share2,
  Building,
  CreditCard,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RotateCcw,
  Eye,
  Edit2,
  Save,
  Lock,
} from 'lucide-react';
import {
  Product,
  Order,
  SellerProfile,
  SupplierProfile,
  CompanyInfo,
  SocialMediaLink,
  CurrencyConfig,
  PaymentGatewayConfig,
  AuditLog,
  OrderStatus,
} from '../../types';
import { formatPrice } from '../../utils/ecommerceCalculations';

interface AdminPortalProps {
  products: Product[];
  orders: Order[];
  sellers: SellerProfile[];
  suppliers: SupplierProfile[];
  companyInfo: CompanyInfo;
  onUpdateCompanyInfo: (info: CompanyInfo) => void;
  socialLinks: SocialMediaLink[];
  onUpdateSocialLinks: (links: SocialMediaLink[]) => void;
  currencies: CurrencyConfig[];
  onUpdateCurrencies: (currencies: CurrencyConfig[]) => void;
  paymentConfigs: PaymentGatewayConfig[];
  onUpdatePaymentConfigs: (configs: PaymentGatewayConfig[]) => void;
  auditLogs: AuditLog[];
  onUpdateSellerStatus: (sellerId: string, status: SellerProfile['status']) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onResetDemoData: () => void;
  onExportData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  orders,
  sellers,
  suppliers,
  companyInfo,
  onUpdateCompanyInfo,
  socialLinks,
  onUpdateSocialLinks,
  currencies,
  onUpdateCurrencies,
  paymentConfigs,
  onUpdatePaymentConfigs,
  auditLogs,
  onUpdateSellerStatus,
  onUpdateOrderStatus,
  onResetDemoData,
  onExportData,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'sellers' | 'products' | 'orders' | 'payments' | 'currencies' | 'social' | 'company' | 'audit'
  >('overview');

  // Local state for editable Company Info
  const [editCompany, setEditCompany] = useState<CompanyInfo>({ ...companyInfo });
  const [companySaveNotice, setCompanySaveNotice] = useState(false);

  // Local state for editable Social Links
  const [editSocials, setEditSocials] = useState<SocialMediaLink[]>([...socialLinks]);
  const [socialSaveNotice, setSocialSaveNotice] = useState(false);

  // Currency form
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(currencies[0]);

  // Payment configs
  const [localPayments, setLocalPayments] = useState<PaymentGatewayConfig[]>([...paymentConfigs]);

  // Overall financial calculations
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'payment_processing' || o.status === 'processing');
  const pendingSellers = sellers.filter(s => s.status === 'pending');
  const estimatedCommissionRevenue = totalSales * 0.12; // average 12% marketplace take-rate
  const estimatedGrossProfit = orders.reduce((sum, o) => {
    const itemCost = o.items.reduce((s, i) => s + (i.costPrice * i.quantity), 0);
    return sum + (o.subtotal - itemCost);
  }, 0);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompanyInfo(editCompany);
    setCompanySaveNotice(true);
    setTimeout(() => setCompanySaveNotice(false), 3000);
  };

  const handleSaveSocials = () => {
    onUpdateSocialLinks(editSocials);
    setSocialSaveNotice(true);
    setTimeout(() => setSocialSaveNotice(false), 3000);
  };

  const handleToggleSocialVisibility = (id: string, key: keyof SocialMediaLink['visibility']) => {
    setEditSocials(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            visibility: {
              ...item.visibility,
              [key]: !item.visibility[key],
            },
          };
        }
        return item;
      })
    );
  };

  const handleToggleSocialEnabled = (id: string) => {
    setEditSocials(prev =>
      prev.map(item => (item.id === id ? { ...item, isEnabled: !item.isEnabled } : item))
    );
  };

  const handleUpdateSocialUrl = (id: string, newUrl: string) => {
    setEditSocials(prev =>
      prev.map(item => (item.id === id ? { ...item, url: newUrl } : item))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Super Admin Command Center Bar */}
      <div className="bg-[#14141B] rounded-2xl border border-[#C9A646]/40 p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#690D18] to-[#0B0B0D] border-2 border-[#C9A646] flex items-center justify-center text-[#E1C574] shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-black text-white">
                DH&amp;Co Super Admin Console
              </h1>
              <span className="text-[10px] bg-[#690D18] text-[#E1C574] font-bold px-2 py-0.5 rounded border border-[#C9A646]/30 uppercase">
                Owner Authorized
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Ultimate platform control: multi-vendor approvals, commissions, currencies, social links &amp; company settings.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportData}
            className="px-3.5 py-2 rounded-xl bg-[#1C1C24] hover:bg-[#282834] text-gray-200 text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-colors"
            title="Download full JSON snapshot"
          >
            <Download className="w-4 h-4 text-[#C9A646]" />
            <span>Export Snapshot</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all demo marketplace records to default seed state?')) {
                onResetDemoData();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 bg-[#101014] p-1.5 rounded-xl border border-white/10 text-xs scrollbar-none whitespace-nowrap">
        {[
          { key: 'overview', label: '1. Overview & Metrics', icon: TrendingUp },
          { key: 'sellers', label: `2. Sellers (${pendingSellers.length} Pending)`, icon: Store },
          { key: 'products', label: `3. Catalog (${products.length})`, icon: Package },
          { key: 'orders', label: `4. Orders (${orders.length})`, icon: FileText },
          { key: 'payments', label: '5. Payment & COD Rules', icon: CreditCard },
          { key: 'currencies', label: `6. Currencies (${currencies.length})`, icon: Globe },
          { key: 'social', label: '7. Social Media Links', icon: Share2 },
          { key: 'company', label: '8. Company Information', icon: Building },
          { key: 'audit', label: '9. Audit & Security', icon: Lock },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === tab.key
                  ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Gross Merchandise Value</span>
              <div className="text-2xl font-black text-[#E1C574]">${totalSales.toFixed(2)} USD</div>
              <span className="text-[10px] text-emerald-400 font-semibold">{orders.length} lifetime orders placed</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Estimated Commission Revenue</span>
              <div className="text-2xl font-black text-white">${estimatedCommissionRevenue.toFixed(2)} USD</div>
              <span className="text-[10px] text-gray-400">Based on 12% marketplace fee</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Estimated Gross Profit</span>
              <div className="text-2xl font-black text-emerald-400">${estimatedGrossProfit.toFixed(2)} USD</div>
              <span className="text-[10px] text-gray-400">Net after supplier/artisan costs</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141C] border border-white/10 space-y-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Action Items</span>
              <div className="text-xl font-bold text-amber-300">
                {pendingSellers.length} Sellers • {pendingOrders.length} Orders
              </div>
              <span className="text-[10px] text-gray-400">Awaiting owner review</span>
            </div>
          </div>

          {/* Quick status summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#14141C] rounded-2xl border border-white/10 p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#E1C574] uppercase tracking-wider">
                Supplier Connection Statuses
              </h3>
              <div className="space-y-2 text-xs">
                {suppliers.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-2.5 rounded-lg bg-[#0E0E12]">
                    <span className="font-bold text-white">{s.name} ({s.platform})</span>
                    <span className="text-emerald-400 font-semibold uppercase text-[10px]">{s.connectionStatus}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#14141C] rounded-2xl border border-white/10 p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#E1C574] uppercase tracking-wider">
                Recent Security Audit Logs
              </h3>
              <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-[#0E0E12] space-y-0.5">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span className="text-[#C9A646] font-bold">{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-300">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SELLER MANAGEMENT */}
      {activeTab === 'sellers' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Marketplace Sellers &amp; Ateliers</h3>
              <p className="text-xs text-gray-400">Approve onboarding applications, adjust commissions, or suspend accounts.</p>
            </div>
          </div>

          <div className="space-y-4">
            {sellers.map(s => (
              <div key={s.id} className="p-4 rounded-xl bg-[#0E0E12] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{s.businessName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      s.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : s.status === 'pending'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    Owner: {s.ownerName} ({s.email}) • Country: {s.country} • Currency: {s.payoutCurrency}
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    Commission: <strong className="text-[#E1C574]">{s.commissionRatePercent}% + ${s.fixedFeePerOrder}</strong> • Lifetime Sales: ${s.totalSales.toFixed(2)}
                  </div>
                  <p className="text-gray-500 text-[11px] italic max-w-lg">{s.storeDescription}</p>
                </div>

                <div className="flex items-center gap-2">
                  {s.status === 'pending' && (
                    <button
                      onClick={() => onUpdateSellerStatus(s.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 font-bold"
                    >
                      Approve Seller
                    </button>
                  )}
                  {s.status === 'approved' && (
                    <button
                      onClick={() => onUpdateSellerStatus(s.id, 'suspended')}
                      className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 font-bold"
                    >
                      Suspend
                    </button>
                  )}
                  {s.status === 'suspended' && (
                    <button
                      onClick={() => onUpdateSellerStatus(s.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 font-bold"
                    >
                      Re-Activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Product Catalog Moderation</h3>
              <p className="text-xs text-gray-400">{products.length} live articles published on DH&amp;Co marketplace.</p>
            </div>
          </div>

          <div className="space-y-3">
            {products.map(prod => (
              <div key={prod.id} className="p-3.5 rounded-xl bg-[#0E0E12] border border-white/5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{prod.title}</h4>
                    <div className="text-[10px] text-gray-400">
                      SKU: {prod.sku} • {prod.category} • Sold by: {prod.sellerName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-[#E1C574]">${prod.price.toFixed(2)} USD</div>
                  <div className="text-[10px] text-gray-400">Stock: {prod.stock} units</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-white">Centralized Order Management</h3>
            <p className="text-xs text-gray-400">Inspect full customer snapshots, update fulfillment statuses, and manage returns.</p>
          </div>

          <div className="space-y-4">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 rounded-xl bg-[#0E0E12] border border-white/5 space-y-3 text-xs">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <span className="font-mono font-bold text-white text-sm mr-2">{ord.orderNumber}</span>
                    <span className="text-gray-400">Customer: {ord.customerName} ({ord.customerEmail})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#E1C574] text-sm">${ord.total.toFixed(2)} {ord.currency}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#690D18] text-[#E1C574] uppercase">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2">
                  <div className="text-[11px] text-gray-400">
                    Payment: <strong className="text-white">{ord.paymentMethod.toUpperCase()}</strong> • Status: {ord.paymentStatus}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">Change Status:</span>
                    <select
                      value={ord.status}
                      onChange={e => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus, `Admin manual transition to ${e.target.value}`)}
                      className="bg-[#181822] border border-white/10 rounded px-2 py-1 text-white text-[11px]"
                    >
                      <option value="pending">pending</option>
                      <option value="payment_processing">payment_processing</option>
                      <option value="confirmed">confirmed</option>
                      <option value="processing">processing</option>
                      <option value="awaiting_supplier">awaiting_supplier</option>
                      <option value="shipped">shipped</option>
                      <option value="out_for_delivery">out_for_delivery</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENT GATEWAYS & COD SETTINGS */}
      {activeTab === 'payments' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Payment Gateways &amp; Cash on Delivery (COD)</h3>
              <p className="text-xs text-gray-400">Manage Stripe, PayPal, Apple Pay, and strict regional COD constraints.</p>
            </div>
            <button
              onClick={() => {
                onUpdatePaymentConfigs(localPayments);
                alert('Payment gateway and COD rules updated!');
              }}
              className="px-4 py-2 rounded-xl bg-[#690D18] text-[#E1C574] font-bold text-xs"
            >
              Save Payment Rules
            </button>
          </div>

          <div className="space-y-4">
            {localPayments.map((cfg, idx) => (
              <div key={cfg.id} className="p-4 rounded-xl bg-[#0E0E12] border border-white/5 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{cfg.name}</span>
                    <span className="text-[10px] bg-black/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                      {cfg.isTestMode ? 'Sandbox Simulator' : 'Live Gateway'}
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cfg.isEnabled}
                      onChange={e => {
                        const copy = [...localPayments];
                        copy[idx].isEnabled = e.target.checked;
                        setLocalPayments(copy);
                      }}
                      className="rounded accent-[#690D18]"
                    />
                    <span className="text-white font-bold">{cfg.isEnabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                <p className="text-gray-400 text-[11px]">{cfg.description}</p>

                {/* COD specific settings */}
                {cfg.provider === 'cod' && (
                  <div className="p-3 rounded-lg bg-[#14141E] border border-white/5 space-y-2 mt-2">
                    <span className="font-bold text-[#E1C574]">COD Restrictions:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 mb-1">COD Handling Fee ($ USD)</label>
                        <input
                          type="number"
                          value={cfg.codFee}
                          onChange={e => {
                            const copy = [...localPayments];
                            copy[idx].codFee = Number(e.target.value);
                            setLocalPayments(copy);
                          }}
                          className="w-full bg-[#0E0E12] border border-white/10 rounded p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Max Order Limit for COD ($ USD)</label>
                        <input
                          type="number"
                          value={cfg.codMaxOrderAmount}
                          onChange={e => {
                            const copy = [...localPayments];
                            copy[idx].codMaxOrderAmount = Number(e.target.value);
                            setLocalPayments(copy);
                          }}
                          className="w-full bg-[#0E0E12] border border-white/10 rounded p-1.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CURRENCIES & EXCHANGE RATES */}
      {activeTab === 'currencies' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Global Currency &amp; FX Markup Configuration</h3>
              <p className="text-xs text-gray-400">All prices dynamically convert against base USD with configurable margin buffer.</p>
            </div>
            <button
              onClick={() => {
                onUpdateCurrencies(currencies);
                alert('Currencies saved!');
              }}
              className="px-4 py-2 rounded-xl bg-[#690D18] text-[#E1C574] font-bold text-xs"
            >
              Save FX Rates
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {currencies.map((curr, idx) => (
              <div key={curr.code} className="p-4 rounded-xl bg-[#0E0E12] border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>{curr.flag}</span>
                    <span>{curr.code}</span>
                  </span>
                  <span className="text-[#E1C574] font-bold">{curr.symbol}</span>
                </div>
                <div className="space-y-1 text-gray-400">
                  <div className="flex justify-between">
                    <span>1 USD =</span>
                    <strong className="text-white">{curr.rate} {curr.code}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Buffer Markup:</span>
                    <span className="text-emerald-400">+{curr.markupPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SOCIAL MEDIA MANAGEMENT (CRITICAL REQUIREMENT #17) */}
      {activeTab === 'social' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#C9A646]" />
                <h3 className="text-base font-serif font-bold text-white">
                  Social Media &amp; Public Channel Settings
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure official URLs and select exactly where links are visible to public buyers (Storefront, Footer, Contact Page).
              </p>
            </div>

            <button
              onClick={handleSaveSocials}
              className="px-5 py-2.5 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] font-bold text-xs flex items-center gap-2 border border-[#C9A646]/50 shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Social Settings</span>
            </button>
          </div>

          {socialSaveNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Social media channel configurations and public visibility settings saved!</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            {editSocials.map(link => (
              <div
                key={link.id}
                className="p-4 rounded-xl bg-[#0E0E12] border border-white/5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.isEnabled}
                        onChange={() => handleToggleSocialEnabled(link.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#690D18]" />
                    </label>

                    <div>
                      <span className="font-bold text-white text-sm">{link.platform}</span>
                      <span className="text-[10px] text-gray-400 ml-2">({link.label})</span>
                    </div>
                  </div>

                  {/* Public Visibility Checkboxes */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-300 text-[11px]">
                    <span className="text-gray-500 font-semibold uppercase text-[10px]">Show On:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.visibility.publicStorefront}
                        onChange={() => handleToggleSocialVisibility(link.id, 'publicStorefront')}
                        className="rounded accent-[#690D18]"
                      />
                      <span>Storefront</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.visibility.footer}
                        onChange={() => handleToggleSocialVisibility(link.id, 'footer')}
                        className="rounded accent-[#690D18]"
                      />
                      <span>Footer</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.visibility.contactPage}
                        onChange={() => handleToggleSocialVisibility(link.id, 'contactPage')}
                        className="rounded accent-[#690D18]"
                      />
                      <span>Contact Page</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.visibility.buyerAccount}
                        onChange={() => handleToggleSocialVisibility(link.id, 'buyerAccount')}
                        className="rounded accent-[#690D18]"
                      />
                      <span>Buyer Portal</span>
                    </label>
                  </div>
                </div>

                {/* Profile URL Input */}
                <div>
                  <label className="block text-gray-400 text-[11px] mb-1">Official Profile / Contact URL:</label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={e => handleUpdateSocialUrl(link.id, e.target.value)}
                    placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                    className="w-full bg-[#16161E] border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: COMPANY INFORMATION (CRITICAL REQUIREMENT #18) */}
      {activeTab === 'company' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C9A646]" />
                <h3 className="text-base font-serif font-bold text-white">
                  Editable Company Information &amp; Official Records
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Owner controls official contact numbers, email, WhatsApp, and selects which are publicly visible to buyers.
              </p>
            </div>
          </div>

          {companySaveNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Company Information updated and synced with all headers and footers!</span>
            </div>
          )}

          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={editCompany.brandName}
                  onChange={e => setEditCompany({ ...editCompany, brandName: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Full Legal Corporate Name</label>
                <input
                  type="text"
                  required
                  value={editCompany.fullName}
                  onChange={e => setEditCompany({ ...editCompany, fullName: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Official Brand Tagline</label>
                <input
                  type="text"
                  required
                  value={editCompany.tagline}
                  onChange={e => setEditCompany({ ...editCompany, tagline: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Domain Name</label>
                <input
                  type="text"
                  required
                  value={editCompany.domain}
                  onChange={e => setEditCompany({ ...editCompany, domain: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-400">Official Contact Email</label>
                  <label className="flex items-center gap-1 text-[11px] text-[#E1C574] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editCompany.isEmailPublic}
                      onChange={e => setEditCompany({ ...editCompany, isEmailPublic: e.target.checked })}
                      className="rounded accent-[#690D18]"
                    />
                    <span>Public in Footer</span>
                  </label>
                </div>
                <input
                  type="email"
                  required
                  value={editCompany.email}
                  onChange={e => setEditCompany({ ...editCompany, email: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-400">Contact Phone Number</label>
                  <label className="flex items-center gap-1 text-[11px] text-[#E1C574] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editCompany.isPhonePublic}
                      onChange={e => setEditCompany({ ...editCompany, isPhonePublic: e.target.checked })}
                      className="rounded accent-[#690D18]"
                    />
                    <span>Public in Header</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={editCompany.phone}
                  onChange={e => setEditCompany({ ...editCompany, phone: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-400">WhatsApp Contact Number</label>
                  <label className="flex items-center gap-1 text-[11px] text-[#E1C574] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editCompany.isWhatsappPublic}
                      onChange={e => setEditCompany({ ...editCompany, isWhatsappPublic: e.target.checked })}
                      className="rounded accent-[#690D18]"
                    />
                    <span>Show WhatsApp Button</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={editCompany.whatsapp}
                  onChange={e => setEditCompany({ ...editCompany, whatsapp: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-400">Physical / Registered Office Address</label>
                  <label className="flex items-center gap-1 text-[11px] text-[#E1C574] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editCompany.isAddressPublic}
                      onChange={e => setEditCompany({ ...editCompany, isAddressPublic: e.target.checked })}
                      className="rounded accent-[#690D18]"
                    />
                    <span>Public in Footer</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={editCompany.publicAddressText}
                  onChange={e => setEditCompany({ ...editCompany, publicAddressText: e.target.value })}
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
                />
              </div>
            </div>

            {/* Emergency Owner Controls */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="font-bold text-amber-300 text-xs uppercase tracking-wider">
                Emergency &amp; Platform Controls
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#0E0E12] border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCompany.maintenanceMode}
                    onChange={e => setEditCompany({ ...editCompany, maintenanceMode: e.target.checked })}
                    className="rounded accent-[#690D18]"
                  />
                  <div>
                    <div className="font-bold text-white">Maintenance Mode</div>
                    <div className="text-[10px] text-gray-500">Show maintenance banner to public shoppers</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#0E0E12] border border-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCompany.orderAcceptanceActive}
                    onChange={e => setEditCompany({ ...editCompany, orderAcceptanceActive: e.target.checked })}
                    className="rounded accent-[#690D18]"
                  />
                  <div>
                    <div className="font-bold text-white">Order Acceptance Active</div>
                    <div className="text-[10px] text-gray-500">Allows customer checkout processing</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] font-bold text-xs uppercase tracking-wider border border-[#C9A646]/50 shadow-lg flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 9: AUDIT LOGS & SECURITY */}
      {activeTab === 'audit' && (
        <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Platform Security &amp; Audit Trail</h3>
              <p className="text-xs text-gray-400">Tamper-evident logs of administrative, seller approval, and order actions.</p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-[#0E0E12] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] bg-[#690D18] text-[#E1C574] px-1.5 py-0.2 rounded font-mono">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right text-[10px] text-gray-500 font-mono shrink-0">
                  <div>{log.actor}</div>
                  <div>{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
