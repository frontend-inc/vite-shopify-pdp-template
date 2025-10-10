import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ProductDetail from './product-detail';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ProductDetail handle="women-t-shirt" />
      </main>
      <Footer />
    </div>
  );
};

export default Home;