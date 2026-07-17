// Client-side analytics event tracking
export async function trackEvent(eventType: string, metadata?: Record<string, any>) {
  try {
    await fetch('/api/events/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Common event types
export const Events = {
  // Product events
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_SEARCHED: 'product_searched',

  // Cart events
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  VIEW_CART: 'view_cart',

  // Wishlist events
  ADD_TO_WISHLIST: 'add_to_wishlist',
  REMOVE_FROM_WISHLIST: 'remove_from_wishlist',

  // Checkout events
  START_CHECKOUT: 'start_checkout',
  APPLY_COUPON: 'apply_coupon',
  COMPLETE_PURCHASE: 'complete_purchase',

  // Review events
  VIEW_REVIEWS: 'view_reviews',
  SUBMIT_REVIEW: 'submit_review',

  // User events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  UPDATE_PROFILE: 'update_profile',

  // Search events
  SEARCH: 'search',
  FILTER_APPLIED: 'filter_applied',
};

// Revenue tracking
export async function trackRevenue(orderId: string, amount: number, source?: string) {
  await trackEvent('order_completed', {
    orderId,
    amount,
    source: source || 'checkout',
  });
}

// Page view tracking
export function usePageTracking(pageName: string) {
  if (typeof window !== 'undefined') {
    trackEvent('page_view', {
      page: pageName,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    });
  }
}
