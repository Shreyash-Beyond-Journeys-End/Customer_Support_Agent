# API Troubleshooting and Integration Guide

This guide covers the most common errors developers encounter when integrating our API, along with comprehensive solutions to resolve them.

## 1. Authentication Errors (401 & 403)
Every request to our API must be authenticated using an API key. 

### 401 Unauthorized
A `401` error means your API key was rejected. This usually happens for three reasons:
1. **Missing Header:** You failed to include the `Authorization` header. It must be formatted exactly as: `Authorization: Bearer YOUR_SECRET_KEY`.
2. **Invalid Key:** The key contains a typo. Ensure there are no trailing spaces.
3. **Revoked Key:** Your key was manually deleted in the Developer Dashboard, or our automated security system revoked it because it was accidentally committed to a public GitHub repository.

### 403 Forbidden
A `403` error means your API key is valid, but you do not have permission to access the specific endpoint.
- Ensure you are not trying to access an Enterprise-only endpoint (like `/v1/admin/audit-logs`) using a Free tier key.
- Check if your API key has restricted scopes. If you created a read-only key, it cannot be used for `POST` or `DELETE` requests.

## 2. Rate Limiting (429 Too Many Requests)
To ensure system stability, we enforce rate limits on a sliding window algorithm based on your subscription tier.

### Limits by Tier:
- **Free:** 100 RPM (Requests Per Minute) / 1,000 RPD (Requests Per Day).
- **Pro:** 1,000 RPM / 50,000 RPD.
- **Enterprise:** Custom limits (typically starting at 10,000 RPM).

### Handling Rate Limits
When you hit a rate limit, the API responds with a `429 Too Many Requests` status code. The response headers will include:
- `X-RateLimit-Limit`: Your current tier's RPM limit.
- `X-RateLimit-Remaining`: How many requests you have left in the current window.
- `X-RateLimit-Reset`: The Unix timestamp when your limits will reset.

**Best Practice:** Do not rapidly retry failed requests. Implement an **Exponential Backoff** algorithm in your code. Wait for the time specified in the `Retry-After` header before sending the next request.

## 3. Cross-Origin Resource Sharing (CORS) Errors
If you are building a Single Page Application (SPA) using React, Vue, or Angular, and you attempt to fetch our API directly from the user's browser, you will encounter a CORS error.

**Why does this happen?**
Our API intentionally blocks direct browser requests to protect your API keys. If you embed your secret API key in frontend JavaScript, anyone can view the source code and steal your key to make requests on your behalf.

**The Solution:**
You must route all API calls through your own backend server (e.g., Node.js, Python FastAPI, Ruby on Rails). 
1. Your frontend calls your backend.
2. Your backend securely holds the API key in its `.env` variables.
3. Your backend forwards the request to our API, receives the response, and sends it back to your frontend.

## 4. Webhook Delivery Failures
We use webhooks to notify your application of asynchronous events (like a long-running document ingestion finishing).

### Delivery Rules
- Your webhook endpoint must be publicly accessible (not on `localhost`). To test locally, use a tool like Ngrok.
- Your endpoint must return a `2xx` HTTP status code (e.g., `200 OK`) within **3 seconds** of receiving our payload.

### Retry Logic
If your server responds with a `5xx` error, or if it takes longer than 3 seconds to respond, our system considers it a failure. We will attempt to redeliver the webhook payload up to 5 times over the next 24 hours using an exponential delay (1 min, 5 mins, 30 mins, 2 hours, 24 hours). 

If you are doing heavy processing when receiving a webhook, **do not process the data synchronously**. Instead, immediately return a `200 OK` response to acknowledge receipt, and queue the payload in a background worker (like Celery or Redis) for processing.
