import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Info,
  DollarSign,
  Smartphone,
  Banknote,
} from 'lucide-react';
import {
  CartItem,
  CurrencyConfig,
  Order,
  PaymentMethodType,
  PaymentGatewayConfig,
  ShippingAddress,
} from '../../types';
import {
  formatPrice,
  calculateOrderTotals,
  checkCodEligibility,
} from '../../utils/ecommerceCalculations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  activeCurrency: CurrencyConfig;
  appliedCoupon: string;
  couponDiscountPercent: number;
  paymentConfigs: PaymentGatewayConfig[];
  onOrderPlaced: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  activeCurrency,
  appliedCoupon,
  couponDiscountPercent,
  paymentConfigs,
  onOrderPlaced,
  onClearCart,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Shipping form state
  const [shippingForm, setShippingForm] = useState<ShippingAddress>({
    fullName: 'Alexander Vance',
    phone: '+60196006241',
    street: 'Pavilion Residences, Tower 2, #18-02',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    postalCode: '55100',
    country: 'Malaysia',
  });
  const [customerEmail, setCustomerEmail] = useState('dailyheavenco@gmail.com');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment form state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [simulatedCardNumber, setSimulatedCardNumber] = useState('4242 •••• •••• 4242');
  const [simulatedCardExpiry, setSimulatedCardExpiry] = useState('12/28');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const codConfig = paymentConfigs.find(p => p.provider === 'cod');
  const isCodActive = selectedPaymentMethod === 'cod';

  const calculationItems = cart.map(item => ({
    price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
    quantity: item.quantity,
  }));

  const shippingBaseFee = shippingMethod === 'express' ? 25 : undefined;
  const totals = calculateOrderTotals({
    items: calculationItems,
    couponDiscountPercent,
    shippingFee: shippingBaseFee,
    isCod: isCodActive,
    codFee: codConfig ? codConfig.codFee : 5,
  });

  // COD verification
  const codEligibility = checkCodEligibility(totals.subtotal, shippingForm.country, {
    isEnabled: codConfig?.isEnabled ?? true,
    maxLimitUSD: codConfig?.codMaxOrderAmount ?? 500,
    allowedCountries: codConfig?.codSupportedCountries ?? ['Malaysia', 'United Arab Emirates', 'Singapore'],
  });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.street || !shippingForm.city || !shippingForm.country) {
      return;
    }
    setStep('payment');
  };

  const handleSimulatePayment = () => {
    if (selectedPaymentMethod === 'cod' && !codEligibility.isEligible) {
      alert(`Cannot proceed with COD: ${codEligibility.reason}`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderNum = `DHCO-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        customerId: `buyer-${Date.now()}`,
        customerName: shippingForm.fullName,
        customerEmail,
        customerPhone: shippingForm.phone,
        shippingAddress: { ...shippingForm },
        items: cart.map(item => ({
          productId: item.product.id,
          productTitle: item.product.title,
          productImage: item.product.images[0],
          sku: item.selectedVariant ? item.selectedVariant.sku : item.product.sku,
          variantName: item.selectedVariant?.name,
          quantity: item.quantity,
          unitPrice: item.selectedVariant ? item.selectedVariant.price : item.product.price,
          totalPrice: (item.selectedVariant ? item.selectedVariant.price : item.product.price) * item.quantity,
          costPrice: item.selectedVariant ? item.selectedVariant.costPrice : item.product.costPrice,
          sellerId: item.product.sellerId,
          sellerName: item.product.sellerName,
          supplierId: item.product.supplierId,
          supplierName: item.product.supplierName,
          fulfillmentStatus: item.product.fulfillmentType === 'dropshipping' ? 'purchased_from_supplier' : 'pending',
          supplierOrderRef: item.product.fulfillmentType === 'dropshipping' ? `SUPP-PO-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
        })),
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        couponCode: appliedCoupon || undefined,
        codFee: totals.codFee,
        total: totals.total,
        currency: activeCurrency.code,
        exchangeRateAtOrder: activeCurrency.rate,
        status: isCodActive ? 'confirmed' : 'payment_processing',
        paymentMethod: selectedPaymentMethod,
        paymentStatus: isCodActive ? 'pending' : 'paid',
        paymentTransactionId: isCodActive ? undefined : `sim_tx_${Math.random().toString(36).substring(2, 10)}`,
        isSimulatedPayment: true,
        timeline: [
          {
            id: `tl-1`,
            status: 'confirmed',
            title: isCodActive ? 'COD Order Registered' : 'Simulated Payment Authorized',
            description: isCodActive
              ? 'Cash will be collected upon courier arrival.'
              : `Authorized via ${selectedPaymentMethod.replace('_', ' ').toUpperCase()} (Simulated Demo Sandbox).`,
            timestamp: new Date().toLocaleString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onOrderPlaced(newOrder);
      setPlacedOrder(newOrder);
      setIsProcessing(false);
      setStep('success');
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#C9A646]/50 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#24242F] bg-[#16161F] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg text-white">DH&amp;Co</span>
              <span className="text-[10px] bg-[#690D18] text-[#E1C574] px-2 py-0.5 rounded font-bold uppercase border border-[#C9A646]/30">
                Secure Demo Checkout
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Step {step === 'details' ? '1: Shipping' : step === 'payment' ? '2: Payment & Review' : '3: Confirmed'}
            </p>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Notice of Simulation */}
        <div className="bg-[#1A1208] border-b border-[#C9A646]/30 px-5 py-2.5 flex items-center gap-2.5 text-xs text-amber-200">
          <Info className="w-4 h-4 text-[#E1C574] shrink-0" />
          <span>
            <strong>Demo Sandbox Mode:</strong> Real card or bank credentials are not charged. Financial and order records are stored locally for testing.
          </span>
        </div>

        {/* STEP 1: Shipping Address & Details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Delivery &amp; Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingForm.fullName}
                  onChange={e => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                  className="w-full bg-[#181820] border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C9A646] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#181820] border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C9A646] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Phone (with Country Code)</label>
                <input
                  type="text"
                  required
                  value={shippingForm.phone}
                  onChange={e => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  className="w-full bg-[#181820] border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C9A646] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Destination Country</label>
                <select
                  value={shippingForm.country}
                  onChange={e => setShippingForm({ ...shippingForm, country: e.target.value })}
                  className="w-full bg-[#181820] border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C9A646] focus:outline-none"
                >
                  <option value="Malaysia">Malaysia</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United States">United States</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Australia">Australia</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingForm.street}
                  onChange={e => setShippingForm({ ...shippingForm, street: e.target.value })}
                  placeholder="Street, Building, Unit Number"
                  className="w-full bg-[#181820] border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C9A646] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={shippingForm.city}
                  onChange={e => setShippingForm({ ...shippingForm, city: e.target.value })}
                  className="w-full bg-[#181820] border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C9A646] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  value={shippingForm.postalCode}
                  onChange={e => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                  className="w-full bg-[#181820] border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C9A646] focus:outline-none"
                />
              </div>
            </div>

            {/* Shipping Method Choice */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Select Courier Method:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    shippingMethod === 'standard'
                      ? 'bg-[#690D18]/30 border-[#C9A646] text-[#E1C574]'
                      : 'bg-[#16161F] border-white/10 text-gray-300'
                  }`}
                >
                  <div className="font-bold flex justify-between">
                    <span>Standard Global Delivery</span>
                    <span>{totals.subtotal >= 150 ? 'FREE' : formatPrice(15, activeCurrency)}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">4-7 business days via Registered International Post</div>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('express')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    shippingMethod === 'express'
                      ? 'bg-[#690D18]/30 border-[#C9A646] text-[#E1C574]'
                      : 'bg-[#16161F] border-white/10 text-gray-300'
                  }`}
                >
                  <div className="font-bold flex justify-between">
                    <span>DHL Express Priority Air</span>
                    <span>{formatPrice(25, activeCurrency)}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">2-4 business days with signature &amp; GPS tracking</div>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#F1F1F3] text-xs font-bold border border-[#C9A646]/50 shadow-lg flex items-center gap-2 transition-all"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4 text-[#E1C574]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Method & Financial Breakdown */}
        {step === 'payment' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Select Payment Method
              </h3>
              <button
                onClick={() => setStep('details')}
                className="text-xs text-[#E1C574] hover:underline"
              >
                &larr; Back to Address
              </button>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('credit_card')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedPaymentMethod === 'credit_card'
                    ? 'bg-[#690D18]/40 border-[#C9A646] text-[#E1C574] font-bold'
                    : 'bg-[#16161F] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('paypal')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedPaymentMethod === 'paypal'
                    ? 'bg-[#690D18]/40 border-[#C9A646] text-[#E1C574] font-bold'
                    : 'bg-[#16161F] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedPaymentMethod === 'apple_pay'
                    ? 'bg-[#690D18]/40 border-[#C9A646] text-[#E1C574] font-bold'
                    : 'bg-[#16161F] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>Apple/Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedPaymentMethod === 'cod'
                    ? 'bg-[#690D18]/40 border-[#C9A646] text-[#E1C574] font-bold'
                    : 'bg-[#16161F] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Selected Method Details */}
            {selectedPaymentMethod === 'credit_card' && (
              <div className="p-4 rounded-xl bg-[#16161F] border border-white/10 space-y-3 text-xs">
                <div className="flex justify-between items-center text-gray-300">
                  <span className="font-bold text-white">Simulated Stripe Payment Element</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    Test Mode Active
                  </span>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Card Number (Simulated)</label>
                  <input
                    type="text"
                    disabled
                    value={simulatedCardNumber}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-gray-300 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Expires</label>
                    <input
                      type="text"
                      disabled
                      value={simulatedCardExpiry}
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">CVC</label>
                    <input
                      type="text"
                      disabled
                      value="•••"
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2.5 text-gray-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-[#16161F] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Banknote className="w-4 h-4 text-[#C9A646]" />
                  <span>Cash on Delivery Terms</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  You will pay the courier in cash at the time of delivery. A standard COD handling fee of {formatPrice(codConfig?.codFee || 5, activeCurrency)} applies to secure armored remittance.
                </p>
                {codEligibility.isEligible ? (
                  <div className="p-2 rounded bg-emerald-950/50 border border-emerald-800/40 text-emerald-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Your destination ({shippingForm.country}) and order amount qualify for COD.</span>
                  </div>
                ) : (
                  <div className="p-2 rounded bg-rose-950/50 border border-rose-800/40 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{codEligibility.reason}</span>
                  </div>
                )}
              </div>
            )}

            {selectedPaymentMethod === 'paypal' && (
              <div className="p-4 rounded-xl bg-[#16161F] border border-white/10 text-xs text-gray-300 space-y-2">
                <div className="font-bold text-white">PayPal One-Touch Simulation</div>
                <p className="text-gray-400">
                  Simulates instant authorization via PayPal Sandbox. No redirection required in test mode.
                </p>
              </div>
            )}

            {selectedPaymentMethod === 'apple_pay' && (
              <div className="p-4 rounded-xl bg-[#16161F] border border-white/10 text-xs text-gray-300 space-y-2">
                <div className="font-bold text-white">Apple / Google Pay Biometric Token</div>
                <p className="text-gray-400">
                  Simulates biometric FaceID / TouchID authorization token.
                </p>
              </div>
            )}

            {/* Financial Summary */}
            <div className="bg-[#0E0E12] rounded-xl p-4 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-white">{formatPrice(totals.subtotal, activeCurrency)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(totals.discountAmount, activeCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping ({shippingMethod === 'express' ? 'DHL Express' : 'Standard'})</span>
                <span className="text-white">
                  {totals.shippingFee === 0 ? 'FREE' : formatPrice(totals.shippingFee, activeCurrency)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Tax</span>
                <span className="text-white">{formatPrice(totals.taxAmount, activeCurrency)}</span>
              </div>
              {totals.codFee > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Courier Cash Collection Fee</span>
                  <span>{formatPrice(totals.codFee, activeCurrency)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Grand Total</span>
                <span className="text-[#E1C574]">{formatPrice(totals.total, activeCurrency)}</span>
              </div>
            </div>

            {/* Confirm Payment Button */}
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing || (selectedPaymentMethod === 'cod' && !codEligibility.isEligible)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#690D18] via-[#8C1422] to-[#690D18] hover:opacity-95 text-[#F1F1F3] font-bold text-xs uppercase tracking-wider border border-[#C9A646]/60 shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Simulating Authorization...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#E1C574]" />
                  <span>
                    Authorize Simulated Payment ({formatPrice(totals.total, activeCurrency)})
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: Order Success Confirmation */}
        {step === 'success' && placedOrder && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#690D18]/40 border-2 border-[#C9A646] mx-auto flex items-center justify-center text-[#E1C574] shadow-xl shadow-[#690D18]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E1C574] uppercase tracking-widest">
                Order Confirmed
              </span>
              <h3 className="text-2xl font-serif font-black text-white">
                Thank You, {placedOrder.customerName}!
              </h3>
              <p className="text-xs text-gray-400">
                Order Reference: <strong className="text-white font-mono">{placedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#16161F] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{placedOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fulfillment Status:</span>
                <span className="text-amber-400 font-bold uppercase">{placedOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delivery Address:</span>
                <span className="text-white text-right max-w-[200px] truncate">
                  {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 font-bold text-white">
                <span>Total Charged:</span>
                <span className="text-[#E1C574]">
                  {formatPrice(placedOrder.total, activeCurrency)}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-400 max-w-sm mx-auto">
              A confirmation email has been dispatched to <strong className="text-white">{placedOrder.customerEmail}</strong>. You can view the order timeline in your Buyer Hub.
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold border border-[#C9A646]/50 transition-colors"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
