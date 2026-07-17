# 🚀 MyShop - Simplified Deployment Setup

## What You Need (15-20 minutes to set up)

This guide gives you exact steps to get 3 free/cheap services configured.

---

## Step 1: Create Vercel Account & Connect Your GitHub Repo (5 mins)

### If you don't have Vercel yet:
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
5. You're in!

### If you already have Vercel:
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your "my-shop" repository
4. Click "Import"
5. Framework should auto-detect as "Next.js"
6. Click "Deploy" (we'll add env vars next)

**Save this for later**: Your Vercel project URL will be something like: https://my-shop-xyz123.vercel.app

---

## Step 2: Create Free PostgreSQL Database (5 mins)

### Easiest Option - Use Vercel's PostgreSQL (Recommended):
1. In your Vercel project → Click "Settings"
2. Go to "Storage" tab
3. Click "Create Database"
4. Select "PostgreSQL"
5. Choose a region (closest to you)
6. Click "Create"
7. Once created, click ".env.local" button
8. Copy the "POSTGRES_PRISMA_URL" value
9. Save this value somewhere (we need it)

### Alternative - Use Free Railway ($5 free credit):
1. Go to https://railway.app
2. Click "Start Project"
3. Select "PostgreSQL"
4. Once running, click "PostgreSQL" card
5. Go to "Connect" tab
6. Copy the connection string
7. Save this value somewhere (we need it)

**What to save**: Connection string that looks like:
`postgresql://user:password@host:5432/dbname`

---

## Step 3: Create Stripe Account & Get Keys (5 mins)

### Get Free Stripe Account:
1. Go to https://dashboard.stripe.com/register
2. Enter your email and create account
3. Verify email
4. Go to https://dashboard.stripe.com/apikeys
5. You'll see two keys:
   - "Publishable key" (starts with `pk_live_`)
   - "Secret key" (starts with `sk_live_`)
6. Copy BOTH values and save them

**Note**: Use LIVE keys (not test keys) for production

**What to save**:
- STRIPE_PUBLISHABLE_KEY = `pk_live_...`
- STRIPE_SECRET_KEY = `sk_live_...`

### Get Stripe Webhook Secret (do this AFTER deployment):
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
4. Events: Select `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Once created, click the endpoint
6. Scroll to "Signing secret"
7. Click "Reveal" and copy it
8. Save as STRIPE_WEBHOOK_SECRET

**We'll come back to this in the webhook step**

---

## Step 4: Create Free Email Service (3 mins)

### Easiest Option - SendGrid (100 free emails/day):
1. Go to https://sendgrid.com/free
2. Click "Sign Up"
3. Create account with your email
4. Verify email address
5. Go to https://app.sendgrid.com/settings/api_keys
6. Click "Create API Key"
7. Name it "MyShop Production"
8. Copy the API key
9. Save it

**What to save**:
- EMAIL_HOST = `smtp.sendgrid.net`
- EMAIL_PORT = `587`
- EMAIL_USER = `apikey`
- EMAIL_PASSWORD = `SG.the_key_you_copied`
- EMAIL_FROM = `noreply@yourdomain.com` (or use your email for now)

### Alternative - Gmail (Free):
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the generated password
6. Save it

**What to save**:
- EMAIL_HOST = `smtp.gmail.com`
- EMAIL_PORT = `587`
- EMAIL_USER = `your-email@gmail.com`
- EMAIL_PASSWORD = `the_16_char_password_generated`
- EMAIL_FROM = `your-email@gmail.com`

---

## What to Collect

After completing steps 1-4, you should have these values:

```
DATABASE_URL = postgresql://...
NEXTAUTH_SECRET = (I will generate this)
NEXTAUTH_URL = https://your-vercel-url.vercel.app
STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_... (get this after deployment)
EMAIL_HOST = smtp.sendgrid.net (or smtp.gmail.com)
EMAIL_PORT = 587
EMAIL_USER = apikey (or your email)
EMAIL_PASSWORD = your_api_key_or_app_password
EMAIL_FROM = noreply@yourdomain.com (or your email)
NEXT_PUBLIC_SITE_URL = https://your-vercel-url.vercel.app
NEXT_PUBLIC_SITE_NAME = My Shop
```

---

## Next Steps

Once you have these values:
1. Message me with them (or just say "done")
2. I will:
   - Add them to Vercel automatically
   - Deploy your app
   - Setup Stripe webhooks
   - Get you live!

**Estimated total time**: 20 minutes for all accounts + 10 minutes for deployment = 30 minutes to go live

---

## Which services did you decide on?

Let me know:
- Using Vercel PostgreSQL or Railway? 
- Using SendGrid or Gmail for email?

Then I can give you more specific step-by-step instructions for each!
