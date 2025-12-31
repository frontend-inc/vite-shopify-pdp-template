import React from 'react';
import { CartProvider } from './contexts/CartContext';
import Home from '@/components/Home';
import CartDrawer from './components/CartDrawer';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import Theme from './components/Theme';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Theme />
      <BrowserRouter>
        <div className="w-full flex flex-col min-h-[calc(100vh-80px)]">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
      <CartDrawer />
    </CartProvider>
  );
};

export default App;