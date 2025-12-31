import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { createCart, addCartLines, redirectToCheckout } from '../services/shopify/api';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
  AnimatePresence,
} from './ui/sheet';
import { Button } from './ui/button';

const CartDrawer: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      // Create a new cart
      const cart = await createCart();

      // Add items to the cart
      const lines = state.items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }));

      if (lines.length > 0) {
        const updatedCart = await addCartLines(cart.id, lines);
        // Redirect to Shopify checkout
        redirectToCheckout(updatedCart.checkoutUrl);
      } else {
        // If cart is empty, just create an empty cart and redirect
        redirectToCheckout(cart.checkoutUrl);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to proceed to checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
      <AnimatePresence>
        {state.isOpen && (
          <SheetContent className="w-full max-w-md" showCloseButton={false}>
            {/* Header */}
            <SheetHeader className="h-16 justify-center items-start">
              <div className="flex items-center justify-between w-full">
                <SheetTitle
                  className="text-2xl font-bold font-heading"
                >
                  Shopping Cart ({state.itemCount})
                </SheetTitle>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </SheetHeader>

            {/* Cart Items */}
            <SheetBody>
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started!</p>
                  <Button onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <div key={item.variantId} className="flex items-start space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="ri-image-line text-2xl"></i>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </h4>

                        {/* Variant Info */}
                        {item.variant.selectedOptions.length > 0 && (
                          <div className="text-sm text-gray-500 mb-2">
                            {item.variant.selectedOptions.map((option, index) => (
                              <span key={option.name}>
                                {option.value}
                                {index < item.variant.selectedOptions.length - 1 ? ' / ' : ''}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 transition-colors text-gray-500"
                              disabled={item.quantity <= 1}
                            >
                              <i className="ri-subtract-line text-sm"></i>
                            </button>
                            <span className="px-2 py-1 font-semibold min-w-[30px] text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 transition-colors text-gray-500"
                            >
                              <i className="ri-add-line text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0">
                        <span className="font-semibold text-gray-900">
                          ${parseFloat(item.price.amount).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
                        >
                          <i className="ri-close-line text-lg font-bold"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SheetBody>

            {/* Footer - Checkout Section */}
            {state.items.length > 0 && (
              <SheetFooter className="!flex-col items-stretch gap-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">Subtotal</span>
                  <span className="text-lg font-semibold">
                    ${state.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-2">
                  Shipping and taxes calculated at checkout
                </div>

                {/* Action Buttons */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  size="lg"
                  className="w-full"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center space-x-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    'Checkout'
                  )}
                </Button>

                <Button
                  onClick={closeCart}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </SheetFooter>
            )}
          </SheetContent>
        )}
      </AnimatePresence>
    </Sheet>
  );
};

export default CartDrawer;
