import React from 'react';
import { useCart } from '../contexts/CartContext';
import { truncate } from '../lib/utils';
import { Card, CardContent } from './ui/card';
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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const { addItem, openCart } = useCart();
  
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const firstVariant = product.variants.edges[0]?.node;
  const isAvailable = firstVariant?.availableForSale || false;

  const formatPrice = (price: ProductPrice) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    
    if (!firstVariant || !isAvailable) return;

    // Add to cart using context
    addItem({
      variantId: firstVariant.id,
      productId: product.id,
      title: product.title,
      price: firstVariant.price,
      image: firstImage?.url,
      variant: {
        title: firstVariant.title,
        selectedOptions: [], // Will be populated if variant has options
      },
    });

    // Open cart drawer
    openCart();

    // Call optional callback
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Card className="!py-0 !gap-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Product Image */}
      <div
        className="aspect-square overflow-hidden bg-gray-100 relative cursor-pointer"
        onClick={() => {
          if (onClick) {
            onClick(product);
          }
        }}
      >
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <i className="ri-image-line text-6xl"></i>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && compareAtPrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">
          {truncate(product.title, 60)}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-bold text-muted-foreground">
              ${parseFloat(price.amount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClick) {
              onClick(product);
            }
          }}
          className="w-full"
          size="lg"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;