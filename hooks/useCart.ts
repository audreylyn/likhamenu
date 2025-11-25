import { useState } from 'react';
import { Product, Website } from '../types';

export type CartItem = { product: Product; quantity: number };

export function useCart(website?: Website | null) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', location: '', message: '' });

  const parseCurrency = (s?: string) => {
    if (!s) return 0;
    try {
      const cleaned = s.replace(/[^0-9.-]+/g, '');
      const n = parseFloat(cleaned);
      return Number.isNaN(n) ? 0 : n;
    } catch (e) {
      return 0;
    }
  };

  const formatCurrency = (n: number) => {
    try {
      return `₱${n.toLocaleString('en-PH')}`;
    } catch (e) {
      return `₱${n}`;
    }
  };

  const addToCart = (product: Product, qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(ci => ci.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      const mapped = prev.map(ci => ci.product.id === productId ? { ...ci, quantity } : ci);
      return mapped.filter(ci => ci.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(ci => ci.product.id !== productId));
  };

  const cartTotal = () => {
    return cart.reduce((sum, ci) => sum + parseCurrency(ci.product.price) * ci.quantity, 0);
  };

  const totalItems = () => cart.reduce((s, c) => s + c.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleCheckout = () => {
    if (!website?.messenger.pageId || cart.length === 0) return;
    const lines: string[] = [];
    lines.push('New Order Request');
    lines.push('------------------');
    lines.push('Items:');
    cart.forEach(ci => {
      const unit = parseCurrency(ci.product.price);
      const subtotal = unit * ci.quantity;
      lines.push(`- ${ci.product.name} x${ci.quantity} @ ${formatCurrency(unit)} = ${formatCurrency(subtotal)}`);
    });
    lines.push('------------------');
    lines.push(`Total: ${formatCurrency(cartTotal())}`);
    lines.push('');
    lines.push(`Customer: ${checkoutForm.name}`);
    lines.push(`Location: ${checkoutForm.location}`);
    lines.push(`Note: ${checkoutForm.message || 'N/A'}`);

    const fullMessage = lines.join('\n');
    const encodedMessage = encodeURIComponent(fullMessage);
    const url = `https://m.me/${website.messenger.pageId}?text=${encodedMessage}`;
    window.open(url, '_blank');
    setCart([]);
    setCheckoutForm({ name: '', location: '', message: '' });
    closeCart();
  };

  const clearCart = () => setCart([]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    totalItems,
    isCartOpen,
    openCart,
    closeCart,
    checkoutForm,
    setCheckoutForm,
    handleCheckout,
    parseCurrency,
    formatCurrency,
    clearCart
  } as const;
}
