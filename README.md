<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=30&duration=3000&pause=800&color=DC2626&center=true&vCenter=true&multiline=true&repeat=true&width=750&height=90&lines=KKIT+API+Server+%F0%9F%9B%A1%EF%B8%8F;Node.js+%2B+Express+REST+API;Secure+%7C+Fast+%7C+Scalable" alt="Typing SVG" />
</a>

<br/>

<!-- View counter -->
<a href="https://github.com/kkitbd/server">
  <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fkkitbd%2Fserver&count_bg=%23DC2626&title_bg=%23111111&icon=github&icon_color=%23FFFFFF&title=Views&edge_flat=false" alt="Views"/>
</a>
<img src="https://img.shields.io/github/stars/kkitbd/server?style=flat&logo=github&logoColor=white&color=dc2626&labelColor=111111" alt="Stars"/>
<img src="https://img.shields.io/github/forks/kkitbd/server?style=flat&logo=github&logoColor=white&color=dc2626&labelColor=111111" alt="Forks"/>
<img src="https://img.shields.io/github/issues/kkitbd/server?style=flat&logo=github&logoColor=white&color=dc2626&labelColor=111111" alt="Issues"/>
<img src="https://img.shields.io/badge/license-GPL%20v3-dc2626?style=flat&logo=gnu&logoColor=white&labelColor=111111" alt="License"/>

<br/><br/>

<!-- Tech stack with real icons -->
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
<img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
<img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"/>
<img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
<img src="https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white" alt="Nodemailer"/>
<img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe"/>
<img src="https://img.shields.io/badge/Helmet.js-000000?style=for-the-badge&logo=helmet&logoColor=white" alt="Helmet"/>
<img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white" alt="Nodemon"/>

<br/><br/>

<p>The official REST API backend for <strong>KKIT</strong> — Bangladesh's premium digital solutions and e-learning platform.<br/>
Secure · Fast · Fully documented · Live server dashboard included</p>

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Access + refresh tokens, role-based access control
- 🛡️ **Security** — Helmet, CORS, rate limiting, attack detection (SQL injection, XSS, path traversal)
- 📊 **Live Dashboard** — Visit `http://localhost:5000` for real-time request stats, attack log, error log
- 🎨 **Animated Terminal Banner** — Colorful startup screen with typing effect
- 📁 **Modular Architecture** — Feature-based module structure
- 💳 **Multi-Payment Gateway** — SSLCommerz, bKash, Stripe
- 📧 **Email** — Nodemailer + Handlebars templates
- 📄 **PDF Certificates** — Auto-generated via PDFKit
- ☁️ **File Uploads** — Multer + Cloudinary
- ⚡ **Caching** — node-cache for performance

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Validation | Zod |
| File Storage | Multer + Cloudinary |
| Email | Nodemailer + Handlebars |
| PDF | PDFKit |
| Security | Helmet + express-rate-limit |
| Logging | Morgan |
| Dev | Nodemon |

---

## 📁 Project Structure

```
src/
├── server.js                   # Entry point — animated banner + server start
├── app.js                      # Express app (middleware, routes, dashboard)
├── config/
│   ├── db.js                   # MongoDB connection
│   ├── env.js                  # Environment variable loader
│   └── cors.js                 # CORS whitelist config
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── rateLimiter.js          # Rate limiting (API / auth / forms)
│   ├── stats.js                # Request stats + attack detection
│   ├── errorHandler.js         # Global error handler
│   ├── permission.js           # Permission checks
│   ├── role.js                 # Role-based access control
│   ├── upload.js               # Multer config
│   └── validate.js             # Zod request validation
├── modules/                    # Feature modules
│   ├── auth/
│   ├── user/
│   ├── course/
│   ├── enrollment/
│   ├── payment/
│   ├── invoice/
│   ├── blog/
│   ├── service/
│   ├── pricing/
│   ├── portfolio/
│   ├── team/
│   ├── contact/
│   ├── testimonial/
│   ├── faq/
│   ├── newsletter/
│   ├── review/
│   ├── certificate/
│   ├── dashboard/
│   ├── admin/
│   ├── assignment/
│   ├── submission/
│   └── device/
├── services/                   # External integrations
│   ├── email.service.js
│   ├── cloudinary.service.js
│   └── payment/
└── utils/
    ├── banner.js               # Terminal startup animation
    └── dashboard.js            # Browser dashboard renderer
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/kkitbd/server.git
cd server
npm install
cp .env.example .env
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/kkitbd

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password

SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASS=your_store_password
SSLCOMMERZ_IS_LIVE=false

BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLIENT_URL=http://localhost:4000
ADMIN_URL=http://localhost:4001
```

### Running

```bash
npm run dev     # Development (nodemon, hot reload)
npm start       # Production
npm run seed    # Seed database with demo data
npm run lint    # Lint
```

---

## 🌐 API Reference

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register |
| POST | `/auth/login` | ❌ | Login |
| POST | `/auth/logout` | ✅ | Logout |
| GET | `/users` | 🔑 Admin | List users |
| GET | `/courses` | ❌ | List courses |
| POST | `/courses` | 🔑 Admin | Create course |
| GET | `/blogs` | ❌ | List blogs |
| GET | `/services` | ❌ | Services |
| GET | `/pricing` | ❌ | Pricing |
| GET | `/portfolio` | ❌ | Portfolio |
| GET | `/team` | ❌ | Team |
| POST | `/contact` | ❌ | Contact form |
| POST | `/newsletter` | ❌ | Subscribe |
| GET | `/enrollments` | ✅ | My enrollments |
| POST | `/payments` | ✅ | Initiate payment |
| GET | `/certificates` | ✅ | My certificates |
| GET | `/dashboard` | ✅ | Dashboard stats |
| GET | `/health` | ❌ | Health check (JSON) |
| GET | `/` | ❌ | **Live dashboard UI** |

---

## 🛡️ Security

- Rate limiting: **60 req/min** (API), **10 req/min** (auth), **5 req/min** (forms)
- Attack detection: SQL injection, XSS, path traversal, command injection, SSRF
- JWT with short expiry + refresh token rotation
- bcryptjs with 12 salt rounds
- Helmet security headers
- CORS whitelist
- 10MB body size limit

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

---

## 🤝 Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a PR.

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant v2.1](./CODE_OF_CONDUCT.md).

---

## 📄 License

Licensed under the **GNU General Public License v3.0** — see [LICENSE](./LICENSE).

---

<div align="center">

Made with ❤️ by **KKIT Team** · Bangladesh 🇧🇩

[![Website](https://img.shields.io/badge/kkitbd.com-dc2626?style=flat-square&logo=googlechrome&logoColor=white)](https://kkitbd.com)

</div>