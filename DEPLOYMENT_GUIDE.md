# Deployment Guide - My Shop E-Commerce Platform

**Status**: Ready for production deployment  
**Platform**: Vercel (Recommended)  
**Database**: PostgreSQL (Supabase, Railway, or similar)  
**Estimated Setup Time**: 15-20 minutes

---

## 1. Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account (for Vercel deployment)
- ✅ Stripe account (test or production keys)
- ✅ PostgreSQL database (free options: Supabase, Railway)
- ✅ A domain name (optional, use Vercel subdomain initially)
- ✅ Basic understanding of environment variables

---

## 2. Step-by-Step Deployment

### Step 2.1: Set Up PostgreSQL Database

#### Option A: Supabase (Recommended - Free)

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Choose your region and password
4. Go to Project Settings → Database → Connection String
5. Copy the PostgreSQL connection string
6. Format: `postgresql://[user]:[password]@[host]:5432/[database]`

#### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create a new project → Add PostgreSQL
4. Copy the database URL from variables

#### Option C: Other Providers
- Neon
- PlanetScale (MySQL)
- AWS RDS
- DigitalOcean

### Step 2.2: Generate Secure Secrets

Generate secure random strings for secrets:

```bash
# Open Node.js console
node

# Generate NEXTAUTH_SECRET
console.log(require('crypto').randomBytes(32).toString('hex'))

# Copy the output and save it
```

