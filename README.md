# 🔗 TinyLink — URL Shortener

TinyLink is a full-stack URL shortener similar to Bitly.  
Users can shorten URLs, copy links, track click counts, and manage links.

---

## 🚀 Features

✔ Shorten long URLs  
✔ Custom short codes  
✔ Copy button  
✔ Delete shortened links  
✔ Click tracking  
✔ Health check endpoint  
✔ QR Code generation (optional upgrade)

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | API Routes + PostgreSQL |
| Database | Neon Serverless Postgres |
| Deployment | Vercel |
| UI | Custom CSS |

---

## 📦 Database Schema

```sql
CREATE TABLE links (
  code VARCHAR(10) PRIMARY KEY,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
