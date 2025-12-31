import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ProductDetail from './product-detail/ProductDetail';
import config from '../lib/config.json';

const Home: React.FC = () => {
  const productHandle = config.data.product;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ProductDetail handle={productHandle} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;