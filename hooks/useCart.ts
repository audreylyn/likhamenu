import { useState } from 'react';
import { Product, Website } from '../types';
import { useToast } from '../components/Toast';

export type SelectedOption = {
  optionId: string;
  optionName: string;
  choiceId: string;
  choiceName: string;
  price: number;
};

export type CartItem = { 
  id: string; // Unique ID for cart item (productID + options hash)
  product: Product; 
  quantity: number;
  selectedOptions: SelectedOption[];
};

export function useCart(website?: Website | null) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', location: '', message: '' });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { addToast } = useToast();

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

  const generateCartItemId = (product: Product, options: SelectedOption[]) => {
    const sortedOptions = [...options].sort((a, b) => a.optionId.localeCompare(b.optionId));
    const optionsKey = sortedOptions.map(o => `${o.optionId}:${o.choiceId}`).join('|');
    return optionsKey ? `${product.id}|${optionsKey}` : product.id;
  };

  const addToCart = (product: Product, qty = 1, selectedOptions: SelectedOption[] = []) => {
    if (!product || !product.id) {
      console.error('Cannot add product to cart: product is missing or has no id', product);
      return;
    }

    const cartItemId = generateCartItemId(product, selectedOptions);

    // Stock Check
    if (product.trackStock && product.stock !== undefined) {
      // Calculate total quantity of this product across all variants in cart
      const currentInCart = cart
        .filter(ci => ci.product.id === product.id)
        .reduce((sum, ci) => sum + ci.quantity, 0);
      
      if (currentInCart + qty > product.stock) {
        addToast(`Sorry, only ${product.stock} available in stock.`, 'error');
        return;
      }
    }

    setCart(prev => {
      const idx = prev.findIndex(ci => ci.id === cartItemId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { id: cartItemId, product, quantity: qty, selectedOptions }];
    });
    addToast('Added to cart', 'success');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setCart(prev => {
      const item = prev.find(ci => ci.id === cartItemId);
      if (!item) return prev;

      // Stock Check
      if (item.product.trackStock && item.product.stock !== undefined) {
        // Calculate total quantity of this product across all variants in cart, EXCLUDING current item's old quantity
        const otherVariantsQuantity = prev
          .filter(ci => ci.product.id === item.product.id && ci.id !== cartItemId)
          .reduce((sum, ci) => sum + ci.quantity, 0);
        
        if (otherVariantsQuantity + quantity > item.product.stock) {
          addToast(`Sorry, cannot add more. Only ${item.product.stock} in stock.`, 'error');
          return prev; // Return unchanged state
        }
      }

      const mapped = prev.map(ci => ci.id === cartItemId ? { ...ci, quantity } : ci);
      return mapped.filter(ci => ci.quantity > 0);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(ci => ci.id !== cartItemId));
  };

  const cartTotal = () => {
    return cart.reduce((sum, ci) => {
      const basePrice = parseCurrency(ci.product.price);
      const optionsPrice = ci.selectedOptions.reduce((optSum, opt) => optSum + opt.price, 0);
      return sum + (basePrice + optionsPrice) * ci.quantity;
    }, 0);
  };

  const totalItems = () => cart.reduce((s, c) => s + c.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleCheckout = async () => {
    if (!website?.messenger.pageId || cart.length === 0 || isCheckingOut) return;
    
    setIsCheckingOut(true);
    
    // Prepare order data for spreadsheet
    const orderItems = cart.map(ci => {
      const basePrice = parseCurrency(ci.product.price);
      const optionsPrice = ci.selectedOptions.reduce((optSum, opt) => optSum + opt.price, 0);
      const unit = basePrice + optionsPrice;
      const subtotal = unit * ci.quantity;
      
      const optionsString = ci.selectedOptions.length > 0 
        ? ` (${ci.selectedOptions.map(o => `${o.optionName}: ${o.choiceName}`).join(', ')})`
        : '';

      return {
        name: ci.product.name + optionsString,
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
      const basePrice = parseCurrency(ci.product.price);
      const optionsPrice = ci.selectedOptions.reduce((optSum, opt) => optSum + opt.price, 0);
      const unit = basePrice + optionsPrice;
      const subtotal = unit * ci.quantity;
      
      lines.push(`- ${ci.product.name} x${ci.quantity} @ ${formatCurrency(unit)} = ${formatCurrency(subtotal)}`);
      if (ci.selectedOptions.length > 0) {
        ci.selectedOptions.forEach(opt => {
           lines.push(`  + ${opt.optionName}: ${opt.choiceName} (+${formatCurrency(opt.price)})`);
        });
      }
    });
    lines.push('------------------');
    lines.push(`Total: ${formatCurrency(cartTotal())}`);
    lines.push('');
    lines.push(`Customer: ${checkoutForm.name}`);
    lines.push(`Location: ${checkoutForm.location}`);
    lines.push(`Note: ${checkoutForm.message || 'N/A'}`);

    const fullMessage = lines.join('\n');
    const encodedMessage = encodeURIComponent(fullMessage);
    // Note: m.me links with ?text= are often blocked or ignored by Meta now.
    // We keep it as a best-effort attempt, but rely on clipboard copy.
    const messengerUrl = `https://m.me/${website.messenger.pageId}?text=${encodedMessage}`;

    // Copy to clipboard as fallback for Messenger not supporting prefilled text
    try {
      await navigator.clipboard.writeText(fullMessage);
      addToast('Order details copied! Paste in Messenger to send.', 'success');
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      addToast('Please copy order details manually if needed.', 'info');
    }

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
