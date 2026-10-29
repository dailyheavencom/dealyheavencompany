import React from 'react';
import { Heart, Star, ShoppingBag, Eye, ShieldCheck, Zap } from 'lucide-react';
import { Product, CurrencyConfig } from '../../types';
import { formatPrice } from '../../utils/ecommerceCalculations';

interface ProductCardProps {
  product: Product;
  activeCurrency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  activeCurrency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-[#121217] rounded-xl border border-[#24242D] hover:border-[#C9A646]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#690D18]/15">
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-[#17171E] overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isFlashSale && (
            <span className="bg-[#690D18] text-[#E1C574] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-md border border-[#C9A646]/40 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current" />
              Flash Deal {discountPercent > 0 && `-${discountPercent}%`}
            </span>
          )}
          {product.fulfillmentType === 'dropshipping' ? (
            <span className="bg-[#14141A]/90 text-gray-300 text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded border border-white/10">
              Global Direct
            </span>
          ) : (
            <span className="bg-[#0B0B0D]/90 text-[#E1C574] text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded border border-[#C9A646]/30 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified Atelier
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted
              ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]'
              : 'bg-black/50 hover:bg-black text-gray-300 hover:text-white border border-white/10'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions Bar */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex-1 py-2 rounded-lg bg-[#181820]/95 hover:bg-[#20202A] text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 backdrop-blur-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#E1C574]" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            className="px-3 py-2 rounded-lg bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold flex items-center justify-center border border-[#C9A646]/40 transition-colors shadow-lg"
            title="Add 1 to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#77777F] mb-1">
            <span className="font-semibold uppercase tracking-wider text-[#C9A646] truncate max-w-[150px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-white font-bold">{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-semibold text-white group-hover:text-[#E1C574] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.title}
          </h3>
        </div>

        {/* Price & Stock info */}
        <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                {formatPrice(product.price, activeCurrency)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice, activeCurrency)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              Sold by <span className="text-gray-300 font-medium">{product.sellerName}</span>
            </div>
          </div>

          <div className="text-right">
            {product.stock > 10 ? (
              <span className="text-[10px] text-emerald-400 font-medium">In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-[10px] text-amber-400 font-medium">Only {product.stock} left</span>
            ) : (
              <span className="text-[10px] text-rose-500 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
