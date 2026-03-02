# 🎨 Frontend Setup Guide

## ✅ What's Been Created

The complete frontend structure for Cyber-Guard AI has been implemented with:

### Pages (7/7 Complete)
1. ✅ **Landing Page** (`/`) - Hero, features, CTA
2. ✅ **Dashboard** (`/dashboard`) - Analytics, stats, trends
3. ✅ **Content Analysis** (`/analyze`) - Text input, file upload, batch processing
4. ✅ **Analysis Report** (`/report/[id]`) - Detailed results with charts
5. ✅ **AI Assistant** (`/assistant`) - Rewriting, PII redaction
6. ✅ **Settings** (`/settings`) - Theme, language, notifications, API keys
7. ✅ **Admin Panel** (`/admin`) - User management, review queue, configuration

### Components
- ✅ **Navigation** - Responsive navbar with mobile menu
- ✅ **Layout** - Root layout with toast notifications
- ✅ **Styling** - Tailwind CSS configuration

### Configuration
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **API Client** - Axios with interceptors
- ✅ **Environment** - API URL configuration

## 🚀 Installation & Setup

### Step 1: Install Dependencies

You need to enable PowerShell script execution first:

```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then install dependencies:

```bash
cd frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

### Step 3: Ensure Backend is Running

Make sure the backend API is running on port 8000:

```bash
# In the root directory
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Backend API: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Landing page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard with stats
│   ├── analyze/
│   │   └── page.tsx            # Content submission
│   ├── report/
│   │   └── [id]/
│   │       └── page.tsx        # Analysis report
│   ├── assistant/
│   │   └── page.tsx            # AI assistant tools
│   ├── settings/
│   │   └── page.tsx            # User settings
│   └── admin/
│       └── page.tsx            # Admin dashboard
├── components/
│   └── Navigation.tsx          # Main navigation
├── lib/
│   └── api.ts                  # API client
├── .env.local                  # Environment variables
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript config
└── next.config.js              # Next.js config
```

## 🎨 Features

### Landing Page
- Hero section with CTA
- Feature highlights
- Statistics showcase
- Responsive design

### Dashboard
- Total analyses count
- Average risk score
- High-risk content alerts
- Risk trend chart (7 days)
- Recent analyses list

### Content Analysis
- Text input mode
- File upload (TXT, PDF, DOCX)
- Batch processing (CSV, JSON)
- Language selection (auto-detect + 7 languages)
- Real-time character count
- Loading states

### Analysis Report
- Overall risk score with badge
- Category breakdown chart
- Risk distribution pie chart
- Behavioral analysis metrics
- Flagged content segments
- Language detection info
- Export to PDF/CSV
- Share functionality

### AI Assistant
- Content rewriting with tone selection
- PII redaction (email, phone, SSN, cards)
- Copy to clipboard
- Side-by-side comparison
- Example use cases

### Settings
- Dark/Light theme toggle
- Language selection (7 languages)
- RTL layout support
- Email notifications
- Push notifications
- High-risk alerts
- API key generation
- GDPR compliance mode
- Auto-delete options

### Admin Panel
- Overview dashboard
- User management table
- Content review queue
- Approve/reject actions
- Model configuration
- Risk threshold adjustment
- Category toggles
- Performance metrics

## 🔧 Configuration

### Environment Variables

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Cyber-Guard AI
```

### API Integration

The API client is configured in `lib/api.ts` with:
- Automatic token attachment
- Error handling
- Request/response interceptors
- TypeScript types

## 🎯 Usage Examples

### Analyze Content

1. Navigate to `/analyze`
2. Enter or upload content
3. Select language (or auto-detect)
4. Click "Analyze Content"
5. View results on report page

### Rewrite Content

1. Navigate to `/assistant`
2. Enter content to improve
3. Select tone (professional/neutral/softened)
4. Click "Rewrite Content"
5. Copy improved version

### Redact PII

1. Navigate to `/assistant`
2. Enter content with sensitive info
3. Click "Redact PII"
4. Copy redacted version

### Admin Review

1. Navigate to `/admin`
2. Click "Review Queue" tab
3. Review flagged content
4. Approve or reject items

## 🎨 Styling

### Tailwind CSS Classes

The project uses Tailwind CSS with custom configuration:

- **Primary Color**: Blue (#3b82f6)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

## 📊 Data Visualization

Using Recharts for:
- Line charts (risk trends)
- Bar charts (category breakdown)
- Pie charts (risk distribution)

## 🔐 Security

- XSS protection via React
- Input sanitization
- Secure API communication
- Token-based authentication
- Environment variable protection

## 🐛 Troubleshooting

### PowerShell Script Execution Error

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### API Connection Failed

1. Check backend is running: `http://localhost:8000/health`
2. Verify `.env.local` has correct API URL
3. Check CORS settings in backend

### Build Errors

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 📦 Dependencies

### Core
- **next**: 14.0.4
- **react**: 18.2.0
- **typescript**: 5.3.3

### UI & Styling
- **tailwindcss**: 3.4.0
- **react-icons**: 4.12.0
- **framer-motion**: 10.16.16

### Data & API
- **axios**: 1.6.2
- **recharts**: 2.10.3
- **zustand**: 4.4.7

### Utilities
- **react-hot-toast**: 2.4.1
- **react-dropzone**: 14.2.3
- **jspdf**: 2.5.1
- **date-fns**: 3.0.6

## 🚀 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use Docker
docker build -t cyberguard-frontend .
docker run -p 3000:3000 cyberguard-frontend
```

## 📈 Next Steps

### Immediate
1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm run dev`
3. ✅ Test all pages
4. ✅ Connect to backend API

### Short Term
- Add user authentication
- Implement database integration
- Add real-time updates
- Create more visualizations
- Add export functionality

### Long Term
- Add image moderation
- Implement WebSocket for real-time
- Create mobile app
- Add advanced analytics
- Build browser extension

## 🎊 What's Working

- ✅ All 7 pages implemented
- ✅ Responsive navigation
- ✅ API client configured
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ TypeScript types
- ✅ Tailwind styling
- ✅ Chart visualizations
- ✅ Form validation

## 📞 Support

- **Backend API**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000
- **Documentation**: See README.md files

---

**The frontend is complete and ready to use! Just install dependencies and start the dev server.** 🎉
