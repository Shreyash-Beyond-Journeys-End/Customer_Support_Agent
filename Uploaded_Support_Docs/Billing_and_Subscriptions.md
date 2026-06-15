# Comprehensive Guide to Billing and Subscriptions

## 1. Understanding Our Subscription Tiers
We offer three main subscription tiers designed to scale with your business needs:
- **Free Tier:** Ideal for individuals and hobbyists testing out our platform. Includes 10,000 requests per month, standard community support, and access to basic AI models.
- **Pro Tier ($29/month):** Designed for startups and growing businesses. Includes 500,000 requests per month, priority email support, access to advanced AI models (including GPT-4o and Claude 3.5 Sonnet), and a guaranteed 99.9% uptime SLA.
- **Enterprise Tier (Custom Pricing):** Built for large organizations requiring dedicated infrastructure. Includes unlimited requests, a dedicated technical account manager, SSO integration, SOC2 compliance reports, and custom SLAs.

## 2. Upgrade and Downgrade Policies
### Upgrading Your Plan
You can upgrade your plan at any time through the **Billing Dashboard**. When you upgrade from Free to Pro, you will be billed immediately for the first month, and your new request limits will be applied instantly. If you upgrade from a monthly to an annual plan, the unused portion of your monthly plan will be prorated and applied as a credit to your annual invoice.

### Downgrading Your Plan
If you choose to downgrade from Pro to Free, your Pro status will remain active until the end of your current billing cycle. On the renewal date, your account will transition to the Free tier. **Important:** Ensure your usage is within the Free tier limits before the transition; otherwise, excess requests will automatically be rejected with a `429 Too Many Requests` error.

## 3. Proration and Refunds
### Proration
We use exact-day proration. If you add new seats or usage limits halfway through your billing cycle, you will only be charged for the remaining days of that cycle.

### Refund Policy
- **Monthly Plans:** All monthly subscription payments are non-refundable. We do not provide prorated refunds for mid-month cancellations.
- **Annual Plans:** We offer a 14-day money-back guarantee for new annual subscriptions. If you are unsatisfied, you must contact `billing@resolveai.com` within 14 days of your initial purchase to receive a full refund. After 14 days, annual plans become non-refundable.
- **Overage Charges:** Overage charges incurred from exceeding your plan's API limits are strictly non-refundable as they represent actual compute costs incurred by our servers.

## 4. Payment Methods and Invoicing
### Accepted Payment Methods
We securely process payments via Stripe. We accept:
- All major credit and debit cards (Visa, Mastercard, American Express, Discover).
- Apple Pay and Google Pay (available via supported browsers).
- ACH transfers (available only for Enterprise customers in the US).

We do **not** accept PayPal, cryptocurrency, or physical checks for standard self-serve plans.

### Invoice Retrieval
Invoices are generated automatically on your billing date. You can download PDF copies of your past invoices at any time by navigating to **Settings > Billing > Invoice History**. You can also add custom billing details (such as your company name, address, and VAT ID) to your invoices by editing your "Billing Information" before downloading the PDF.

## 5. Failed Payments and Account Suspensions
If a recurring payment fails (e.g., due to an expired card or insufficient funds), we will notify you immediately via email.
1. We will automatically retry the charge 3 times over the course of 7 days.
2. During this 7-day grace period, your API access remains fully active.
3. If the payment still fails after the 3rd attempt, your account will be temporarily suspended, and API requests will return a `402 Payment Required` error.
4. Once you update your payment method, the outstanding balance will be charged, and your account will be instantly reactivated.
