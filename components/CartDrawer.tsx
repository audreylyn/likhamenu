import React from 'react';
import { CartItem } from '../hooks/useCart';
import { Product } from '../types';
import { X, Plus, Minus, Send } from 'lucide-react';

type Props = {
  isOpen: boolean;
  cart: CartItem[];
  closeCart: () => void;
  setCartEmpty: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  cartTotal: () => number;
  totalItems: () => number;
  checkoutForm: { name: string; location: string; message: string };
  setCheckoutForm: (form: { name: string; location: string; message: string }) => void;
  handleCheckout: () => void;
  parseCurrency: (s?: string) => number;
  formatCurrency: (n: number) => string;
  theme: any;
  isDark: boolean;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  website?: any;
};

const CartDrawer: React.FC<Props> = ({
  isOpen,
  cart,
  closeCart,
  setCartEmpty,
  updateQuantity,
  removeFromCart,
  cartTotal,
  totalItems,
  checkoutForm,
  setCheckoutForm,
  handleCheckout,
  parseCurrency,
  formatCurrency,
  theme,
  isDark,
  handleImageError,
  website
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 z-40" onClick={closeCart} />
      <div className={`ml-auto w-full max-w-md h-full z-50 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl p-6 overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Your Cart ({totalItems()})</h3>
          <div className="flex items-center gap-2">
            <button onClick={setCartEmpty} className="text-sm px-3 py-1 border rounded">Clear</button>
            <button onClick={closeCart} className="p-2 rounded hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {cart.length === 0 && (
            <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'} text-center`}>Your cart is empty.</div>
          )}

          {cart.map(ci => (
            <div key={ci.product.id} className={`flex gap-3 items-center p-3 rounded-lg border ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              {ci.product.image && (
                <img src={ci.product.image} onError={handleImageError} className="w-16 h-16 object-cover rounded" alt="" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">{ci.product.name}</div>
                    <div className="text-sm text-muted">{ci.product.description?.substring(0, 60)}</div>
                  </div>
                  <div className="font-bold" style={{ color: theme.primary }}>{formatCurrency(parseCurrency(ci.product.price))}</div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => updateQuantity(ci.product.id, Math.max(0, ci.quantity - 1))} className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="px-3 font-bold">{ci.quantity}</div>
                  <button onClick={() => updateQuantity(ci.product.id, ci.quantity + 1)} className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFromCart(ci.product.id)} className="ml-auto text-sm text-red-500">Remove</button>
                </div>
                <div className="text-sm mt-2">Subtotal: <span className="font-bold">{formatCurrency(parseCurrency(ci.product.price) * ci.quantity)}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted">Total</div>
            <div className="text-lg font-bold" style={{ color: theme.primary }}>{formatCurrency(cartTotal())}</div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input value={checkoutForm.name} onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})} className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={checkoutForm.location} onChange={(e) => setCheckoutForm({...checkoutForm, location: e.target.value})} className={`w-full px-3 py-2 rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message (optional)</label>
              <textarea value={checkoutForm.message} onChange={(e) => setCheckoutForm({...checkoutForm, message: e.target.value})} className={`w-full px-3 py-2 rounded border h-24 resize-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
            </div>

            <button onClick={handleCheckout} disabled={!checkoutForm.name || !checkoutForm.location || cart.length === 0 || !website?.messenger.pageId} className="w-full py-3 rounded font-bold text-white" style={{ backgroundColor: theme.button }}>
              <Send className="w-4 h-4 inline-block mr-2" /> Checkout via Messenger
            </button>
            {!website?.messenger.pageId && (
              <div className="text-xs text-red-500">Messenger checkout is not available for this site.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
