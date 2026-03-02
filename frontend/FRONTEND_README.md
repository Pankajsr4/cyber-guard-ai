# Cyber-Guard AI - Frontend

Modern Next.js frontend for the Cyber-Guard AI Moderation Engine.

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # User dashboard
│   ├── analyze/           # Content submission
│   ├── report/            # Analysis reports
│   ├── settings/          # User settings
│   └── admin/             # Admin panel
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   ├── charts/           # Data visualization
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   ├── utils.ts          # Helper functions
│   └── store.ts          # State management
├── styles/               # Global styles
└── public/               # Static assets
```

## 🎨 Features Implemented

### Core Pages
- ✅ Landing Page - Hero, features, CTA
- ✅ Dashboard - Analytics, history, trends
- ✅ Content Submission - Text, file upload, batch
- ✅ Analysis Report - Detailed results, visualizations
- ✅ AI Assistant - Rewriting, PII redaction
- ✅ Settings - Theme, preferences, API keys
- ✅ Admin Panel - User management, review queue

### Components
- ✅ Risk Score Display - Visual risk indicators
- ✅ Category Breakdown - Chart visualization
- ✅ Highlighted Text - Inline problem areas
- ✅ Behavioral Analysis - Sentiment, emotions
- ✅ Language Detector - Auto-detection display
- ✅ Export Tools - PDF, CSV generation
- ✅ Theme Toggle - Dark/Light mode
- ✅ Loading States - Smooth transitions

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Cyber-Guard AI
```

### API Integration

The frontend connects to the FastAPI backend running on port 8000.

```typescript
import { moderationAPI } from '@/lib/api';

// Analyze content
const result = await moderationAPI.analyze({
  content: "Your text here",
  language: "en"
});
```

## 🎨 Theming

### Dark/Light Mode

Automatic theme detection with manual toggle:

```typescript
import { useTheme } from '@/lib/theme';

const { theme, toggleTheme } = useTheme();
```

### Color Scheme

- **Primary**: Cyber Blue (#0ea5e9)
- **Danger**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)
- **Success**: Green (#22c55e)

## 📊 Data Visualization

Using Recharts for:
- Risk trend charts
- Category distribution
- Timeline graphs
- Heatmaps

## 🔐 Authentication

JWT-based authentication with role support:

```typescript
// Login
const { token, user } = await authAPI.login(email, password);

// Store token
localStorage.setItem('token', token);

// Auto-attached to requests via interceptor
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized for all screen sizes

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- ARIA labels

## 🌍 Internationalization

- RTL language support
- 15+ UI languages
- Automatic language detection
- Localized date/time formats

## 🚀 Performance

- Code splitting
- Image optimization
- Lazy loading
- Caching strategies
- Bundle size optimization

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t cyberguard-frontend .
docker run -p 3000:3000 cyberguard-frontend
```

## 🧪 Testing

```bash
# Run tests
npm test

# Coverage
npm run test:coverage
```

## 📚 Key Dependencies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts
- **Axios** - HTTP client
- **Zustand** - State management
- **React Icons** - Icon library

## 🎯 User Flows

### Content Analysis Flow
1. User submits content
2. Loading state with progress
3. Results displayed with visualizations
4. Export or rewrite options
5. Save to history

### Admin Review Flow
1. View flagged content queue
2. Review AI decision
3. Override if needed
4. Provide feedback
5. Update model training

## 🔒 Security

- XSS protection
- CSRF tokens
- Secure headers
- Input sanitization
- Rate limiting
- Content Security Policy

## 📈 Analytics

Track:
- Page views
- Analysis requests
- User engagement
- Error rates
- Performance metrics

## 🐛 Troubleshooting

### API Connection Issues
```bash
# Check backend is running
curl http://localhost:8000/health

# Verify CORS settings
# Check .env.local configuration
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

See LICENSE file in root directory

## 🆘 Support

- Documentation: /docs
- API Reference: /api-docs
- Issues: GitHub Issues
- Email: support@cyberguard.ai

---

**Built with ❤️ for safer digital communities**
