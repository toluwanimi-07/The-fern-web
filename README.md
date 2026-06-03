# The Fern Store 🌿

A modern e-commerce website for affordable fashion (₦2k - ₦5k) built with React, Firebase, and Tailwind CSS.

## Features

✨ **Modern UI** - Built with React and Tailwind CSS
🔐 **Secure Authentication** - Firebase Auth for admin login
🛒 **Product Management** - Add, view, and delete products
📸 **Image Upload** - Firebase Storage for product images
📱 **WhatsApp Integration** - Direct messaging for purchases
⚡ **Real-time Updates** - Firestore for live product data
🎬 **Smooth Animations** - Framer Motion for better UX

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/toluwanimi-07/The-fern-web.git
   cd The-fern-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then add your Firebase credentials to `.env.local`

4. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Get your credentials from Project Settings
3. Add them to `.env.local`
4. Create a Firestore collection called `products`
5. Set up Email/Password authentication
6. Enable Firebase Storage

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

### Netlify

1. Connect GitHub
2. Add environment variables
3. Deploy!

## WhatsApp Integration

Update the WhatsApp number in `src/App.jsx` to your business number.

## Security Notes

🔒 Never commit `.env.local` - it's in `.gitignore`
🔒 Use environment variables for all secrets
🔒 Rotate Firebase keys if exposed

## Support

Need help? Create an issue on GitHub or contact via WhatsApp: https://wa.me/2349167046215

---

Made with ❤️ by Toluwanimi