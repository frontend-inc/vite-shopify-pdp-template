import React from 'react';
import { CartProvider } from './contexts/CartContext';
import Home from '@/components/Home';
import CartDrawer from './components/CartDrawer';

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="h-screen bg-white flex flex-col">
        <main className="flex-1 flex flex-col">
          <Home />
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default App;