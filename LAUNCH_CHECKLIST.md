# 🚀 Launch Checklist - My Shop

Complete this checklist to go live in 15 minutes.

---

## ✅ Pre-Launch Checklist (5 minutes)

### Code Ready
- [ ] All files committed to git: `git status` shows no changes
- [ ] Latest code pushed: `git log --oneline` shows your commits
- [ ] Build passes locally: `npm run build` succeeds
- [ ] No TypeScript errors: `npm run type-check` passes
- [ ] Dev server runs: `npm run dev` works on http://localhost:3000

### Environment Files
- [ ] `.env.example` has all variables
- [ ] `.env.local` has test values
- [ ] `vercel.json` configured correctly
- [ ] No sensitive data in git repo

---

## 📋 Account Setup (Accounts Only - 5 minutes)

### Step 1: GitHub Account
- [ ] Create GitHub account at [github.com](https://github.com)
- [ ] Create new repository: "my-shop"
- [ ] Copy repository URL from GitHub

### Step 2: Vercel Account
- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Connect GitHub account to Vercel
- [ ] Allow Vercel to access your repositories

### Step 3: Supabase (PostgreSQL Database)
- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Copy PostgreSQL connection string
- [ ] Format: `postgresql://[user]:[password]@[host]:5432/postgres`

### Step 4: Stripe (Payment Processing)
- [ ] Use existing test keys from Stripe account
- [ ] Keys already in `.env.local`:
  - `pk_test_...`
  - `sk_test_...`
  - `whsec_test_...`

---

## 🚀 Deployment Steps (5 minutes)

### Step 1: Push Code to GitHub

Run these commands in your project folder:

```bash
# Check git status
git status

# Add any remaining files
git add .

# Commit
git commit -m "Ready for production launch"

# Push to GitHub (replace USERNAME/REPO with your info)
git remote add origin https://github.com/USERNAME/my-shop.git
git branch -M main
git push -u origin main
```

**Expected Output**:
```
✓ branch main set up to track 'origin/main'
✓ Everything up-to-date
```

---

### Step 2: Deploy to Vercel

**In Vercel Dashboard**:

1. Click **"Import Project"** button
2. Select **"GitHub"**
3. Choose your **"my-shop"** repository
4. Click **"Import"**
5. **Leave build settings as default** (Vercel auto-detects Next.js)
6. Click **"Continue"**

---

### Step 3: Add Environment Variables

**In Vercel Project Settings → Environment Variables**, add these exactly:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://[your-supabase-connection-string]` |
| `NEXTAUTH_SECRET` | `[generate-random-string]` |
| `NEXTAUTH_URL` | `https://[your-vercel-url].vercel.app` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_test_...` |
| `NEXT_PUBLIC_SITE_URL` | `https://[your-vercel-url].vercel.app` |

**How to get your Vercel URL**:
- Look in Vercel dashboard, it shows: `[your-project].vercel.app`

**How to generate NEXTAUTH_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Step 4: Deploy

Click **"Deploy"** button in Vercel.

**What happens**:
- Vercel clones your GitHub repo
- Installs dependencies
- Builds Next.js application
- Deploys to CDN
- Gives you a live URL

**Expected time**: 2-5 minutes

---

### Step 5: Verify Deployment

Once deployment shows ✅ **"Ready"**:

1. Click the live URL in Vercel
2. You should see your landing page
3. Test these pages:
   - [ ] `/shop` - Products load
   - [ ] `/cart` - Empty cart shows
   - [ ] `/orders` - Redirects to login (correct)

---

## 🧪 Testing (5 minutes)

### Test 1: Browse Products
```
✓ Go to /shop
✓ See 12 products displayed
✓ Filter by category works
✓ Sort by price works
✓ Search works
```

### Test 2: Add to Cart
```
✓ Click "Add to Cart" on product
✓ Go to /cart
✓ Product appears in cart
✓ Can update quantity
✓ Can remove item
```

### Test 3: Test Payment
```
✓ Click "Proceed to Checkout"
✓ Enter test billing address
✓ Enter test card: 4242 4242 4242 4242
✓ Any expiry date in future
✓ Any 3-digit CVC
✓ Click "Pay"
✓ See success message
✓ Check /orders shows the order
```

### Test 4: Mobile Test
```
✓ View on phone/tablet
✓ Layout looks good
✓ Checkout works on mobile
✓ Tap/swipe interactions work
```

---

## 🎯 Success Criteria

Your launch is successful when:

- ✅ Website loads at `https://[your-project].vercel.app`
- ✅ All pages work without errors
- ✅ Products display correctly
- ✅ Shopping cart works
- ✅ Checkout form loads
- ✅ Stripe test payment processes
- ✅ Order appears in `/orders`
- ✅ Mobile view looks good

---

## 🐛 Troubleshooting

### Build Failed in Vercel

**Error**: "Build failed"

**Solutions**:
1. Check Vercel build logs for specific error
2. Verify `DATABASE_URL` is set
3. Verify all environment variables are present
4. Check `.env.example` for complete list
5. Try deploying again (sometimes temporary)

---

### Page Shows 500 Error

**Error**: "Internal Server Error"

**Solutions**:
1. Check Vercel function logs
2. Verify database connection string
3. Check NEXTAUTH_SECRET is set
4. Reload page (clear cache)

---

### Payment Not Working

**Error**: "Stripe error" or "Payment failed"

**Solutions**:
1. Verify Stripe keys are correct in Vercel
2. Use test card: `4242 4242 4242 4242`
3. Use future expiry date
4. Check browser console for errors
5. Verify webhook secret matches

---

### Database Connection Error

**Error**: "Database connection failed"

**Solutions**:
1. Verify connection string format
2. Check Supabase database is running
3. Verify credentials are correct
4. Try connecting with Prisma Studio locally
5. Check IP whitelist in Supabase settings

---

## ✨ Post-Launch (Optional)

### Add Custom Domain (Optional)
1. Go to Vercel Project Settings → Domains
2. Add your domain name
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` in environment variables

### Configure Stripe Webhook (Optional)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel

### Monitor Live Application
1. Check Vercel Analytics
2. Check Stripe Dashboard for transactions
3. Monitor error logs
4. Gather user feedback

---

## 📞 Support

### If Something Goes Wrong

1. **Check Vercel Logs**
   - Vercel Dashboard → Project → Deployments → Logs

2. **Check Database**
   - Supabase Dashboard → SQL Editor
   - Run: `SELECT * FROM "Product" LIMIT 1;`

3. **Check Stripe**
   - Stripe Dashboard → Developers → Webhooks → Recent Events

4. **Check Browser Console**
   - Open website → Right-click → Inspect → Console tab

5. **Search Error Message**
   - Copy error and search on Google/Stack Overflow

---

## 🎉 You're Live!

Once deployment succeeds and tests pass, you're officially live!

**Next steps**:
1. Share your URL with friends
2. Test from different devices
3. Monitor for errors
4. Gather feedback
5. Plan Phase 4 features

---

## 📊 Launch Summary

| Step | Time | Status |
|------|------|--------|
| Code Preparation | 1 min | ✅ Done |
| GitHub Push | 2 min | 🔄 You do this |
| Vercel Deploy | 3 min | 🔄 You do this |
| Environment Setup | 2 min | 🔄 You do this |
| Testing | 5 min | 🔄 You do this |
| **Total** | **~15 min** | 🚀 Ready! |

---

**Your e-commerce platform is production-ready! Let's go live!** 🚀

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

---

**Start here**: Run the setup script
```bash
./scripts/setup-production.bat    # Windows
./scripts/setup-production.sh     # Mac/Linux
```

Then follow the deployment steps above!