Or use an online generator: [generate-random.org](https://www.random.org/bytes/)

### Step 2.3: Set Up Stripe

**For Testing (Current Setup)**:
- Use existing test keys from `.env.local`
- No additional configuration needed
- Test card: `4242 4242 4242 4242`

**For Production (Later)**:
1. Go to [stripe.com](https://stripe.com)
2. Create a live account
3. Get your live keys: Settings → API Keys
4. Configure webhook: Developers → Webhooks
5. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
6. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### Step 2.4: Push to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: Full e-commerce platform"

# Create new repository on GitHub
# Then push:
git remote add origin https://github.com/yourusername/myshop.git
git branch -M main
git push -u origin main
```

### Step 2.5: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. Configure project settings:
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`

### Step 2.6: Add Environment Variables in Vercel

In Vercel dashboard → Project Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://[your-connection-string]
NEXTAUTH_SECRET=[your-generated-secret]
NEXTAUTH_URL=https://[your-vercel-url].vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
NEXT_PUBLIC_SITE_URL=https://[your-vercel-url].vercel.app
```

### Step 2.7: Deploy

Click "Deploy" button in Vercel. The build will:
1. Install dependencies
2. Run Prisma migrations
3. Seed the database
4. Build the Next.js application

Deployment typically takes 2-5 minutes.

---

## 3. Post-Deployment Configuration

### 3.1 Test Payment Flow

1. Go to your deployed URL
2. Add products to cart
3. Proceed to checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete purchase
6. Verify order appears in `/orders`

### 3.2 Configure Custom Domain (Optional)

1. Buy domain from registrar (GoDaddy, Namecheap, etc.)
2. In Vercel: Project Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`

### 3.3 Configure Stripe Webhook

After custom domain is set up:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel

### 3.4 Enable HTTPS

HTTPS is automatically enabled by Vercel. Verify:
- URL should start with `https://`
- Padlock icon in browser

---

## 4. Monitoring & Maintenance

### 4.1 Monitor Deployments

**Vercel Dashboard**:
- Check deployment status
- View build logs
- Monitor analytics

### 4.2 Database Maintenance

**Backup Database**:
```bash
# Supabase provides automatic daily backups
# To manually backup:
pg_dump [your-connection-string] > backup.sql
```

**Run Migrations**:
```bash
# To run migrations after changes:
npx prisma migrate deploy
```

**Check Database Status**:
```bash
# Connect to database and run queries
npx prisma studio
```

### 4.3 Monitor Stripe Payments

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Check Payments section for transactions
3. Monitor Webhooks for failures
4. Review disputes (if any)

---

## 5. Updating to Production Keys

When ready to go live with real payments:

### 5.1 Get Stripe Live Keys

1. Go to [Stripe Dashboard](https://stripe.com/dashboard)
2. Activate your account fully
3. Switch toggle to "Live" mode
4. Get live keys (pk_live_*, sk_live_*)

### 5.2 Update Environment Variables

In Vercel, update:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

### 5.3 Test with Real Payments

Use real payment methods to verify everything works. Stripe will process transactions immediately.

---

## 6. Troubleshooting

### Issue: Build Fails with "DATABASE_URL not found"

**Solution**:
- Verify DATABASE_URL is set in Vercel Environment Variables
- Ensure connection string is correct format
- Check database is running and accessible

### Issue: Payments Not Processing

**Solution**:
- Verify Stripe keys are correct in Vercel
- Check webhook secret matches Stripe dashboard
- Test with test card first
- Review Stripe logs for errors

### Issue: Webhook Failures

**Solution**:
- Verify webhook URL in Stripe is correct
- Check STRIPE_WEBHOOK_SECRET matches exactly
- Review Vercel logs for webhook errors
- Test webhook with Stripe CLI locally

### Issue: Database Connection Timeout

**Solution**:
- Check database is running
- Verify connection string has correct host/port
- Check firewall allows Vercel IPs
- For Supabase, verify in Supabase settings

---

## 7. Production Checklist

Before going live with real payments:

- [ ] Domain name configured and HTTPS working
- [ ] PostgreSQL database set up and migrated
- [ ] All environment variables configured
- [ ] Stripe webhook configured with live URL
- [ ] Stripe switched to live mode
- [ ] Test payment with real card
- [ ] Order confirmation email working (optional)
- [ ] Database backups configured
- [ ] Error logging configured (optional)
- [ ] Analytics configured (optional)
- [ ] Monitoring/alerting set up (optional)
- [ ] Privacy policy and terms of service added
- [ ] SSL certificate verified

---

## 8. Performance Optimization

### 8.1 Image Optimization

- Using Next.js Image component ✅
- Images optimized automatically
- Consider CDN: Cloudinary, imgix

### 8.2 Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_orders_user ON orders(userId);
CREATE INDEX idx_cart_user ON cart_items(userId);
```

### 8.3 Caching

- Vercel ISR (Incremental Static Regeneration) enabled
- API responses cached where appropriate
- Consider Redis cache for frequently accessed data

---

## 9. Scaling for Growth

As your platform grows:

1. **Database**: Upgrade Supabase/Railway plan
2. **CDN**: Add Vercel Edge Network or Cloudflare
3. **Analytics**: Implement monitoring (Sentry, LogRocket)
4. **Email**: Add SendGrid or Mailgun for transactional emails
5. **Analytics**: Add Segment or Mixpanel
6. **Search**: Add Algolia or Meilisearch for better search

---

## 10. Cost Breakdown (Monthly Estimates)

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Vercel | $0-10 | $20+ | Serverless, auto-scaling |
| Supabase PostgreSQL | Free (2 projects) | $25+ | Managed database |
| Stripe | 0% | 2.9% + $0.30 | Per transaction |
| Domain | - | $10-15/yr | Annual cost |
| **Total** | **~$0** | **~$50-75** | Depends on traffic |

---

## 11. Support & Resources

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Database
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs/)

### Stripe
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)

### Troubleshooting
- Check Vercel deployment logs
- Review Stripe webhook logs
- Check browser console for errors
- Review server logs in Vercel

---

## 12. Next Steps After Launch

1. **Monitor Analytics**: Track user behavior and sales
2. **Collect Feedback**: Get customer feedback for improvements
3. **Scale Infrastructure**: Add caching and CDN as needed
4. **Add Features**: Consider features from Phase 4
5. **Marketing**: SEO, email, social media campaigns
6. **Community**: Build user community and loyalty

---

**Your e-commerce platform is ready for production!** 🚀

For questions or issues, refer to the documentation links above or check the project's GitHub issues.

---

**Last Updated**: 2026-07-10  
**Version**: 1.0.0 - Production Ready
