import {
  Product,
  CurrencyConfig,
  CompanyInfo,
  SocialMediaLink,
  SellerProfile,
  SupplierProfile,
  Order,
  PaymentGatewayConfig,
  Review,
  SupportTicket,
  AuditLog,
  CartItem,
  UserRole,
} from '../types';

import {
  INITIAL_CURRENCIES,
  INITIAL_COMPANY_INFO,
  INITIAL_SOCIAL_LINKS,
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
  INITIAL_SUPPLIERS,
  INITIAL_ORDERS,
  INITIAL_PAYMENT_CONFIGS,
  INITIAL_REVIEWS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUDIT_LOGS,
} from './mockData';

const STORAGE_KEYS = {
  VERSION: 'dhco_storage_version',
  ACTIVE_ROLE: 'dhco_active_role',
  ACTIVE_CURRENCY: 'dhco_active_currency',
  PRODUCTS: 'dhco_products',
  ORDERS: 'dhco_orders',
  CART: 'dhco_cart',
  WISHLIST: 'dhco_wishlist',
  CURRENCIES: 'dhco_currencies',
  COMPANY_INFO: 'dhco_company_info',
  SOCIAL_LINKS: 'dhco_social_links',
  SELLERS: 'dhco_sellers',
  SUPPLIERS: 'dhco_suppliers',
  PAYMENTS: 'dhco_payment_configs',
  REVIEWS: 'dhco_reviews',
  TICKETS: 'dhco_support_tickets',
  AUDIT_LOGS: 'dhco_audit_logs',
};

const CURRENT_VERSION = '1.0.0';

// This cache only bridges synchronous React reads; Netlify Database persists all values.
const cache: Record<string, unknown> = {};
let pending: Record<string, unknown> = {};
let timer: ReturnType<typeof setTimeout> | undefined;
let saving = false;

export async function loadStorage(): Promise<void> {
  const response = await fetch('/api/demo-state', { credentials: 'same-origin' });
  if (!response.ok) throw new Error('Your demo session could not be loaded.');
  Object.assign(cache, await response.json());
  storageService.initialize();
}

async function flushStorage(): Promise<void> {
  if (saving || !Object.keys(pending).length) return;
  saving = true;
  const changes = pending;
  pending = {};
  try {
    const response = await fetch('/api/demo-state', {
      method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes), keepalive: true,
    });
    if (!response.ok) throw new Error('Save failed');
    window.dispatchEvent(new CustomEvent('dhco-storage-status', { detail: 'saved' }));
  } catch {
    pending = { ...changes, ...pending };
    window.dispatchEvent(new CustomEvent('dhco-storage-status', { detail: 'error' }));
    timer = setTimeout(flushStorage, 5000);
  } finally {
    saving = false;
    if (Object.keys(pending).length) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { timer = undefined; void flushStorage(); }, 5000);
    }
  }
}

window.addEventListener('pagehide', () => { void flushStorage(); });

function safeGet<T>(key: string, fallback: T): T {
  return (cache[key] === undefined ? fallback : cache[key]) as T;
}

function safeSet<T>(key: string, value: T): void {
  cache[key] = structuredClone(value);
  pending[key] = cache[key];
  window.dispatchEvent(new CustomEvent('dhco-storage-status', { detail: 'saving' }));
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { timer = undefined; void flushStorage(); }, 150);
}

