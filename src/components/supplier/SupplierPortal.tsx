import React, { useState } from 'react';
import {
  Truck,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  Plus,
  ArrowRight,
  Database,
  Layers,
} from 'lucide-react';
import { SupplierProfile, Product, Order, CurrencyConfig, DropshipImportPreview } from '../../types';
import { calculateDropshipPrice, formatPrice } from '../../utils/ecommerceCalculations';

interface SupplierPortalProps {
  suppliers: SupplierProfile[];
  products: Product[];
  orders: Order[];
  activeCurrency: CurrencyConfig;
  onImportProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  suppliers,
  products,
  orders,
  activeCurrency,
  onImportProduct,
  onUpdateOrderStatus,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProfile>(suppliers[0]);
  const [markupPercent, setMarkupPercent] = useState<number>(45);
  const [fixedFee, setFixedFee] = useState<number>(2.0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string>('');

  // Sample dropship import candidate feeds
  const candidateFeeds: DropshipImportPreview[] = [
    {
      supplierSku: 'CJ-TECH-9821',
      title: 'Titanium Magnetic Wireless MagSafe Power Vault 10,000mAh',
      category: 'Electronics & Gadgets',
      supplierCost: 18.50,
      shippingEstimate: 4.20,
      calculatedPrice: 0,
      marginPercent: 0,
      stock: 450,
      image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80',
      platform: 'CJdropshipping',
    },
    {
      supplierSku: 'DS-LUX-3301',
      title: 'Nordic Ultrasonic Solid Oak Aromatherapy Essential Oil Diffuser',
      category: 'Home & Kitchen',
      supplierCost: 14.80,
      shippingEstimate: 3.50,
      calculatedPrice: 0,
      marginPercent: 0,
      stock: 280,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      platform: 'DSers',
    },
    {
      supplierSku: 'AX-CHRONO-771',
      title: 'Ceramic Bezel GMT Automatic Sport Diving Watch 200M',
      category: 'Watches & Jewelry',
      supplierCost: 45.00,
      shippingEstimate: 6.00,
      calculatedPrice: 0,
      marginPercent: 0,
      stock: 95,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      platform: 'AliExpress',
    },
  ];

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setSyncFeedback('');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback(`Successfully synchronized ${selectedSupplier.name}. 4,820 SKUs live. Inventory quantities up to date.`);
    }, 1500);
  };

  const handleImportToCatalog = (item: DropshipImportPreview) => {
    const calc = calculateDropshipPrice(item.supplierCost, item.shippingEstimate, markupPercent, fixedFee);

    const newProd: Product = {
      id: `prod-ds-${Date.now()}`,
      title: item.title,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `Automated fulfillment direct via ${selectedSupplier.name}. Factory guaranteed with 14-day warranty.`,
      shortDescription: item.title,
      category: item.category,
      subcategory: 'Dropshipping Global Catalog',
      brand: 'Global Direct',
      price: calc.sellingPrice,
      compareAtPrice: Number((calc.sellingPrice * 1.35).toFixed(2)),
      costPrice: item.supplierCost,
      sku: item.supplierSku,
      barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      stock: item.stock,
      images: [item.image],
      variants: [],
      sellerId: 'seller-aura',
      sellerName: 'Titan Tech Global',
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      fulfillmentType: 'dropshipping',
      rating: 4.8,
      reviewCount: 14,
      isPublished: true,
      isApproved: true,
      isFeatured: false,
      isFlashSale: true,
      tags: ['Dropshipping', item.category],
      weightKg: 0.35,
      countryOfOrigin: 'International',
      returnPolicyDays: 14,
      specifications: {
        Supplier: selectedSupplier.name,
        APIPlatform: selectedSupplier.platform,
        DispatchOrigin: 'Shenzhen Logistics Hub',
      },
      createdAt: new Date().toISOString(),
    };

    onImportProduct(newProd);
    alert(`Imported "${item.title}" into marketplace catalog at ${formatPrice(calc.sellingPrice, activeCurrency)}!`);
  };

  // Orders awaiting dropshipping fulfillment
  const pendingDropshipOrders = orders.filter(o =>
    o.items.some(i => i.supplierId === selectedSupplier.id || i.fulfillmentStatus === 'purchased_from_supplier' || i.fulfillmentStatus === 'pending')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-[#14141B] rounded-2xl border border-[#C9A646]/30 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#690D18] to-[#0B0B0D] border-2 border-[#C9A646] flex items-center justify-center text-[#E1C574] shadow-lg">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-black text-white">
                Dropshipping &amp; Supplier Fulfillment Hub
              </h1>
              <span className="text-[10px] bg-[#690D18] text-[#E1C574] font-bold px-2 py-0.5 rounded border border-[#C9A646]/30 uppercase">
                Simulated Gateway
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Integrate CJdropshipping, DSers, AliExpress, and custom XML/CSV supplier feeds.
            </p>
          </div>
        </div>

        {/* Sync Trigger */}
        <button
          onClick={handleSimulateSync}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold border border-[#C9A646]/50 shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing Feeds...' : 'Sync Supplier Feeds'}</span>
        </button>
      </div>

      {syncFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Supplier Adapters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {suppliers.map(supp => (
          <div
            key={supp.id}
            onClick={() => setSelectedSupplier(supp)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedSupplier.id === supp.id
                ? 'bg-[#181822] border-[#C9A646] shadow-lg shadow-[#690D18]/15'
                : 'bg-[#121217] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-start text-xs mb-2">
              <span className="font-bold text-white">{supp.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                supp.connectionStatus === 'connected'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {supp.connectionStatus}
              </span>
            </div>

            <div className="text-[11px] text-gray-400 space-y-1">
              <div>Platform: <strong className="text-gray-200">{supp.platform}</strong></div>
              <div>Catalog: <strong className="text-[#E1C574]">{supp.catalogCount.toLocaleString()} SKUs</strong></div>
              <div className="text-[10px] text-gray-500">Last Sync: {supp.lastSyncTime}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Rule & Margin Configuration Engine */}
      <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Settings className="w-4 h-4 text-[#C9A646]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Automated Pricing &amp; Margin Engine ({selectedSupplier.name})
          </h3>
        </div>

        <p className="text-xs text-gray-400">
          Formula: <code className="text-[#E1C574] bg-black/40 px-2 py-0.5 rounded">Retail Price = (Supplier Cost + Shipping Est.) &times; (1 + Markup %) + Handling Fee</code>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Target Gross Markup (%)</label>
            <input
              type="number"
              min="10"
              max="300"
              value={markupPercent}
              onChange={e => setMarkupPercent(Number(e.target.value))}
              className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Fixed Handling Fee ($ USD)</label>
            <input
              type="number"
              min="0"
              value={fixedFee}
              onChange={e => setFixedFee(Number(e.target.value))}
              className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C9A646]"
            />
          </div>

          <div className="flex items-end">
            <div className="p-2.5 rounded-lg bg-[#0E0E12] border border-white/5 w-full text-center">
              <span className="text-gray-400">Sample $20 Cost: </span>
              <strong className="text-[#E1C574]">
                {formatPrice(calculateDropshipPrice(20, 4, markupPercent, fixedFee).sellingPrice, activeCurrency)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Import Feed Preview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-serif font-bold text-white">
              Candidate Items from {selectedSupplier.platform} Feed
            </h3>
            <p className="text-xs text-gray-400">Preview product margins before publishing to live DH&amp;Co storefront.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candidateFeeds.map(item => {
            const pricing = calculateDropshipPrice(item.supplierCost, item.shippingEstimate, markupPercent, fixedFee);
            return (
              <div key={item.supplierSku} className="bg-[#121217] rounded-xl border border-white/10 p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <img src={item.image} alt={item.title} className="w-full h-44 object-cover rounded-lg border border-white/10" />
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span className="text-[#C9A646] font-bold">{item.platform}</span>
                      <span>Stock: {item.stock}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2">{item.title}</h4>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="bg-[#0E0E12] p-2.5 rounded-lg border border-white/5 text-[11px] space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Supplier Cost:</span>
                      <span>${item.supplierCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping Estimate:</span>
                      <span>${item.shippingEstimate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold border-t border-white/5 pt-1">
                      <span>Calculated Retail:</span>
                      <span>{formatPrice(pricing.sellingPrice, activeCurrency)}</span>
                    </div>
                    <div className="flex justify-between text-[#E1C574] text-[10px]">
                      <span>Est. Margin:</span>
                      <span>{pricing.marginPercent}% (${pricing.grossProfit.toFixed(2)})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleImportToCatalog(item)}
                  className="w-full py-2.5 rounded-lg bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#C9A646]/40 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Import to Storefront</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplier Order Fulfillment Queue */}
      <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-serif font-bold text-white">
              Supplier Automated Purchase Order (PO) Queue
            </h3>
            <p className="text-xs text-gray-400">Simulate supplier PO generation and tracking sync.</p>
          </div>
        </div>

        <div className="space-y-3">
          {pendingDropshipOrders.map(ord => (
            <div key={ord.id} className="p-4 rounded-xl bg-[#0E0E12] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                  <span className="text-[10px] text-gray-400">({ord.items.length} items)</span>
                  <span className="text-[10px] bg-[#690D18] text-[#E1C574] px-1.5 py-0.5 rounded font-bold uppercase">
                    {ord.status}
                  </span>
                </div>
                <div className="text-gray-400 mt-1">
                  Buyer: {ord.customerName} • {ord.shippingAddress.country} • Payment: {ord.paymentMethod.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateOrderStatus(ord.id, 'shipped', 'Simulated CJ Logistics air cargo tracking generated: CJ-TRK-77491')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold hover:bg-emerald-900 transition-colors"
                >
                  Simulate PO Fulfillment &amp; Tracking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
