# NewsAnalytics Dashboard

A comprehensive news analytics and payout management platform built with Next.js 14, featuring real-time news aggregation, advanced analytics, and automated payout calculations.

![NewsAnalytics Dashboard](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## ✨ Features

### 🏠 Dashboard Overview
- **Real-time Statistics** - Live metrics for articles, payouts, and engagement
- **Interactive Charts** - Beautiful visualizations using Recharts
- **Quick Actions** - One-click access to common tasks
- **Recent News Feed** - Latest headlines and trending topics

### 📰 News Management
- **Multi-source Integration** - GNews API with fallback support
- **Advanced Filtering** - Search by keywords, sources, categories, and dates
- **Smart Categorization** - Automatic article categorization and tagging
- **Offline Support** - IndexedDB caching for offline access

### 📊 Analytics & Reporting
- **Source Analytics** - Performance metrics by news source
- **Author Insights** - Writer productivity and engagement stats
- **Timeline Analysis** - Historical trends and patterns
- **Export Capabilities** - PDF, CSV, and Google Sheets integration

### 💰 Payout Management (Admin)
- **Flexible Rate System** - Customizable payout rates per source/author
- **Automated Calculations** - Real-time payout computations
- **Comprehensive Reports** - Detailed earnings breakdowns
- **Export Options** - Multiple format support for financial reports

### 🎨 Modern UI/UX
- **Glass Morphism Design** - Modern, translucent interface elements
- **Dark/Light Theme** - Seamless theme switching with system preference
- **Responsive Layout** - Mobile-first design that works on all devices
- **Smooth Animations** - Polished transitions and micro-interactions

### 🔐 Authentication & Security
- **Multi-provider Auth** - Email, Google, and GitHub OAuth support
- **Role-based Access** - Admin and user permission levels
- **Session Management** - Secure token-based authentication
- **Profile Management** - User settings and preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GNews API key (free tier available)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/newsanalytics-dashboard.git
cd newsanalytics-dashboard
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Environment Setup**
Create a `.env.local` file in the root directory:
\`\`\`env
# GNews API Configuration
GNEWS_API_KEY=your_gnews_api_key_here

# Authentication (Optional - for production)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Accounts

For testing purposes, use these demo credentials:

- **Admin Account**: `admin@example.com` (any password)
- **User Account**: `user@example.com` (any password)

## 📁 Project Structure

```bash
newsanalytics-dashboard/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components
│   ├── ui/               # Reusable UI components
│   └── providers.tsx     # Context providers
├── contexts/             # React Context providers
│   ├── auth-context.tsx  # Authentication state
│   ├── news-context.tsx  # News data management
│   ├── payout-context.tsx # Payout calculations
│   └── offline-context.tsx # Offline functionality
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   ├── storage.ts       # IndexedDB utilities
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icons

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **GNews API** - News data aggregation
- **IndexedDB** - Client-side storage
- **NextAuth.js** - Authentication (optional)

### State Management
- **React Context** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Persistent client state

## 🔧 Configuration

### API Rate Limiting
The application includes intelligent rate limiting for the GNews API:
- Daily limit: 90 requests (buffer from 100 limit)
- Automatic caching with 1-hour expiration
- Fallback to cached data when limits are reached

### Offline Support
- Automatic data caching using IndexedDB
- Seamless offline/online detection
- Background sync when connection is restored

### Theme Configuration
Customize the theme in `app/globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* Add your custom colors */
}
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

### News
- `GET /api/news/search` - Search articles with filters
- `GET /api/news/headlines` - Get top headlines

### Export
- `POST /api/export` - Export data in various formats

## 🎯 Usage Examples

### Searching News
```typescript
// Search for technology articles from the last week
const filters = {
  query: "technology",
  fromDate: "2024-01-01",
  toDate: "2024-01-07",
  sortBy: "relevance"
}
await searchArticles(filters)
```

### Calculating Payouts
```typescript
// Calculate payouts for articles
const payoutData = calculatePayouts(articles)
const totalEarnings = payoutData.reduce((sum, p) => sum + p.total, 0)
```

### Exporting Data
\`\`\`typescript
// Export payout report as CSV
await exportData({
  format: "csv",
  data: payoutData,
  includeCharts: true
})
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/newsanalytics-dashboard/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/newsanalytics-dashboard/discussions)

## 🙏 Acknowledgments

- [GNews API](https://gnews.io/) for news data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization

## 📈 Roadmap

- [ ] Real-time notifications
- [ ] Advanced AI-powered content analysis
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced user management
- [ ] Custom dashboard widgets
- [ ] Integration with more news APIs
- [ ] Advanced reporting features

---

<div align="center">
  <p>Built with ❤️ using Next.js and TypeScript</p>
  <p>
    <a href="#top">Back to top</a>
  </p>
</div>
```

