# Option 2: Real-Time Features & Multi-Seller Support

## Overview
This phase adds advanced features to scale the platform:
- Real-time notifications (WebSockets)
- Affiliate/referral program
- Multi-seller marketplace support
- Vendor dashboard

## Component 2A: Real-Time Notifications (1-2 weeks)

### Technology Stack
- Socket.io or Pusher (WebSocket provider)
- Redis for message queue
- Event-based architecture

### Features
1. **Order Status Updates**
   - Buyer notified when order ships
   - Admin notified when new order created
   - Real-time status changes

2. **Inventory Alerts**
   - Low stock notifications
   - Out of stock alerts

3. **Admin Notifications**
   - New order alerts
   - Review pending approval
   - System alerts

### Implementation Steps
1. Setup WebSocket provider (Socket.io or Pusher)
2. Create notification models in Prisma
3. Build notification service/listeners
4. Create notification UI components
5. Setup client-side WebSocket connection
6. Add notification center to header
7. Test end-to-end notifications

### New Database Models
- Notification (id, userId, type, title, message, read, createdAt)
- NotificationPreference (userId, emailOnOrder, emailOnReview, etc.)

### New API Endpoints
- GET /api/notifications - list notifications
- PUT /api/notifications/{id}/read - mark as read
- PUT /api/notifications/read-all - mark all read
- PUT /api/user/notification-preferences - update preferences

---

## Component 2B: Affiliate Program (2-3 weeks)

### Features
1. **Affiliate Dashboard**
   - Unique referral link generation
   - Click tracking
   - Commission tracking
   - Payout requests
   - Performance analytics

2. **Commission System**
   - Configurable commission rates (default: 5-10%)
   - Track successful referrals
   - Automatic commission calculation
   - Payment processing

3. **Referral Landing Page**
   - Track referral source
   - Cookie-based tracking (30-day window)
   - Deep linking support

### New Database Models
- AffiliateAccount (id, userId, referralCode, status, commissionRate, totalEarnings, createdAt)
- AffiliateClick (id, referralCode, sessionId, timestamp)
- AffiliateConversion (id, affiliateId, orderId, commission, status, paidDate)
- AffiliatePayoutRequest (id, affiliateId, amount, status, requestedDate, paidDate)

### New Pages
- app/affiliate/dashboard/page.tsx - Affiliate main dashboard
- app/affiliate/stats/page.tsx - Performance analytics
- app/affiliate/payouts/page.tsx - Payout management
- app/affiliate/settings/page.tsx - Account settings

### New API Endpoints
- GET /api/affiliate/dashboard - dashboard stats
- GET /api/affiliate/referral-code - get user's referral code
- POST /api/affiliate/referral-code - generate referral code
- GET /api/affiliate/clicks - track clicks
- GET /api/affiliate/conversions - conversion data
- POST /api/affiliate/payout-request - request payout

---

## Component 2C: Multi-Seller Support (3-4 weeks)

### Features
1. **Seller Accounts**
   - Seller registration
   - KYC verification
   - Shop setup & customization
   - Commission configuration

2. **Seller Dashboard**
   - Inventory management
   - Order management
   - Performance analytics
   - Payout history

3. **Buyer Experience**
   - View seller profile
   - Seller ratings/reviews
   - Multiple sellers for same product
   - Seller reputation

### Architecture Changes
- Products: Add sellerId field (foreign key to User with role:seller)
- Orders: Calculate seller-specific portions
- Payouts: Split revenue between platform and sellers

### New Database Models
- SellerProfile (id, userId, shopName, description, logo, rating, totalSales, createdAt)
- SellerVerification (id, sellerId, kycStatus, documents, verifiedAt)
- SellerCommission (id, sellerId, rate, platformFee, updatedAt)
- SellerPayout (id, sellerId, amount, ordersIncluded, status, requestedDate, paidDate)
- SellerReview (id, sellerId, buyerId, rating, comment, createdAt)
- ProductVariant (id, productId, sellerId, sku, price, quantity, createdAt)

### New Pages
- app/seller/register/page.tsx - Seller registration
- app/seller/dashboard/page.tsx - Main seller dashboard
- app/seller/products/page.tsx - Seller's products
- app/seller/orders/page.tsx - Seller's orders
- app/seller/analytics/page.tsx - Performance analytics
- app/seller/payouts/page.tsx - Payout management
- app/seller/settings/page.tsx - Shop settings

### New API Endpoints
- POST /api/seller/register - register as seller
- GET /api/seller/dashboard - dashboard stats
- PUT /api/seller/profile - update shop profile
- GET /api/seller/products - seller's products
- POST /api/seller/products - add product as seller
- GET /api/seller/orders - seller's orders
- PUT /api/seller/orders/{id}/status - update order status
- GET /api/seller/analytics - performance data
- POST /api/seller/payout-request - request payout

### Payment Split Logic
For each order:
1. Calculate platform commission (e.g., 10%)
2. Calculate seller amount (price - commission)
3. Record in SellerPayout
4. Transfer funds to seller account

---

## Implementation Priority

### Week 1: Real-Time Notifications
- [ ] Setup Socket.io
- [ ] Create Notification models
- [ ] Build notification service
- [ ] Add notification UI

### Week 2: Affiliate Program
- [ ] Create Affiliate models
- [ ] Build affiliate dashboard
- [ ] Implement commission tracking
- [ ] Add referral system

### Week 3-4: Multi-Seller Marketplace
- [ ] Seller registration flow
- [ ] Seller dashboard
- [ ] Product management
- [ ] Order routing
- [ ] Payout system

---

## Testing Strategy
- Unit tests for commission calculations
- Integration tests for order workflows
- E2E tests for seller registration and product listing
- Load testing for WebSocket connections

---

## Deployment Notes
- Real-time notifications require production WebSocket support
- Affiliate tracking requires persistent session storage
- Multi-seller requires database migration (add sellerId to products)
