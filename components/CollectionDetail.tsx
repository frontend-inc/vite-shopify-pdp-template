import React, { useState, useEffect } from 'react';
import { getCollectionProducts } from '../services/shopify/api';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { Button } from './ui/button';

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

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ProductImage;
}

interface CollectionDetailProps {
  collectionHandle?: string;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({ collectionHandle }) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!collectionHandle) return;
    
    const fetchCollectionProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCollectionProducts({
          collection: collectionHandle,
          limit: 20,
          sortKey: 'COLLECTION_DEFAULT',
          reverse: false
        });

        setCollection(data.collection);
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching collection products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load collection products');
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionProducts();
  }, [collectionHandle]);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-900 font-heading">
            Collection
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
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <i className="ri-shopping-bag-line text-3xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-3">
            Collection Not Found
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {error || "We couldn't find the collection you're looking for. It may have been removed or the link might be incorrect."}
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="px-8"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      {collection?.image && (
        <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px]">
          <img
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center px-4 font-heading">
              {collection.title}
            </h1>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Products in Collection
              </h3>
              <p className="text-gray-500">
                This collection doesn't have any products yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={(product) => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default CollectionDetail;