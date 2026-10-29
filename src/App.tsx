import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Product,
  Order,
  CartItem,
  CurrencyConfig,
  CompanyInfo,
  SocialMediaLink,
  SellerProfile,
  SupplierProfile,
  PaymentGatewayConfig,
  Review,
  SupportTicket,
  AuditLog,
  OrderStatus,
  ProductVariant,
} from './types';
import { storageService } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { BuyerPortal } from './components/buyer/BuyerPortal';
import { SellerPortal } from './components/seller/SellerPortal';
import { SupplierPortal } from './components/supplier/SupplierPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { PolicyModal } from './components/common/PolicyModal';
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  RotateCcw,
} from 'lucide-react';

export function App() {
  // Initialize storage
  useEffect(() => {
    storageService.initialize();
  }, []);

  // Main reactive state
  const [currentRole, setCurrentRole] = useState<UserRole>(() => storageService.getActiveRole());
  const [activeCurrency, setActiveCurrency] = useState<CurrencyConfig>(() => storageService.getActiveCurrency());
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>(() => storageService.getCurrencies());
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => storageService.getWishlist());
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => storageService.getCompanyInfo());
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(() => storageService.getSocialLinks());
  const [sellers, setSellers] = useState<SellerProfile[]>(() => storageService.getSellers());
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(() => storageService.getSuppliers());
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentGatewayConfig[]>(() => storageService.getPaymentConfigs());
  const [reviews, setReviews] = useState<Review[]>(() => storageService.getReviews());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => storageService.getTickets());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => storageService.getAuditLogs());

  // Navigation & Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [policyModalKey, setPolicyModalKey] = useState<'about' | 'contact' | 'privacy' | 'terms' | 'shipping' | 'refund' | 'faq' | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync state to storage
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    storageService.setActiveRole(role);
    showToast(`Switched portal view to: ${role.toUpperCase()}`);
  };

  const handleCurrencyChange = (currency: CurrencyConfig) => {
    setActiveCurrency(currency);
    storageService.setActiveCurrency(currency);
    showToast(`Display currency changed to ${currency.code} (${currency.symbol})`);
  };

  // Wishlist handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      storageService.saveWishlist(next);
      showToast(prev.includes(productId) ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return next;
    });
  };

  // Cart handlers
  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      const copy = [...prev];
      const existingIdx = copy.findIndex(
        i => i.product.id === product.id && i.selectedVariant?.id === variant?.id
      );
      if (existingIdx !== -1) {
        copy[existingIdx].quantity += quantity;
      } else {
        copy.push({ product, selectedVariant: variant, quantity });
      }
      storageService.saveCart(copy);
      return copy;
    });
    showToast(`Added "${product.title}" to Shopping Bag`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCart(prev => {
      const copy = [...prev];
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index].quantity = newQty;
      }
      storageService.saveCart(copy);
      return copy;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      storageService.saveCart(copy);
      return copy;
    });
    showToast('Item removed from Shopping Bag');
  };

  const handleClearCart = () => {
    setCart([]);
    storageService.saveCart([]);
  };

  const handleApplyCoupon = (code: string): boolean => {
    if (code === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
      setCouponDiscountPercent(10);
      showToast('10% Welcome Discount applied!');
      return true;
    }
    if (code === 'VIP20') {
      setAppliedCoupon('VIP20');
      setCouponDiscountPercent(20);
      showToast('20% VIP Patron Discount applied!');
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscountPercent(0);
    showToast('Coupon removed');
  };

  // Order placed handler
  const handleOrderPlaced = (newOrder: Order) => {
    storageService.createOrder(newOrder);
    setOrders(storageService.getOrders());
    setAuditLogs(storageService.getAuditLogs());
    showToast(`Order #${newOrder.orderNumber} successfully registered!`);
  };

  // Order status transition
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const updated = storageService.updateOrderStatus(orderId, status, note);
    if (updated) {
      setOrders(storageService.getOrders());
      setAuditLogs(storageService.getAuditLogs());
      showToast(`Order status updated to: ${status.toUpperCase()}`);
    }
  };

  // Seller handlers
  const handleRegisterSeller = (newSeller: SellerProfile) => {
    storageService.registerSeller(newSeller);
    setSellers(storageService.getSellers());
    setAuditLogs(storageService.getAuditLogs());
    showToast(`Application for ${newSeller.businessName} submitted!`);
  };

  const handleUpdateSellerStatus = (sellerId: string, status: SellerProfile['status']) => {
    storageService.updateSellerStatus(sellerId, status);
    setSellers(storageService.getSellers());
    setAuditLogs(storageService.getAuditLogs());
    showToast(`Seller status changed to ${status.toUpperCase()}`);
  };

  // Product addition
  const handleAddProduct = (newProduct: Product) => {
    storageService.addProduct(newProduct);
    setProducts(storageService.getProducts());
    setAuditLogs(storageService.getAuditLogs());
    showToast(`Added product "${newProduct.title}"!`);
  };

  // Company info and social links updates
  const handleUpdateCompanyInfo = (info: CompanyInfo) => {
    setCompanyInfo(info);
    storageService.saveCompanyInfo(info);
    setAuditLogs(storageService.getAuditLogs());
    showToast('Company information successfully saved!');
  };

  const handleUpdateSocialLinks = (links: SocialMediaLink[]) => {
    setSocialLinks(links);
    storageService.saveSocialLinks(links);
    setAuditLogs(storageService.getAuditLogs());
    showToast('Social media links and visibility saved!');
  };

  const handleUpdateCurrencies = (newCurrencies: CurrencyConfig[]) => {
    setCurrencies(newCurrencies);
    storageService.saveCurrencies(newCurrencies);
    showToast('Currency rates updated!');
  };

  const handleUpdatePaymentConfigs = (newConfigs: PaymentGatewayConfig[]) => {
    setPaymentConfigs(newConfigs);
    storageService.savePaymentConfigs(newConfigs);
    showToast('Payment gateways and COD rules updated!');
  };

  // Review submission
  const handleAddReview = (review: Review) => {
    storageService.addReview(review);
    setReviews(storageService.getReviews());
    showToast('Verified review submitted!');
  };

  // Ticket creation
  const handleCreateTicket = (ticket: SupportTicket) => {
    storageService.addTicket(ticket);
    setTickets(storageService.getTickets());
    showToast('Support ticket dispatched to concierge!');
  };

  // Reset demo data
  const handleResetDemoData = () => {
    storageService.resetToDefaults();
    setCurrentRole(storageService.getActiveRole());
    setActiveCurrency(storageService.getActiveCurrency());
    setCurrencies(storageService.getCurrencies());
    setProducts(storageService.getProducts());
    setOrders(storageService.getOrders());
    setCart(storageService.getCart());
    setWishlist(storageService.getWishlist());
    setCompanyInfo(storageService.getCompanyInfo());
    setSocialLinks(storageService.getSocialLinks());
    setSellers(storageService.getSellers());
    setSuppliers(storageService.getSuppliers());
    setPaymentConfigs(storageService.getPaymentConfigs());
    setReviews(storageService.getReviews());
    setTickets(storageService.getTickets());
    setAuditLogs(storageService.getAuditLogs());
    showToast('All demo records reset to pristine seed state.');
  };

  // Export data
  const handleExportData = () => {
    const jsonStr = storageService.exportFullDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhco-marketplace-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Snapshot exported successfully.');
  };

  const cartTotalUSD = cart.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0D] text-[#F1F1F3]">
      {/* Interactive Demo Mode Notice Banner */}
      <div className="bg-[#121216] border-b border-[#24242C] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E1C574] animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            DH&amp;Co Interactive Demo Prototype
          </span>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline">
            Active Role: <strong className="text-[#E1C574] uppercase">{currentRole}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRoleChange('buyer')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
              currentRole === 'buyer' ? 'bg-[#690D18] text-[#E1C574]' : 'bg-[#181820] text-gray-400 hover:text-white'
            }`}
          >
            Buyer Hub
          </button>
          <button
            onClick={() => handleRoleChange('seller')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
              currentRole === 'seller' ? 'bg-[#690D18] text-[#E1C574]' : 'bg-[#181820] text-gray-400 hover:text-white'
            }`}
          >
            Seller Portal
          </button>
          <button
            onClick={() => handleRoleChange('supplier')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
              currentRole === 'supplier' ? 'bg-[#690D18] text-[#E1C574]' : 'bg-[#181820] text-gray-400 hover:text-white'
            }`}
          >
            Supplier Hub
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
              currentRole === 'admin' ? 'bg-[#690D18] text-[#E1C574]' : 'bg-[#181820] text-gray-400 hover:text-white'
            }`}
          >
            Super Admin
          </button>

          <button
            onClick={handleResetDemoData}
            title="Reset to default seed state"
            className="p-1 text-gray-400 hover:text-white ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeCurrency={activeCurrency}
        currencies={currencies}
        onCurrencyChange={handleCurrencyChange}
        cartCount={cartTotalItems}
        cartTotal={cartTotalUSD}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          handleRoleChange('buyer');
        }}
        companyInfo={companyInfo}
        products={products}
        onSelectProduct={setSelectedProduct}
        activeCategory={activeCategory}
        onSelectCategory={cat => {
          setActiveCategory(cat);
          if (currentRole !== 'buyer') setCurrentRole('buyer');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateHome={() => {
          setCurrentRole('buyer');
          setActiveCategory('');
          setSearchQuery('');
        }}
        onOpenContact={() => setPolicyModalKey('contact')}
      />

      {/* Dynamic Main Body based on Active Role */}
      <main className="flex-1">
        {/* BUYER / STOREFRONT VIEW */}
        {currentRole === 'buyer' && (
          <div>
            {/* Show hero banner only when on home storefront with no search query */}
            {!activeCategory && !searchQuery && (
              <HeroBanner
                companyInfo={companyInfo}
                onExploreClick={() => {
                  const element = document.getElementById('catalog-grid');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                onBecomeSellerClick={() => handleRoleChange('seller')}
                onCategoryClick={cat => setActiveCategory(cat)}
              />
            )}

            <div id="catalog-grid">
              <ProductGrid
                products={products}
                activeCurrency={activeCurrency}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={setSelectedProduct}
                onQuickAddToCart={p => handleAddToCart(p, p.variants[0], 1)}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            </div>

            {/* Buyer Account & Consignments Section */}
            <div className="border-t border-[#1C1C22] bg-[#0E0E12]/80">
              <BuyerPortal
                orders={orders}
                wishlistProducts={wishlistProducts}
                activeCurrency={activeCurrency}
                onSelectProduct={setSelectedProduct}
                onAddToCart={p => handleAddToCart(p, p.variants[0], 1)}
                onRemoveWishlist={handleToggleWishlist}
                tickets={tickets}
                onCreateTicket={handleCreateTicket}
              />
            </div>
          </div>
        )}

        {/* SELLER PORTAL */}
        {currentRole === 'seller' && (
          <SellerPortal
            sellers={sellers}
            products={products}
            orders={orders}
            activeCurrency={activeCurrency}
            onRegisterSeller={handleRegisterSeller}
            onAddProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* SUPPLIER HUB */}
        {currentRole === 'supplier' && (
          <SupplierPortal
            suppliers={suppliers}
            products={products}
            orders={orders}
            activeCurrency={activeCurrency}
            onImportProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* SUPER ADMIN CONSOLE */}
        {currentRole === 'admin' && (
          <AdminPortal
            products={products}
            orders={orders}
            sellers={sellers}
            suppliers={suppliers}
            companyInfo={companyInfo}
            onUpdateCompanyInfo={handleUpdateCompanyInfo}
            socialLinks={socialLinks}
            onUpdateSocialLinks={handleUpdateSocialLinks}
            currencies={currencies}
            onUpdateCurrencies={handleUpdateCurrencies}
            paymentConfigs={paymentConfigs}
            onUpdatePaymentConfigs={handleUpdatePaymentConfigs}
            auditLogs={auditLogs}
            onUpdateSellerStatus={handleUpdateSellerStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onResetDemoData={handleResetDemoData}
            onExportData={handleExportData}
          />
        )}
      </main>

      {/* Main Footer */}
      <Footer
        companyInfo={companyInfo}
        socialLinks={socialLinks}
        onOpenPolicy={setPolicyModalKey}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          activeCurrency={activeCurrency}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, v, q) => {
            handleAddToCart(p, v, q);
            setSelectedProduct(null);
          }}
          onBuyNow={(p, v, q) => {
            handleAddToCart(p, v, q);
            setSelectedProduct(null);
            setIsCheckoutOpen(true);
          }}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        activeCurrency={activeCurrency}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        couponDiscountPercent={couponDiscountPercent}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        activeCurrency={activeCurrency}
        appliedCoupon={appliedCoupon}
        couponDiscountPercent={couponDiscountPercent}
        paymentConfigs={paymentConfigs}
        onOrderPlaced={handleOrderPlaced}
        onClearCart={handleClearCart}
      />

      {/* Corporate & Legal Policy Modal */}
      <PolicyModal
        policyKey={policyModalKey}
        onClose={() => setPolicyModalKey(null)}
        companyInfo={companyInfo}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14141B] border border-[#C9A646] text-[#E1C574] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slide-up">
          <Sparkles className="w-4 h-4 text-[#E1C574] shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
