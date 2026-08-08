# StreamEarn - Complete Video Monetization Platform 🎬💰

A comprehensive platform for video creators to upload, monetize, and earn money from their content through multiple revenue streams.

## 🌟 Features

### 💰 Monetization Options
- **Ad Revenue**: Pre-roll, Mid-roll, and Post-roll advertisements
- **Donations**: Direct donations from viewers
- **Subscriptions**: Premium membership for exclusive content
- **Sponsorships**: Brand partnerships and sponsorships

### 👥 Creator Features
- **Profile Management**: Customizable creator profiles
- **Video Upload**: Easy video upload and management
- **Analytics Dashboard**: Real-time earnings and performance tracking
- **Subscriber Management**: Build and manage your audience
- **Payment Withdrawals**: Direct bank transfers via Stripe

### 🎥 Viewer Features
- **Video Discovery**: Browse and search videos
- **Streaming**: Watch high-quality videos
- **Support Creators**: Like, comment, and donate
- **Subscribe**: Subscribe to favorite creators

## 🏗️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Stripe** - Payment processing
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Stripe account
- Cloudinary account (optional)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/acik62199-ops/ALI.git
cd ALI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Start Server
```bash
npm run dev
```

Server runs on: **http://localhost:5000**

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### 👤 Users
- `GET /api/users/:id` - Get profile
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/subscribe` - Subscribe
- `GET /api/users/:id/dashboard` - Dashboard

### 🎥 Videos
- `GET /api/videos` - All videos
- `GET /api/videos/:id` - Video details
- `POST /api/videos` - Upload video
- `PUT /api/videos/:id/like` - Like video
- `POST /api/videos/:id/comment` - Comment
- `DELETE /api/videos/:id` - Delete video

### 💳 Payments
- `POST /api/payments/create-intent` - Create payment
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history/:userId` - History

### 💰 Earnings
- `GET /api/earnings/:userId` - Get earnings
- `POST /api/earnings` - Record earning
- `GET /api/earnings/video/:videoId` - Video earnings
- `POST /api/earnings/process/monthly` - Process earnings

### 📢 Ads
- `POST /api/ads` - Create ad
- `POST /api/ads/:adId/impression` - Record impression
- `POST /api/ads/:adId/click` - Record click
- `GET /api/ads/video/:videoId` - Video ads

### 🎁 Donations
- `POST /api/donations/donate` - Donate
- `POST /api/donations/confirm-donation` - Confirm
- `GET /api/donations/video/:videoId` - Video donations
- `GET /api/donations/user/:userId` - User donations

## 📁 Project Structure

```
ALI/
├── models/
│   ├── User.js
│   ├── Video.js
│   ├── Payment.js
│   ├── Earnings.js
│   └── Advertisement.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── videos.js
│   ├── payments.js
│   ├── earnings.js
│   ├── ads.js
│   └── donations.js
├── server.js
├── package.json
└── .env.example
```

## 💰 Revenue Streams

1. **Ad Revenue** - $5 CPM
2. **Donations** - Direct support
3. **Subscriptions** - Monthly recurring
4. **Sponsorships** - Brand deals

## 🔒 Security

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Input validation
- ✅ CORS protection
- ✅ MongoDB injection protection

## 🧪 Test API

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'
```

## 📞 Support

For issues, open a GitHub issue or contact us.

## 📝 License

MIT License

---

**Made with ❤️ for Creators** 🌍
