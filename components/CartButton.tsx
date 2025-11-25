import React from 'react';
import './CartButton.css';

type Props = {
  totalItems: number;
  openCart: () => void;
  themeButton: string;
};

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const CartButton: React.FC<Props> = ({ totalItems, openCart, themeButton }) => {
  const themeButtonRgb = hexToRgb(themeButton);

  return (
    <label
      className="cart-button"
      onClick={openCart}
      style={{
        '--theme-button-color': themeButton,
        '--theme-button-color-rgb': themeButtonRgb,
      } as React.CSSProperties}
    >
      <span className="cart-icon">
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle r="1" cy="21" cx="9"></circle>
          <circle r="1" cy="21" cx="20"></circle>
          <path
            d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
          ></path>
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{totalItems}</span>
        )}
      </span>
      Cart
      <div className="progress-bar"></div>
    </label>
  );
};

export default CartButton;
