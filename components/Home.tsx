import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ProductDetail from './product-detail/ProductDetail';

const Home: React.FC = () => {
  const productHandle = import.meta.env.VITE_SHOPIFY_PRODUCT || 'women-t-shirt';

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