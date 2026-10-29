import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { Product, CurrencyConfig } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  activeCurrency: CurrencyConfig;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCurrency,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [filterSupplier, setFilterSupplier] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.isPublished && p.isApproved)
      .filter(p => {
        if (!activeCategory) return true;
        return p.category.toLowerCase() === activeCategory.toLowerCase();
      })
      .filter(p => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      })
      .filter(p => (onlyInStock ? p.stock > 0 : true))
      .filter(p => {
        if (filterSupplier === 'all') return true;
        if (filterSupplier === 'dropshipping') return p.fulfillmentType === 'dropshipping';
        if (filterSupplier === 'artisan') return p.fulfillmentType === 'seller_fulfilled';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, activeCategory, searchQuery, onlyInStock, filterSupplier, sortBy]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#24242C]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-black text-white tracking-wide">
              {activeCategory || (searchQuery ? `Search: "${searchQuery}"` : 'All Curated Collections')}
            </h2>
            <span className="text-xs bg-[#1C1C24] text-[#E1C574] px-2.5 py-1 rounded-full font-bold border border-white/10">
              {filteredProducts.length} items
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Global luxury horology, designer leather goods, high-fidelity spatial acoustics, and dropshipped essentials.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Active search chip */}
          {searchQuery && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#690D18]/30 border border-[#C9A646]/40 text-[#E1C574]">
              <span>Query: "{searchQuery}"</span>
              <button onClick={onClearSearch} className="hover:text-white" aria-label="Clear query filter">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Active category chip */}
          {activeCategory && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#690D18]/30 border border-[#C9A646]/40 text-[#E1C574]">
              <span>{activeCategory}</span>
              <button onClick={() => onSelectCategory('')} className="hover:text-white" aria-label="Clear category filter">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fulfillment Origin Filter */}
          <select
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="bg-[#14141A] border border-[#2B2B34] text-gray-200 rounded-lg px-2.5 py-1.5 focus:border-[#C9A646] focus:outline-none"
            aria-label="Filter by fulfillment type"
          >
            <option value="all">All Origins</option>
            <option value="artisan">Artisan Atelier (Seller)</option>
            <option value="dropshipping">Dropshipping (Global Hub)</option>
          </select>

          {/* In stock toggle */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#14141A] border border-[#2B2B34] text-gray-300 cursor-pointer hover:border-gray-500">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-[#690D18] focus:ring-[#C9A646] accent-[#690D18]"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-[#14141A] border border-[#2B2B34] rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C9A646]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-200 focus:outline-none"
              aria-label="Sort products by"
            >
              <option value="featured">Featured &amp; Vault</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              activeCurrency={activeCurrency}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#181820] border border-[#C9A646]/30 mx-auto flex items-center justify-center">
            <Tag className="w-8 h-8 text-[#C9A646]" />
          </div>
          <h3 className="text-lg font-bold text-white">No products found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            We couldn't find items matching your current filters or search keywords. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={() => {
              onClearSearch();
              onSelectCategory('');
              setOnlyInStock(false);
              setFilterSupplier('all');
            }}
            className="px-4 py-2 rounded-lg bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
