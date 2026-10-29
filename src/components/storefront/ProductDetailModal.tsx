import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Share2,
  Info,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { Product, CurrencyConfig, ProductVariant, Review } from '../../types';
import { formatPrice } from '../../utils/ecommerceCalculations';

interface ProductDetailModalProps {
  product: Product;
  activeCurrency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onClose: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onBuyNow: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  activeCurrency,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
  reviews,
  onAddReview,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');

  const productReviews = reviews.filter(r => r.productId === product.id);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewContent.trim() || !newReviewAuthor.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: newReviewAuthor.trim(),
      rating: newReviewRating,
      title: newReviewTitle.trim(),
      content: newReviewContent.trim(),
      verifiedPurchase: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddReview(review);
    setNewReviewTitle('');
    setNewReviewContent('');
    setNewReviewAuthor('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#121217] border border-[#C9A646]/50 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#690D18] text-gray-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-[#0E0E12] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#22222A]">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#16161D] border border-white/10 shadow-inner">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all"
                />
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md border ${
                    isWishlisted
                      ? 'bg-[#690D18] text-[#E1C574] border-[#C9A646]'
                      : 'bg-black/60 text-white border-white/20 hover:text-[#E1C574]'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#C9A646] shadow-md shadow-[#C9A646]/20'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trust highlights banner */}
            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C9A646]" />
                <span>Express Worldwide Shipping with tracking number</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A646]" />
                <span>100% Guaranteed Authentic or Money Back</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#C9A646]" />
                <span>{product.returnPolicyDays}-Day Return &amp; Exchange Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Variants & Actions */}
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-[#77777F] mb-1">
                <span className="text-[#C9A646] font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-gray-400">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                {product.title}
              </h2>

              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-white">{product.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300 underline cursor-pointer">
                  {productReviews.length} verified reviews
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-emerald-400 font-semibold">
                  {currentStock > 0 ? `${currentStock} in stock` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price display */}
            <div className="p-3.5 rounded-xl bg-[#171720] border border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#E1C574]">
                  {formatPrice(currentPrice, activeCurrency)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.compareAtPrice, activeCurrency)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-400">
                Taxes calculated at checkout
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Select Edition / Variant:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'bg-[#690D18]/30 border-[#C9A646] text-[#E1C574] font-semibold'
                          : 'bg-[#181820] border-white/10 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-bold">{variant.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {formatPrice(variant.price, activeCurrency)} • {variant.stock} available
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-white/10 bg-[#16161D]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-300 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-3 py-2 text-gray-300 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onAddToCart(product, selectedVariant, quantity)}
                  disabled={currentStock <= 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#F1F1F3] text-xs font-bold border border-[#C9A646]/40 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#690D18]/25 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E1C574]" />
                  <span>Add to Cart ({quantity})</span>
                </button>
              </div>

              <button
                onClick={() => onBuyNow(product, selectedVariant, quantity)}
                disabled={currentStock <= 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A646] to-[#E1C574] text-[#0B0B0D] text-xs font-black uppercase tracking-wider hover:opacity-95 transition-all shadow-lg disabled:opacity-50"
              >
                Instant Buy with 1-Click Checkout
              </button>
            </div>

            {/* Specifications Details Accordion */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                Technical Specifications
              </h4>
              <div className="bg-[#0E0E12] rounded-lg p-3 text-xs divide-y divide-white/5 border border-white/5">
                <div className="py-1.5 flex justify-between">
                  <span className="text-gray-500">Country of Origin</span>
                  <span className="text-gray-300 font-medium">{product.countryOfOrigin}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-gray-500">Weight</span>
                  <span className="text-gray-300 font-medium">{product.weightKg} kg</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-gray-500">Fulfillment Partner</span>
                  <span className="text-[#E1C574] font-medium">
                    {product.fulfillmentType === 'dropshipping'
                      ? `${product.supplierName || 'Global Direct'} (Dropshipped)`
                      : `${product.sellerName} (Direct Atelier)`}
                  </span>
                </div>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="py-1.5 flex justify-between">
                    <span className="text-gray-500">{key}</span>
                    <span className="text-gray-300 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#C9A646]" />
                  <span>Customer Reviews ({productReviews.length})</span>
                </h4>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs text-[#E1C574] hover:underline font-semibold"
                >
                  {showReviewForm ? 'Cancel' : '+ Write Review'}
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-[#181822] p-4 rounded-xl border border-[#C9A646]/30 space-y-3">
                  <div className="text-xs font-bold text-white">Share Your Review</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="text-amber-400"
                      >
                        <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-current' : 'opacity-40'}`} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Elena R.)"
                    value={newReviewAuthor}
                    onChange={e => setNewReviewAuthor(e.target.value)}
                    className="w-full bg-[#101014] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A646]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Headline summary (e.g. Masterful quality)"
                    value={newReviewTitle}
                    onChange={e => setNewReviewTitle(e.target.value)}
                    className="w-full bg-[#101014] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A646]"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Detailed feedback..."
                    value={newReviewContent}
                    onChange={e => setNewReviewContent(e.target.value)}
                    className="w-full bg-[#101014] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A646]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#690D18] text-[#E1C574] text-xs font-bold hover:bg-[#8C1422] transition-colors"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}

              {/* Review list */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {productReviews.length > 0 ? (
                  productReviews.map(rev => (
                    <div key={rev.id} className="p-3 rounded-lg bg-[#0E0E12] border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{rev.customerName}</span>
                        <span className="text-[10px] text-gray-500">{rev.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                        {rev.verifiedPurchase && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1 rounded ml-1 font-semibold">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-gray-200">{rev.title}</div>
                      <p className="text-gray-400 text-[11px] leading-relaxed">{rev.content}</p>
                      {rev.sellerResponse && (
                        <div className="mt-2 pl-2 border-l-2 border-[#C9A646] text-[10px] text-gray-400 italic">
                          <span className="font-semibold text-[#E1C574]">Seller Response: </span>
                          {rev.sellerResponse}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No reviews yet for this model.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
