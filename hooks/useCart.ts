import { useState } from 'react';
import { Product, Website } from '../types';

export type CartItem = { product: Product; quantity: number };

export function useCart(website?: Website | null) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', location: '', message: '' });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
    if (!product || !product.id) {
      console.error('Cannot add product to cart: product is missing or has no id', product);
      return;
    }
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

  const handleCheckout = async () => {
    if (!website?.messenger.pageId || cart.length === 0 || isCheckingOut) return;
    
    setIsCheckingOut(true);
    
    // Prepare order data for spreadsheet
    const orderItems = cart.map(ci => {
      const unit = parseCurrency(ci.product.price);
      const subtotal = unit * ci.quantity;
      return {
        name: ci.product.name,
        quantity: ci.quantity,
        unitPrice: unit.toFixed(2),
        subtotal: subtotal
      };
    });

    const orderData = {
      websiteId: website.id || website.subdomain,
      websiteTitle: website.title,
      order: {
        customerName: checkoutForm.name,
        email: checkoutForm.email,
        location: checkoutForm.location,
        items: orderItems,
        total: cartTotal(),
        totalFormatted: formatCurrency(cartTotal()),
        note: checkoutForm.message || ''
      }
    };

    // Prepare Messenger message
    const lines: string[] = [];
    lines.push('New Order Request');
    lines.push(`Customer: ${checkoutForm.name}`);
    if (checkoutForm.email) lines.push(`Email: ${checkoutForm.email}`);
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
    const messengerUrl = `https://m.me/${website.messenger.pageId}?text=${encodedMessage}`;

    // Send to Google Spreadsheet in background (fire and forget)
    // Don't wait for it - open Messenger immediately for better UX
    // NO HEADERS - Google Apps Script blocks requests with custom headers (triggers preflight)
    const scriptUrl = import.meta.env.VITE_ORDER_TRACKING_SCRIPT_URL || website.messenger.googleScriptUrl;
    
    if (scriptUrl) {
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Important: prevents CORS errors with Google Scripts
        // NO headers object - sending as text/plain to avoid preflight
        body: JSON.stringify(orderData),
      }).catch((error) => {
        console.error('Error saving order to spreadsheet:', error);
        // Continue even if spreadsheet save fails
      });
    }

    // Open Messenger immediately (don't wait for spreadsheet)
    window.open(messengerUrl, '_blank');
    
    // Small delay to show loading state and prevent double-clicks
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear cart and form
    setCart([]);
    setCheckoutForm({ name: '', location: '', message: '' });
    closeCart();
    setIsCheckingOut(false);
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
    clearCart,
    isCheckingOut
  } as const;
}
