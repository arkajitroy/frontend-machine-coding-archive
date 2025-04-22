## Design & Build a TinyURL System (System Design + Machine Coding)

### 📌 Overview

Your task is to design and implement a scalable TinyURL service, similar to bit.ly or tinyurl.com, that allows users to enter a long URL and get a shortened version. When someone visits the shortened URL, they should be redirected to the original long URL.

### ✅ Functional Requirements

1. **Shorten URL**

   - User submits a long URL.
   - Return a shortened URL.
   - e.g., `https://google.com/news18

2. **Redirect URL**

   - Visiting a shortened URL should redirect to the original long URL.

3. **Analytics (Optional + Bonus)**

   - Track number of times a URL was accessed.
   - Track unique visitors (via IP or fingerprint).

4. **Custom Aliases (Bonus)**

   - Allow users to provide a custom short alias (e.g., `https://myapp.com/my-blog`).

5. **Expiration Support (Bonus)**
   - URLs can have expiry times or limits on number of uses.

---

### 🚀 Non-Functional Requirements:

1. **High Availability**

   - The system should be up and running 24/7.

2. **High Throughput**

   - Capable of handling high volume of requests (shortens + redirects).

3. **Low Latency**

   - Redirection should happen in milliseconds.

4. **Scalability**

   - System should scale horizontally with users and traffic.

5. **Consistency**

   - Redirects must always return the correct long URL.

6. **Collision Resistant**
   - Unique short URLs, even at scale.

---

### ⚙️ Constraints & Assumptions:

- Assume 1 billion URLs shortened in a year.
- Reads are 100x more frequent than writes.
- URLs are read-heavy and require fast redirection.
- Shortened URL length should be ~6–8 characters.

---

### 💾 Storage Design:

- Use **MongoDB** for persistent storage (NoSQL).
- Optional: Add **Redis** for caching popular redirects.

---

### 🧱 Suggested Tech Stack:

- **Frontend**: React (Optional bonus UI)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Caching**: Redis (optional bonus)
- **Testing**: Jest / Postman
- **Deployment**: Docker or basic `pm2 + nginx` (out of scope but mentionable)

---

## 👨‍💻 PART 2: Machine Coding Task

---

### 🔨 Implementation Requirements (MVP Scope):

- Build a **REST API** with following endpoints:

#### `POST /api/shorten`

- Request Body:

```json
{
  "longUrl": "https://example.com/blog/my-article"
}
```

- Response:

```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

#### `GET /:shortId`

- Redirects the user to the original long URL.

---

### 💡 Bonus Endpoints (Optional for Extra Points):

#### `GET /api/analytics/:shortId`

- Returns number of clicks, and optionally IP logs.

#### `POST /api/custom-shorten`

- Allow users to provide their custom short string.

---

### 💾 MongoDB Schema Suggestions:

```ts
// url.model.ts (Mongoose)
{
  shortId: { type: String, unique: true },
  longUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  clickCount: { type: Number, default: 0 },
  expiresAt: { type: Date, optional: true }
}
```

---

### 🧪 Test Cases:

1. Shorten a valid URL → should return valid short URL.
2. Redirect using valid short URL → should 302 redirect to long URL.
3. Handle invalid short IDs → return 404.
4. Same long URL → may return same or new short URL (up to implementation).
5. Add expiry → ensure redirection fails after expiry.

---
