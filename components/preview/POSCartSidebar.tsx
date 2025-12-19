import React from 'react';
import { Website } from '../../types';
import { useCart } from '../../hooks/useCart';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, X, User } from 'lucide-react';

interface POSCartSidebarProps {
  cartHook: ReturnType<typeof useCart>;
  website: Website;
  isOpen?: boolean;
  onClose?: () => void;
}

export const POSCartSidebar: React.FC<POSCartSidebarProps> = ({
  cartHook,
  website,
  isOpen = true,
  onClose,
}) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart, handleCheckout, isCheckingOut, checkoutForm, setCheckoutForm } = cartHook;
  const [amountTendered, setAmountTendered] = React.useState<string>('');

  const total = cartTotal();
  const tendered = parseFloat(amountTendered) || 0;
  const change = tendered - total;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`
        bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-30 shrink-0
        fixed inset-y-0 right-0 w-full sm:w-96 md:static md:w-96 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
      {/* Header */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
        <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-600" />
            <h2 className="font-bold text-lg text-slate-800">Current Order</h2>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm font-mono">#{Math.floor(Math.random() * 1000).toString().padStart(4, '0')}</span>
            {onClose && (
                <button onClick={onClose} className="md:hidden p-1 hover:bg-slate-200 rounded-full">
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            )}
        </div>
      </div>

      {/* Customer Input */}
      <div className="px-6 py-3 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
            <User className="w-4 h-4 text-slate-400" />
            <input 
                type="text"
                placeholder="Customer Name (Optional)"
                className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 placeholder:text-slate-400"
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
            />
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
                <ShoppingBag className="w-16 h-16" />
                <p className="text-sm font-medium">Order is empty</p>
            </div>
        ) : (
            cart.map((item) => (
            <div key={item.id} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                <div className="flex-1">
                    <div className="flex justify-between mb-1">
                        <span className="font-bold text-slate-800 text-sm">{item.product.name}</span>
                        <span className="font-bold text-slate-800 text-sm">₱{((parseFloat((item.product.price || '0').toString().replace(/[^0-9.-]+/g, '')) || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="text-xs text-slate-500 mb-2 space-y-0.5">
                            {item.selectedOptions.map((opt, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>+ {opt.choiceName}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center bg-white rounded border border-slate-200 h-8">
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-slate-100 text-slate-600"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-slate-100 text-slate-600"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Footer / Totals */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span>₱{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>₱{total.toLocaleString()}</span>
            </div>
        </div>

        {/* Payment Calculation */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-600">Amount Tendered</span>
                <div className="flex items-center gap-1 bg-slate-50 rounded px-2 border border-slate-200 w-32">
                    <span className="text-slate-400 text-sm">₱</span>
                    <input 
                        type="number" 
                        className="w-full bg-transparent border-none outline-none text-right font-bold text-slate-800"
                        placeholder="0.00"
                    handleCheckout('POS');
                    setAmountTendered('');
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-600">Change</span>
                <span className={`font-bold ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    ₱{change.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={() => {
                    clearCart();
                    setAmountTendered('');
                }}
                disabled={cart.length === 0}
                className="py-3 px-4 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-white hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                Cancel
             </button>
             <button 
                onClick={() => {
                    // For POS, we might want a different checkout flow, but for now reuse handleCheckout
                    // Or just a simple "Charge" alert
                    // alert(`Processing payment for ₱${cartTotal().toLocaleString()}`);
                    handleCheckout('POS');
                    // clearCart(); // handleCheckout clears it
                }}
                disabled={cart.length === 0}
                className="py-3 px-4 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <CreditCard className="w-5 h-5" />
                Charge
             </button>
        </div>
      </div>
    </div>
    </>
  );
};
