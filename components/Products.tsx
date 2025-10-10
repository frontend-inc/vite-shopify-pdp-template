import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '../services/shopify/api';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
}

interface ProductsProps {
  title?: string;
  limit?: number;
  showLoadMore?: boolean;
  onViewDetails?: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({
  title = "Our Products",
  limit = 12,
  showLoadMore = true,
  onViewDetails
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  const fetchProducts = async (currentProducts: Product[] = [], loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const newProducts = await getProducts({ 
        first: limit,
        sortKey: 'CREATED_AT',
        reverse: true
      });

      if (loadMore) {
        // Filter out products that already exist
        const existingIds = new Set(currentProducts.map(p => p.id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
        
        if (uniqueNewProducts.length === 0) {
          setHasMoreProducts(false);
        } else {
          setProducts(prev => [...prev, ...uniqueNewProducts]);
        }
      } else {
        setProducts(newProducts);
        setHasMoreProducts(newProducts.length === limit);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [limit]);

  const handleAddToCart = async (product: Product) => {
    // Here you would typically integrate with cart functionality
    console.log('Adding to cart:', product);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreProducts) {
      fetchProducts(products, true);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl font-bold text-center mb-12"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {title}
          </h2>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-4xl font-bold mb-8"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {title}
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to Load Products
            </h3>
            <p className="text-red-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => fetchProducts()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-4xl font-bold mb-8"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {title}
          </h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500">
              Check back later or configure your Shopify store connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 
          className="text-5xl font-bold text-center mb-16 text-gray-900"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {title}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && hasMoreProducts && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-200 ${
                loadingMore
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 active:scale-95'
              }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {loadingMore ? (
                <span className="flex items-center space-x-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Loading...</span>
                </span>
              ) : (
                'Load More Products'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;