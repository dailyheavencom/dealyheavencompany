export type UserRole = 'buyer' | 'seller' | 'supplier' | 'admin';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number; // relative to USD (1 USD = rate)
  decimals: number;
  markupPercent: number; // owner configurable markup
  symbolPosition: 'before' | 'after';
  isEnabled: boolean;
  isSettlementCurrency: boolean;
  flag: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Space Grey / 44mm"
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  attributes: Record<string, string>; // { Color: "Midnight", Size: "44mm" }
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number; // base in USD
  compareAtPrice?: number;
  costPrice: number;
  sku: string;
  barcode: string;
  stock: number;
  images: string[];
  variants: ProductVariant[];
  sellerId: string;
  sellerName: string;
  supplierId?: string;
  supplierName?: string;
  fulfillmentType: 'seller_fulfilled' | 'dropshipping' | 'dhco_warehouse';
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  tags: string[];
  weightKg: number;
  countryOfOrigin: string;
  returnPolicyDays: number;
  specifications: Record<string, string>;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'payment_processing'
  | 'confirmed'
  | 'processing'
  | 'awaiting_supplier'
  | 'partially_fulfilled'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancellation_requested'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refund_pending'
  | 'partially_refunded'
  | 'refunded'
  | 'disputed';

export type PaymentMethodType =
  | 'credit_card'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay'
  | 'bank_transfer'
  | 'cod';

export type PaymentStatus =
  | 'pending'
  | 'requires_action'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'partially_refunded'
  | 'refunded'
  | 'disputed';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  sku: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  costPrice: number;
  sellerId: string;
  sellerName: string;
  supplierId?: string;
  supplierName?: string;
  fulfillmentStatus: 'pending' | 'purchased_from_supplier' | 'shipped' | 'delivered';
  supplierOrderRef?: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  codFee: number;
  total: number;
  currency: string;
  exchangeRateAtOrder: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  isSimulatedPayment: boolean;
  timeline: OrderTimelineEvent[];
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  sellerType: 'personal' | 'business';
  country: string;
  payoutCurrency: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRatePercent: number;
  fixedFeePerOrder: number;
  totalSales: number;
  eligiblePayoutBalance: number;
  storeDescription: string;
  bannerImage?: string;
  logoImage?: string;
  appliedAt: string;
  approvedAt?: string;
}

export interface SupplierProfile {
  id: string;
  name: string;
  platform: 'CJdropshipping' | 'DSers' | 'AliExpress' | 'Custom CSV Feed' | 'Manual Supplier';
  connectionStatus: 'connected' | 'syncing' | 'error' | 'disconnected';
  isSimulated: boolean;
  contactEmail: string;
  catalogCount: number;
  lastSyncTime: string;
  defaultMarkupPercent: number;
  fixedHandlingFee: number;
  apiEndpoint?: string;
  autoFulfill: boolean;
}

export interface DropshipImportPreview {
  supplierSku: string;
  title: string;
  category: string;
  supplierCost: number; // in USD
  shippingEstimate: number;
  calculatedPrice: number;
  marginPercent: number;
  stock: number;
  image: string;
  platform: string;
}

export interface SocialMediaLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  username?: string;
  isEnabled: boolean;
  displayOrder: number;
  visibility: {
    publicStorefront: boolean;
    footer: boolean;
    contactPage: boolean;
    buyerAccount: boolean;
    sellerDashboard: boolean;
  };
}

export interface CompanyInfo {
  brandName: string;
  fullName: string;
  tagline: string;
  domain: string;
  email: string;
  phone: string;
  whatsapp: string;
  supportHours: string;
  registeredCountry: string;
  publicAddressText: string;
  isAddressPublic: boolean;
  isPhonePublic: boolean;
  isEmailPublic: boolean;
  isWhatsappPublic: boolean;
  maintenanceMode: boolean;
  orderAcceptanceActive: boolean;
}

export interface PaymentGatewayConfig {
  id: string;
  provider: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer' | 'cod';
  name: string;
  description: string;
  isEnabled: boolean;
  isTestMode: boolean;
  supportedCurrencies: string[];
  codFee: number;
  codMaxOrderAmount: number;
  codSupportedCountries: string[];
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  sellerResponse?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: 'Order Issue' | 'Payment' | 'Shipping & Tracking' | 'Returns & Refunds' | 'General Inquiry';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: {
    id: string;
    sender: 'customer' | 'support';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  category: 'security' | 'order' | 'product' | 'settings' | 'payout';
  details: string;
}
