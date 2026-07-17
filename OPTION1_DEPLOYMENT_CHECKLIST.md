# Option 1: Test & Deploy Checklist

## Phase 1A: Local Testing (30 mins)

### 1. Start Dev Server
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Verify homepage loads

### 2. Test Authentication
- [ ] Create new account
- [ ] Login with new account
- [ ] View profile page
- [ ] Update profile information
- [ ] Logout and login again

### 3. Test Shopping Flow
- [ ] Browse products page
- [ ] Click on a product
- [ ] View product details
- [ ] Add product to cart
- [ ] Go to cart, verify product there
- [ ] Update cart quantity
- [ ] Proceed to checkout

### 4. Test Checkout & Stripe
- [ ] Enter shipping address
- [ ] Apply discount code (test: TESTCODE10)
- [ ] Verify discount calculates correctly
- [ ] Enter payment info (use test card: 4242 4242 4242 4242)
- [ ] Complete purchase
- [ ] Verify order confirmation page shows

### 5. Test Admin Panel
- [ ] Login with admin account (check seed data for admin user)
- [ ] Navigate to /admin
- [ ] View Dashboard (should show metrics)
- [ ] Go to Products section
- [ ] Go to Orders section
- [ ] Go to Analytics section
- [ ] Go to Settings section

### 6. Test Email Sending
- [ ] Check console for email logs (Nodemailer in dev mode)
- [ ] Verify order confirmation email was logged

### 7. Test Reviews
- [ ] Go to an order
- [ ] Add review to product
- [ ] Verify review appears with pending status
- [ ] Login as admin, approve review
- [ ] Verify review is now visible on product page

---

## Phase 1B: Prepare Production Credentials (30 mins)

### 1. Database Setup
- [ ] Choose PostgreSQL provider:
  - Vercel PostgreSQL, OR
  - Railway, OR
  - Supabase, OR
  - AWS RDS
- [ ] Create database
- [ ] Copy DATABASE_URL connection string
- [ ] Test connection locally: `npx prisma db execute --stdin < /dev/null` or use connection client

### 2. Generate Secrets
- [ ] Generate NEXTAUTH_SECRET (32+ char random string)
- [ ] Get STRIPE_LIVE_PUBLISHABLE_KEY from Stripe dashboard
- [ ] Get STRIPE_LIVE_SECRET_KEY from Stripe dashboard

### 3. Email Service Setup
Choose ONE:
- [ ] SendGrid: Create account, generate API key
- [ ] Gmail: Enable 2FA, generate app password
- [ ] AWS SES: Setup verification and SMTP credentials
- [ ] Other: Configure SMTP credentials

### 4. Environment Variables File
- [ ] Copy .env.production.example to .env.production
- [ ] Fill in all production values:
  - DATABASE_URL (PostgreSQL)
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL (your domain)
  - STRIPE keys
  - Email config (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM)
  - NEXT_PUBLIC_SITE_URL
  - NEXT_PUBLIC_SITE_NAME

### 5. Stripe Webhooks
- [ ] Go to Stripe Dashboard > Developers > Webhooks
- [ ] Click "Add Endpoint"
- [ ] URL: https://yourdomain.com/api/webhooks/stripe
- [ ] Select events: payment_intent.succeeded, payment_intent.payment_failed
- [ ] Copy webhook signing secret
- [ ] Add STRIPE_WEBHOOK_SECRET to env variables

---

## Phase 1C: Deploy to Vercel (20 mins)

### 1. Vercel Setup
- [ ] Sign in to Vercel (vercel.com)
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Select project
- [ ] Framework: Next.js (auto-detected)
- [ ] Continue

### 2. Add Environment Variables in Vercel
In Vercel Dashboard > Settings > Environment Variables:
- [ ] DATABASE_URL
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] EMAIL_HOST
- [ ] EMAIL_PORT
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD
- [ ] EMAIL_FROM
- [ ] NEXT_PUBLIC_SITE_URL
- [ ] NEXT_PUBLIC_SITE_NAME

Note: Ensure each variable is added to:
- [ ] Production environment
- [ ] Preview environment (for testing)

### 3. Configure Custom Domain (optional)
- [ ] Go to Project Settings > Domains
- [ ] Add custom domain
- [ ] Follow DNS configuration steps
- [ ] Wait for SSL certificate (usually 5-10 mins)

### 4. Deploy
- [ ] Click "Deploy" button or
- [ ] Push to main branch (auto-deploy)
- [ ] Wait for build to complete (5-10 mins)
- [ ] Check build logs for errors

### 5. Verify Deployment
- [ ] Visit deployed URL
- [ ] Verify homepage loads
- [ ] Check that all CSS/images load

---

## Phase 1D: Production Testing (30 mins)

### 1. Basic Functionality
- [ ] Homepage loads (no errors in console)
- [ ] Navigation works
- [ ] Product list loads
- [ ] Search works

### 2. Authentication
- [ ] Create account with new email
- [ ] Receive welcome email (check inbox and spam)
- [ ] Login with new account
- [ ] Update profile
- [ ] Logout

### 3. Shopping & Payment
- [ ] Add product to cart
- [ ] Proceed to checkout
- [ ] Enter shipping info
- [ ] Enter payment info (test Stripe card)
- [ ] Complete purchase
- [ ] Receive order confirmation email

### 4. Admin Features
- [ ] Login with admin account
- [ ] Access admin dashboard
- [ ] View orders
- [ ] View analytics
- [ ] Verify metrics populated

### 5. Error Handling
- [ ] Check browser console (no critical errors)
- [ ] Test invalid coupon code (should show error)
- [ ] Check Vercel logs for server errors

### 6. Email Verification
- [ ] Check that order confirmation email arrived
- [ ] Verify email formatting
- [ ] Click links in email (they should work)

---

## Phase 1E: Post-Deployment (10 mins)

### 1. Monitor Performance
- [ ] Check Vercel Analytics (if enabled)
- [ ] Monitor deployment status
- [ ] Setup error tracking (Sentry recommended)

### 2. Documentation
- [ ] Document production domain
- [ ] Store credentials securely
- [ ] Create admin user accounts
- [ ] Document admin access procedures

### 3. Backup & Recovery
- [ ] Setup database backups
- [ ] Document recovery procedures
- [ ] Setup monitoring/alerts

### 4. Production Monitoring
- [ ] Setup Sentry for error tracking (optional)
- [ ] Setup uptime monitoring (UptimeRobot free tier)
- [ ] Setup email delivery monitoring

---

## Estimated Timeline
- Phase 1A: 30 minutes
- Phase 1B: 30 minutes
- Phase 1C: 20 minutes
- Phase 1D: 30 minutes
- Phase 1E: 10 minutes
- **Total: ~2 hours**

## Critical Success Metrics
✅ Dev server runs without errors
✅ Test purchase completes successfully
✅ Order confirmation email is received
✅ Admin panel loads and shows data
✅ Production deployment is live and accessible
✅ Test purchase on production succeeds
✅ All critical user flows work end-to-end
