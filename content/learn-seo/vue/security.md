---
title: Protecting Vue Apps from Malicious Crawlers
description: Learn how to protect your Vue application from malicious crawlers and bots.
navigation:
  title: 'Security'
publishedAt: 2024-11-03
updatedAt: 2024-12-05
readTime: 8 mins
keywords:
  - security
  - vue
  - bots
  - malicious crawlers
---

## Introduction

[Robots.txt](/learn-seo/vue/controlling-crawlers/robots-txt) and meta robots tags are polite suggestions. Malicious crawlers ignore them. You need actual security to protect sensitive content.

**✅ Good Security Practices:**

- Block non-production environments
- Protect development assets
- Rate limit aggressive crawlers
- Authenticate sensitive routes
- Monitor crawler behavior
- Use HTTPS everywhere

**❌ Don't Rely On:**

- robots.txt for sensitive data (lazy and ineffective)
- IP blocking alone (easily bypassed)
- User-agent detection (trivial to fake)
- Client-side only protection (not real security)
- Security through obscurity

## Quick Setup

Protect your Vue app from unwanted crawlers at the server level:

```ts [Express Middleware]
// server/middleware/security.js
import express from 'express'

const app = express()

// Block non-production environments
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  }
  next()
})

// Enforce HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`)
  }
  next()
})
```

```ts [Security Headers]
// Add security headers to your server
import helmet from 'helmet'

app.use(helmet({
  frameguard: { action: 'deny' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      scriptSrc: ['\'self\'']
    }
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}))
```

```ts [Rate Limiting]
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api', limiter)
```

## Environment Protection

### Development & Staging

Always block search engines in non-production environments:

```ts
// middleware/block-non-production.js
app.use((req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production'
  const isMainDomain = req.headers.host === 'mysite.com'

  if (!isProd || !isMainDomain) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')

    // Also consider basic auth for staging
    const auth = req.headers.authorization

    if (!auth) {
      res.setHeader('WWW-Authenticate', 'Basic')
      return res.status(401).send('Authentication required')
    }
  }
  next()
})
```

### Sensitive Routes

Protect admin and user areas:

```ts
// middleware/protect-routes.js
app.use((req, res, next) => {
  const protectedPaths = ['/admin', '/dashboard', '/user']

  if (protectedPaths.some(path => req.path.startsWith(path))) {
    // Ensure user is authenticated
    if (!req.session?.user) {
      return res.redirect('/login')
    }

    // Block indexing of protected content
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  }
  next()
})
```

## Crawler Identification

### Good vs Bad Crawlers

Identify legitimate crawlers through:
- Reverse DNS lookup
- IP verification
- Behavior patterns
- Request rate

```ts
// utils/verify-crawler.js
import dns from 'node:dns'
import { promisify } from 'node:util'

const reverse = promisify(dns.reverse)

export async function isLegitCrawler(ip, userAgent) {
  // Example: Verify Googlebot
  if (userAgent.includes('Googlebot')) {
    const hostnames = await reverse(ip)
    return hostnames.some(h => h.endsWith('googlebot.com'))
  }
  return false
}
```

### Rate Limiting

Implement tiered rate limiting:

```ts
import rateLimit from 'express-rate-limit'

// Different limits for different paths
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

const crawlerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  skip: req => !req.headers['user-agent']?.includes('bot')
})

app.use('/api', apiLimiter)
app.use(crawlerLimiter)
```

## Infrastructure Security

### HTTPS Enforcement

Always redirect HTTP to HTTPS:

```ts
app.use((req, res, next) => {
  const proto = req.headers['x-forwarded-proto']

  if (proto === 'http') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`)
  }
  next()
})
```

### Security Headers

Add security headers using helmet:

```ts
import helmet from 'helmet'

app.use(helmet({
  // Prevent clickjacking
  frameguard: { action: 'deny' },
  // Prevent MIME type sniffing
  noSniff: true,
  // Control referrer information
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Enable strict CSP in production
  contentSecurityPolicy: process.env.NODE_ENV === 'production'
    ? {
        directives: {
          defaultSrc: ['\'self\'']
        }
      }
    : false
}))
```

## Monitoring & Detection

### Logging Suspicious Activity

```ts
// middleware/crawler-monitor.js
app.use((req, res, next) => {
  const ua = req.headers['user-agent']
  const ip = req.ip

  // Log suspicious patterns
  if (isSuspiciousPattern(ua, ip)) {
    console.warn(`Suspicious crawler: ${ip} with UA: ${ua}`)
    // Consider blocking or rate limiting
  }
  next()
})
```

### Using Web Application Firewalls

Services like Cloudflare or AWS WAF can:
- Block malicious IPs
- Prevent DDoS attacks
- Filter suspicious requests
- Monitor traffic patterns

**Opinion:** If you're running a small blog, a WAF is overkill. Add it when you're actually getting attacked.

## Common Attacks

### Content Scraping

Prevent automated content theft:

```ts
const requestCounts = new Map()

app.use((req, res, next) => {
  const ip = req.ip
  const count = requestCounts.get(ip) || 0

  if (count > 100) {
    return res.status(429).send('Too Many Requests')
  }

  requestCounts.set(ip, count + 1)

  // Add slight delays to automated requests
  if (isBot(req.headers['user-agent'])) {
    setTimeout(next, 500)
  }
  else {
    next()
  }
})
```

### Form Spam

Protect forms from bot submissions:

```ts
// routes/contact.js
app.post('/api/contact', async (req, res) => {
  const { website, ...formData } = req.body

  // Honeypot check
  if (website) { // hidden field
    return res.json({ success: false })
  }

  // Rate limiting
  if (exceedsRateLimit(req.ip)) {
    return res.status(429).json({
      error: 'Too many attempts'
    })
  }

  // Process legitimate submission
  // ...
})
```

## Related

### Core Concepts
- [Web Crawler Basics](/learn-seo/vue/controlling-crawlers) - How crawlers work
- [Robots.txt Guide](/learn-seo/vue/controlling-crawlers/robots-txt) - Basic crawler control
- [Meta Robots](/learn-seo/vue/controlling-crawlers/meta-tags) - Page-level control

### Additional Resources
- [Google's Security Guidelines](https://developers.google.com/search/docs/advanced/security/security-checklist)
- [OWASP Security Practices](https://owasp.org/www-project-web-security-testing-guide/)
- [Cloudflare's Bot Management](https://www.cloudflare.com/products/bot-management/)

---

**Looking for Nuxt-specific implementation?** Check out the [Nuxt Security Guide](/learn-seo/nuxt/security) for server middleware examples and Nuxt-specific configurations.
