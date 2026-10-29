import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, CurrencyConfig } from '../../types';
import { formatPrice, calculateOrderTotals } from '../../utils/ecommerceCalculations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  activeCurrency: CurrencyConfig;
  appliedCoupon: string;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  couponDiscountPercent: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  activeCurrency,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  couponDiscountPercent,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const calculationItems = cart.map(item => ({
    price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
    quantity: item.quantity,
  }));

  const totals = calculateOrderTotals({
    items: calculationItems,
    couponDiscountPercent,
  });

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const ok = onApplyCoupon(code);
    if (ok) {
      setCouponSuccess(`Coupon "${code}" applied!`);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or VIP20.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111116] border-l border-[#24242F] flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#202029] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E1C574]" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Your Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#16161F] px-5 py-3 border-b border-white/5 text-xs">
            {totals.subtotal >= freeShippingThreshold ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4 text-[#E1C574]" />
                <span>Congratulations! You qualify for FREE Global Courier Shipping.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-300">
                  <span>Free Worldwide Shipping at $150</span>
                  <span className="text-[#E1C574] font-bold">
                    Add {formatPrice(freeShippingThreshold - totals.subtotal, activeCurrency)} more
                  </span>
                </div>
                <div className="w-full bg-[#0B0B0D] h-2 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-[#690D18] via-[#C9A646] to-[#E1C574] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map((item, index) => {
                const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex gap-3.5 p-3 rounded-xl bg-[#16161E] border border-white/5 hover:border-[#C9A646]/30 transition-all"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white truncate">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-gray-500 hover:text-rose-400 p-0.5"
                            aria-label="Remove item from cart"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.selectedVariant && (
                          <div className="text-[10px] text-[#C9A646] font-medium mt-0.5">
                            {item.selectedVariant.name}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-400">
                          {item.product.sellerName}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-md border border-white/10 bg-[#0B0B0D]">
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="px-2 py-0.5 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="px-2 py-0.5 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#E1C574]">
                          {formatPrice(itemPrice * item.quantity, activeCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#181820] border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white">Your bag is empty</div>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Explore our luxury horology, designer bags, and sound labs to discover items for your collection.
                </p>
              </div>
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#0E0E12] border-t border-[#202029] space-y-3.5">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="w-full bg-[#16161E] border border-white/10 rounded-lg px-3 py-1.5 pl-8 text-xs text-white placeholder-gray-500 uppercase focus:outline-none focus:border-[#C9A646]"
                    />
                    <Tag className="w-3.5 h-3.5 text-[#C9A646] absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-[#24242D] hover:bg-[#690D18] text-xs font-bold text-[#E1C574] transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {couponError && <p className="text-[10px] text-rose-400">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-400">{couponSuccess}</p>}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded text-emerald-300">
                    <span>Applied: <strong>{appliedCoupon}</strong> ({couponDiscountPercent}% OFF)</span>
                    <button type="button" onClick={onRemoveCoupon} className="text-rose-400 font-bold text-[10px]">
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Financial Subtotals */}
              <div className="space-y-1.5 text-xs border-t border-white/5 pt-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">
                    {formatPrice(totals.subtotal, activeCurrency)}
                  </span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promotion Discount</span>
                    <span>-{formatPrice(totals.discountAmount, activeCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Global Shipping</span>
                  <span className={totals.shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {totals.shippingFee === 0 ? 'FREE' : formatPrice(totals.shippingFee, activeCurrency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (6%)</span>
                  <span className="text-white">{formatPrice(totals.taxAmount, activeCurrency)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-[#E1C574] text-base">
                    {formatPrice(totals.total, activeCurrency)}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#690D18] via-[#8C1422] to-[#690D18] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider border border-[#C9A646]/60 flex items-center justify-center gap-2 shadow-xl shadow-[#690D18]/30 transition-all"
                >
                  <span>Proceed to Simulated Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#E1C574]" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
                  <ShieldCheck className="w-3 h-3 text-[#C9A646]" />
                  <span>256-Bit SSL Encrypted &amp; Demo Sandbox Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
