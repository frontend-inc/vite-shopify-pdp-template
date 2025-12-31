import React from 'react';
import { useCart } from '../contexts/CartContext';
import config from '../lib/config.json';

const CartIcon: React.FC = () => {
  const { state, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-black hover:text-gray-600 transition-colors"
    >
      <i className="ri-shopping-bag-line text-2xl"></i>
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  );
};

const Header: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30 h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-black font-heading">
            {config.branding.logo.url ? (
              <img
                src={config.branding.logo.url}
                alt={config.branding.logo.alt || 'Store'}
                className="h-8"
              />
            ) : (
              'Store'
            )}
          </a>

          {/* Cart Icon */}
          <CartIcon />
        </div>
      </div>
    </nav>
  );
};

export default Header;
