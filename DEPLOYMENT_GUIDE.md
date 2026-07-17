# MyShop Deployment Guide

## Option 1: Test & Deploy to Vercel

### Prerequisites
- Vercel account (free tier available at vercel.com)
- Git repository pushed to GitHub
- Production database (PostgreSQL recommended)
- Stripe production keys
- Email service (SendGrid, Gmail SMTP, or other)

### Step 1: Prepare for Deployment

#### 1.1 Production Database Setup
```bash
# Option A: Use Vercel PostgreSQL
# - Go to Vercel Dashboard > Storage > PostgreSQL
# - Create new database
# - Copy connection string

# Option B: Use external PostgreSQL (Railway, AWS RDS, Supabase)
# - Create database
# - Note the CONNECTION string
```

#### 1.2 Environment Variables Setup
```bash
# Copy the example file
cp .env.production.example .env.production

# Fill in your production values:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (your domain)
# - STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET
# - Email configuration
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

#### 1.3 Generate NEXTAUTH_SECRET
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | ForEach-Object { $_ -replace '=', '' } | Select-Object -First 1
```

### Step 2: Deploy to Vercel

#### 2.1 Connect Repository
1. Go to vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select "Next.js" as the framework

#### 2.2 Configure Environment Variables
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from .env.production.example
3. Ensure variables are available to all environments (Production, Preview, Development)

#### 2.3 Deploy
```bash
# Option A: Automatic deployment
# Push to main branch → Vercel auto-deploys

# Option B: Manual deployment in Vercel UI
# Click "Deploy" button
```

### Step 3: Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add new endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: Select `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Copy webhook secret
4. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Step 4: Configure Email Service

#### Option A: SendGrid
```bash
# 1. Create SendGrid account (free tier: 100 emails/day)
# 2. Create API key from Settings → API Keys
# 3. Set environment variables:
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your_api_key
```

#### Option B: Gmail SMTP
```bash
# 1. Enable 2-factor authentication
# 2. Generate app-specific password
# 3. Set environment variables:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Option C: Other SMTP
See provider documentation for SMTP credentials.

### Step 5: Test Critical Flows

#### 5.1 Authentication
- Sign up with new account
- Login
- Update profile
- Logout and login again

#### 5.2 Shopping
- Browse products
- Add to cart with discount code
- Checkout with test Stripe card (4242 4242 4242 4242, any future date, any CVC)
- Verify order confirmation email sent

#### 5.3 Admin Panel
- Login as admin
- View dashboard metrics
- Check analytics
- Create/edit products
- Manage discounts

#### 5.4 Email Verification
- Check that order confirmation emails arrive
- Verify email styling
- Test password reset email

### Step 6: Production Checklist

- [ ] Database is running (check connection)
- [ ] All environment variables set in Vercel
- [ ] Stripe production keys configured
- [ ] Stripe webhooks configured
- [ ] Email service configured and tested
- [ ] Domain configured (Settings → Domains)
- [ ] SSL certificate active (auto with Vercel)
- [ ] Analytics tracking working
- [ ] Admin panel accessible
- [ ] Test purchase completed successfully
- [ ] Emails being delivered

---

## Option 2: Real-Time Features & Multi-Seller Support

### Real-Time Notifications
- Order status updates via WebSockets
- Inventory alerts
- Admin notifications

### Affiliate Program
- Affiliate dashboard
- Commission tracking
- Referral links

### Multi-Seller Support
- Vendor accounts
- Vendor dashboard
- Commission management
- Payment splits

---

## Option 3: Performance Optimization

### Caching Layer (Redis)
```bash
# Install Redis add-on on Vercel or use external service
# Add REDIS_URL to environment variables
```

### Search Engine (Elasticsearch)
- Product full-text search
- Auto-complete
- Faceted search

### Monitoring & Analytics
- Sentry for error tracking
- Analytics dashboard
- Performance monitoring

---

## Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel
# Run locally: npm run build
# Fix TypeScript errors
# Verify all dependencies installed
```

### Environment Variables Not Applying
- Redeploy after setting variables
- Check variable names match exactly
- Clear browser cache

### Emails Not Sending
- Verify email credentials
- Check spam folder
- Review email logs in Vercel
- Test with SendGrid sandbox

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is running
- Verify firewall/security groups allow connection
- Run migrations: `npx prisma migrate deploy`

---

## Next Steps After Deployment

1. Set up monitoring (Sentry for errors)
2. Configure analytics
3. Set up automated backups
4. Create admin users
5. Plan Option 2 & 3 implementation
