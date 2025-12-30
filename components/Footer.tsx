import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-12">
      <div className="container mx-auto px-4 text-center">
        <h3
          className="text-2xl font-bold mb-4"
          style={{fontFamily: 'Space Grotesk, sans-serif'}}
        >
          Store
        </h3>
        <p className="text-gray-500 mb-6">
          Your premium shopping destination
        </p>
        <div className="mt-8 pt-8 text-gray-500">
          <p>&copy; 2025 Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
