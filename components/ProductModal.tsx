import React, { useEffect } from 'react';
import ProductDetail from './product-detail/index';
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

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-white rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <i className="ri-close-line text-2xl text-gray-700"></i>
        </Button>

        {/* Product Detail Component */}
        <ProductDetail handle={product.handle} onAddToCart={onClose} />
      </div>
    </div>
  );
};

export default ProductModal;