export const storageService = {
  // Initialize storage if first time or version mismatch
  initialize(): void {
    const version = safeGet(STORAGE_KEYS.VERSION, null);
    if (!version || version !== CURRENT_VERSION) {
      this.resetToDefaults();
    }
  },

  resetToDefaults(): void {
    safeSet(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    safeSet(STORAGE_KEYS.ACTIVE_ROLE, 'buyer' as UserRole);
    safeSet(STORAGE_KEYS.ACTIVE_CURRENCY, INITIAL_CURRENCIES[0]);
    safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeSet(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    safeSet(STORAGE_KEYS.CART, [] as CartItem[]);
    safeSet(STORAGE_KEYS.WISHLIST, []);
    safeSet(STORAGE_KEYS.CURRENCIES, INITIAL_CURRENCIES);
    safeSet(STORAGE_KEYS.COMPANY_INFO, INITIAL_COMPANY_INFO);
    safeSet(STORAGE_KEYS.SOCIAL_LINKS, INITIAL_SOCIAL_LINKS);
    safeSet(STORAGE_KEYS.SELLERS, INITIAL_SELLERS);
    safeSet(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    safeSet(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENT_CONFIGS);
    safeSet(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    safeSet(STORAGE_KEYS.TICKETS, INITIAL_SUPPORT_TICKETS);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  // Role
  getActiveRole(): UserRole {
    return safeGet<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'buyer');
  },
  setActiveRole(role: UserRole): void {
    safeSet(STORAGE_KEYS.ACTIVE_ROLE, role);
  },

  // Currency
  getActiveCurrency(): CurrencyConfig {
    return safeGet<CurrencyConfig>(STORAGE_KEYS.ACTIVE_CURRENCY, INITIAL_CURRENCIES[0]);
  },
  setActiveCurrency(currency: CurrencyConfig): void {
    safeSet(STORAGE_KEYS.ACTIVE_CURRENCY, currency);
  },
  getCurrencies(): CurrencyConfig[] {
    return safeGet<CurrencyConfig[]>(STORAGE_KEYS.CURRENCIES, INITIAL_CURRENCIES);
  },
  saveCurrencies(list: CurrencyConfig[]): void {
    safeSet(STORAGE_KEYS.CURRENCIES, list);
  },

  // Products
  getProducts(): Product[] {
    return safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProducts(products: Product[]): void {
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  },
  addProduct(product: Product): void {
    const list = this.getProducts();
    list.unshift(product);
    this.saveProducts(list);
    this.addAuditLog('super_admin', 'Created Product', `Added product "${product.title}" (${product.sku})`);
  },
  updateProduct(product: Product): void {
    const list = this.getProducts();
    const idx = list.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      list[idx] = product;
      this.saveProducts(list);
    }
  },

  // Orders
  getOrders(): Order[] {
    return safeGet<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  saveOrders(orders: Order[]): void {
    safeSet(STORAGE_KEYS.ORDERS, orders);
  },
  createOrder(order: Order): void {
    const list = this.getOrders();
    list.unshift(order);
    this.saveOrders(list);
    this.addAuditLog('system', 'New Order Placed', `Order ${order.orderNumber} placed by ${order.customerName} for total ${order.currency} ${order.total}`);
  },
  updateOrderStatus(orderId: string, status: Order['status'], note?: string): Order | null {
    const list = this.getOrders();
    const order = list.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      order.timeline.push({
        id: `tl-${Date.now()}`,
        status,
        title: `Status updated to ${status.replace(/_/g, ' ').toUpperCase()}`,
        description: note || `Order status updated via platform console.`,
        timestamp: new Date().toLocaleString(),
      });
      this.saveOrders(list);
      this.addAuditLog('admin', 'Order Status Transition', `Order ${order.orderNumber} changed to ${status}`);
      return order;
    }
    return null;
  },

  // Cart
  getCart(): CartItem[] {
    return safeGet<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  saveCart(cart: CartItem[]): void {
    safeSet(STORAGE_KEYS.CART, cart);
  },

  // Wishlist
  getWishlist(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.WISHLIST, []);
  },
  saveWishlist(ids: string[]): void {
    safeSet(STORAGE_KEYS.WISHLIST, ids);
  },

  // Company Info
  getCompanyInfo(): CompanyInfo {
    return safeGet<CompanyInfo>(STORAGE_KEYS.COMPANY_INFO, INITIAL_COMPANY_INFO);
  },
  saveCompanyInfo(info: CompanyInfo): void {
    safeSet(STORAGE_KEYS.COMPANY_INFO, info);
    this.addAuditLog('admin', 'Company Info Updated', 'Owner edited public contact & brand details.');
  },

  // Social Links
  getSocialLinks(): SocialMediaLink[] {
    return safeGet<SocialMediaLink[]>(STORAGE_KEYS.SOCIAL_LINKS, INITIAL_SOCIAL_LINKS);
  },
  saveSocialLinks(links: SocialMediaLink[]): void {
    safeSet(STORAGE_KEYS.SOCIAL_LINKS, links);
    this.addAuditLog('admin', 'Social Links Updated', `Saved ${links.length} social media profile settings.`);
  },

  // Sellers
  getSellers(): SellerProfile[] {
    return safeGet<SellerProfile[]>(STORAGE_KEYS.SELLERS, INITIAL_SELLERS);
  },
  saveSellers(sellers: SellerProfile[]): void {
    safeSet(STORAGE_KEYS.SELLERS, sellers);
  },
  updateSellerStatus(sellerId: string, status: SellerProfile['status']): void {
    const sellers = this.getSellers();
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
      seller.status = status;
      if (status === 'approved') seller.approvedAt = new Date().toISOString();
      this.saveSellers(sellers);
      this.addAuditLog('admin', 'Seller Status Changed', `Seller ${seller.businessName} set to ${status}`);
    }
  },
  registerSeller(seller: SellerProfile): void {
    const list = this.getSellers();
    list.unshift(seller);
    this.saveSellers(list);
    this.addAuditLog('seller', 'New Seller Registration', `${seller.businessName} submitted onboarding application.`);
  },

  // Suppliers
  getSuppliers(): SupplierProfile[] {
    return safeGet<SupplierProfile[]>(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  },
  saveSuppliers(suppliers: SupplierProfile[]): void {
    safeSet(STORAGE_KEYS.SUPPLIERS, suppliers);
  },

  // Payments
  getPaymentConfigs(): PaymentGatewayConfig[] {
    return safeGet<PaymentGatewayConfig[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENT_CONFIGS);
  },
  savePaymentConfigs(configs: PaymentGatewayConfig[]): void {
    safeSet(STORAGE_KEYS.PAYMENTS, configs);
    this.addAuditLog('admin', 'Payment Gateways Updated', 'Payment providers, COD rules, and credentials configuration saved.');
  },

  // Reviews
  getReviews(): Review[] {
    return safeGet<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  addReview(review: Review): void {
    const list = this.getReviews();
    list.unshift(review);
    safeSet(STORAGE_KEYS.REVIEWS, list);
  },

  // Support Tickets
  getTickets(): SupportTicket[] {
    return safeGet<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_SUPPORT_TICKETS);
  },
  saveTickets(tickets: SupportTicket[]): void {
    safeSet(STORAGE_KEYS.TICKETS, tickets);
  },
  addTicket(ticket: SupportTicket): void {
    const list = this.getTickets();
    list.unshift(ticket);
    this.saveTickets(list);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return safeGet<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(actor: string, action: string, details: string, category: AuditLog['category'] = 'security'): void {
    const list = this.getAuditLogs();
    list.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      role: actor.includes('admin') ? 'super_admin' : 'system',
      action,
      category,
      details,
    });
    // keep max 100 logs
    if (list.length > 100) list.pop();
    safeSet(STORAGE_KEYS.AUDIT_LOGS, list);
  },

  // Export / Import
  exportFullDataJson(): string {
    const dump = {
      version: CURRENT_VERSION,
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      orders: this.getOrders(),
      sellers: this.getSellers(),
      suppliers: this.getSuppliers(),
      companyInfo: this.getCompanyInfo(),
      socialLinks: this.getSocialLinks(),
      currencies: this.getCurrencies(),
      paymentConfigs: this.getPaymentConfigs(),
    };
    return JSON.stringify(dump, null, 2);
  },
};
