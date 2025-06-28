// Facebook Pixel Event Tracking Utility

declare global {
  interface Window {
    fbq: any;
  }
}

// Helper function to check if fbq is available
const isFbqAvailable = (): boolean => {
  return typeof window !== 'undefined' && window.fbq;
};

// Product interface for tracking
interface Product {
  id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  quantity: number;
  image: string;
  category?: string;
}

// Add to Cart Event
export const trackAddToCart = (product: Product): void => {
  if (!isFbqAvailable()) return;

  const value = (product.price * (1 - (product.discountPercentage || 0) / 100)) * product.quantity;
  
  window.fbq('track', 'AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: value,
    currency: 'INR',
    content_category: product.category || 'general',
    num_items: product.quantity,
  });
};

// Initiate Checkout Event
export const trackInitiateCheckout = (products: Product[], totalValue: number): void => {
  if (!isFbqAvailable()) return;

  const content_ids = products.map(p => p.id);
  const content_names = products.map(p => p.name);
  const num_items = products.reduce((sum, p) => sum + p.quantity, 0);

  window.fbq('track', 'InitiateCheckout', {
    content_ids: content_ids,
    content_name: content_names,
    content_type: 'product',
    value: totalValue,
    currency: 'INR',
    num_items: num_items,
  });
};

// Add Payment Info Event
export const trackAddPaymentInfo = (products: Product[], totalValue: number, paymentMethod: string): void => {
  if (!isFbqAvailable()) return;

  const content_ids = products.map(p => p.id);
  const content_names = products.map(p => p.name);
  const num_items = products.reduce((sum, p) => sum + p.quantity, 0);

  window.fbq('track', 'AddPaymentInfo', {
    content_ids: content_ids,
    content_name: content_names,
    content_type: 'product',
    value: totalValue,
    currency: 'INR',
    num_items: num_items,
    payment_method: paymentMethod,
  });
};

// Purchase Event
export const trackPurchase = (
  orderId: string, 
  products: Product[], 
  totalValue: number, 
  shippingCost: number = 0,
  paymentMethod: string = 'unknown'
): void => {
  if (!isFbqAvailable()) return;

  const content_ids = products.map(p => p.id);
  const content_names = products.map(p => p.name);
  const num_items = products.reduce((sum, p) => sum + p.quantity, 0);

  window.fbq('track', 'Purchase', {
    content_ids: content_ids,
    content_name: content_names,
    content_type: 'product',
    value: totalValue,
    currency: 'INR',
    num_items: num_items,
    shipping_cost: shippingCost,
    payment_method: paymentMethod,
    order_id: orderId,
  });
};

// View Content Event (for product pages)
export const trackViewContent = (product: Product): void => {
  if (!isFbqAvailable()) return;

  const value = product.price * (1 - (product.discountPercentage || 0) / 100);

  window.fbq('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: value,
    currency: 'INR',
    content_category: product.category || 'general',
  });
};

// Search Event
export const trackSearch = (searchTerm: string): void => {
  if (!isFbqAvailable()) return;

  window.fbq('track', 'Search', {
    search_string: searchTerm,
  });
};

// Contact Event
export const trackContact = (): void => {
  if (!isFbqAvailable()) return;

  window.fbq('track', 'Contact');
};

// Lead Event
export const trackLead = (): void => {
  if (!isFbqAvailable()) return;

  window.fbq('track', 'Lead');
};

// Complete Registration Event
export const trackCompleteRegistration = (): void => {
  if (!isFbqAvailable()) return;

  window.fbq('track', 'CompleteRegistration');
}; 