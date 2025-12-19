import React from 'react';
import { Product } from '../../types';

interface POSProductCardProps {
  product: Product;
  onClick: () => void;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const POSProductCard: React.FC<POSProductCardProps> = ({
  product,
  onClick,
  handleImageError,
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-2 rounded-xl shadow-sm cursor-pointer hover:ring-2 hover:ring-amber-500 border border-slate-200 transition-all active:scale-95 flex flex-col h-full"
    >
      <div className="aspect-square w-full bg-slate-100 rounded-lg mb-2 overflow-hidden relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
             <span className="text-xs font-medium">No Image</span>
          </div>
        )}
        {product.stock !== undefined && product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
            </div>
        )}
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <h3 className="font-bold text-sm text-slate-800 leading-tight line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-amber-700 font-bold text-sm">{product.price}</p>
      </div>
    </div>
  );
};
