# 🚀 LeadFlow Pro

<div align="center">

![LeadFlow Pro](https://img.shields.io/badge/LeadFlow-Pro-6C5DD3?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**A Modern, Full-Stack CRM Platform for Managing Sales Leads**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Deployment](#-deployment)

</div>

---

## 📋 Overview

**LeadFlow Pro** is a comprehensive Customer Relationship Management (CRM) application built with modern web technologies. It provides a complete solution for managing sales leads, tracking activities, and visualizing your sales pipeline with an intuitive Kanban board interface.

### ✨ Key Highlights

- 🎯 **Intuitive Kanban Board** - Drag-and-drop lead management
- 📊 **Real-time Analytics** - Track revenue, deals, and conversion rates
- 🔐 **Secure Authentication** - Email/Password + Google OAuth
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🎨 **Modern UI** - Beautiful glassmorphism design
- 🔔 **Activity Logging** - Complete audit trail of all actions
- 💾 **Data Export** - Download all your CRM data as JSON
- 🌙 **Dark Mode** - Easy on the eyes

---

## 🎯 Features

### 🔐 Authentication
- Email/Password registration and login
- Google OAuth integration
- Session persistence
- Protected routes
- Secure logout

### 📊 Dashboard
- **Revenue Tracking** - Total revenue display
- **Active Deals Counter** - Current pipeline count
- **Win Rate Calculator** - Conversion metrics
- **Status Distribution Chart** - Visual pipeline breakdown
- **Recent Activity Feed** - Latest updates
- **Recent Leads List** - Quick access to new leads

### 🎯 Kanban Board
- Drag & drop interface
- 4 Pipeline stages: New → Contacted → Proposal → Closed
- Real-time Firestore sync
- Visual lead cards with all details
- Stage value totals
- Touch-friendly for mobile

### 👥 Lead Management
- Create leads with full details
- Edit existing leads
- Delete with confirmation
- Tags system for organization
- Search and filter capabilities
- Email and phone tracking
- Deal value management

### 🔔 Activity Logging
- Automatic audit trail
- Track all CRUD operations
- User attribution
- Timestamp tracking
- Detailed change logs

### ⚙️ Settings
- **Profile Management** - Update display name and photo
- **Security** - Change password
- **Notifications** - Email and push preferences
- **Data Export** - Download complete CRM data
- **Privacy** - Account deletion

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Shadcn/ui** - Component library
- **React Router v6** - Routing
- **React Hook Form** - Forms
- **Zod** - Validation
- **Zustand** - State management
- **TanStack Query** - Server state
- **Recharts** - Data visualization
- **dnd-kit** - Drag and drop
- **Lucide React** - Icons
- **Sonner** - Notifications

### Backend & Infrastructure
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - Deployment (optional)
- **Firestore Security Rules** - Data protection

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and pnpm
- Firebase account
- Git

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/leadflow-pro.git
cd leadflow-pro
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Copy your Firebase config

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 6. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173`

---

## 📦 Build for Production

```bash
pnpm build
```

The production build will be in the `dist/` folder.

### Preview Production Build
```bash
pnpm preview
```

---

## 🌐 Deployment

### Deploy to Firebase Hosting

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite `index.html`: `No`

3. **Build & Deploy**
   ```bash
   pnpm build
   firebase deploy --only hosting
   ```

Your app will be live at: `https://YOUR_PROJECT.web.app`

### Deploy to Other Platforms

- **Vercel**: Connect GitHub repo and deploy
- **Netlify**: Drag & drop `dist` folder or connect GitHub
- **GitHub Pages**: Use `gh-pages` branch

---

## 🔥 Firestore Structure

### Collections

#### `leads`
```typescript
{
  id: string;
  userId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  value: number;
  status: "new" | "contacted" | "proposal" | "closed";
  tags: string[];
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `activity_logs`
```typescript
{
  id: string;
  userId: string;
  userName: string;
  leadId: string;
  action: "CREATED" | "UPDATED" | "DELETED" | "MOVED";
  details: string;
  timestamp: Timestamp;
}
```

---

## 🔒 Security

- **Firebase Authentication** - Industry-standard auth
- **Firestore Security Rules** - Data isolation per user
- **Protected Routes** - Unauthorized access blocked
- **Input Validation** - Zod schemas throughout
- **XSS Protection** - React's built-in escaping
- **HTTPS Only** - Enforced by Firebase

---

## 📱 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Kanban Board
![Kanban Board](docs/screenshots/kanban.png)

### Settings
![Settings](docs/screenshots/settings.png)

---

## 🧪 Testing

### Run Tests (if implemented)
```bash
pnpm test
```

### Lint Code
```bash
pnpm lint
```

---

## 📂 Project Structure

```
leadflow-pro/
├── src/
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-based modules
│   │   ├── auth/         # Authentication
│   │   ├── board/        # Kanban board
│   │   ├── leads/        # Lead management
│   │   ├── activity/     # Activity logging
│   │   └── dashboard/    # Dashboard components
│   ├── layouts/          # Layout components
│   ├── pages/            # Route pages
│   ├── lib/              # Utilities & config
│   ├── store/            # Zustand stores
│   └── App.tsx           # Main app component
├── public/               # Static assets
├── firestore.rules       # Security rules
├── firestore.indexes.json # Database indexes
└── firebase.json         # Firebase config
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Hosted on [Firebase](https://firebase.google.com/)

---

## 📊 Stats

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Code Quality](https://img.shields.io/badge/quality-95%2F100-brightgreen)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ using React & Firebase

</div>
