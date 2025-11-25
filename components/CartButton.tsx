import React from 'react';

type Props = {
  totalItems: number;
  openCart: () => void;
  themeButton: string;
};

const CartButton: React.FC<Props> = ({ totalItems, openCart, themeButton }) => {
  return (
    <div className="fixed bottom-6 right-20 z-40">
      <button
        onClick={openCart}
        className="relative p-4 rounded-full shadow-lg text-white transition-colors hover:opacity-95"
        style={{ backgroundColor: themeButton }}
        title="Open cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{totalItems}</span>
        )}
      </button>
    </div>
  );
};

export default CartButton;
