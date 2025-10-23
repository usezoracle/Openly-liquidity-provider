# StablePay Liquidity Provider Dashboard

A modern, full-featured Next.js dashboard for liquidity providers to manage USDC deposits, track earnings, and monitor pool statistics on the StablePay platform.

## 🎯 Features

### Phase 1: MVP (Core Features)
- ✅ **Authentication** - Secure sign-in/sign-up with Clerk
- ✅ **Portfolio Overview** - Real-time balance, earnings, and stats
- ✅ **Deposit Flow** - Unique deposit addresses with QR codes
- ✅ **Withdrawal System** - Secure withdrawals with 7-day lock period
- ✅ **Transaction History** - Complete audit trail with CSV export
- ✅ **Pool Statistics** - Public metrics and health indicators

### Phase 2: Enhanced Features
- ✅ **Earnings Analytics** - Detailed performance tracking and projections
- ✅ **Notifications Center** - Real-time updates and alerts
- ✅ **Settings & Preferences** - Account management and customization
- ✅ **Responsive Design** - Mobile-optimized layouts

### Phase 3: Advanced Features (Planned)
- 🔄 **VIP Dashboard** - Premium features for high-balance providers
- 🔄 **Referral Program** - Earn rewards for bringing new providers
- 🔄 **Advanced Charts** - Historical performance visualization
- 🔄 **API Access** - Programmatic account management

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **API Client**: Axios + React Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
liquidity-provider/
├── app/
│   ├── (auth)/                    # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/               # Protected dashboard pages
│   │   ├── layout.tsx             # Dashboard layout with sidebar
│   │   ├── page.tsx               # Portfolio overview
│   │   ├── deposit/               # Deposit flow
│   │   ├── withdraw/              # Withdrawal flow
│   │   ├── history/               # Transaction history
│   │   ├── pool-stats/            # Pool statistics
│   │   ├── earnings/              # Earnings analytics
│   │   ├── notifications/         # Notifications center
│   │   └── settings/              # Settings page
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── label.tsx
│   │   ├── switch.tsx
│   │   └── progress.tsx
│   └── dashboard/                 # Dashboard-specific components
│       └── sidebar.tsx
├── lib/
│   ├── api/                       # API client and hooks
│   │   ├── client.ts              # Axios instance
│   │   ├── hooks.ts               # React Query hooks
│   │   └── providers.tsx          # React Query provider
│   ├── utils/                     # Utility functions
│   │   ├── utils.ts               # Helper functions
│   │   └── format.ts              # Formatting utilities
│   └── types/                     # TypeScript types
│       └── index.ts
├── middleware.ts                  # Clerk middleware
└── tailwind.config.ts             # Tailwind configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clerk account ([clerk.com](https://clerk.com))
- Access to StablePay API

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd liquidity-provider
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already set up in `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.goopenly.xyz/api/v1

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy1iZWV0bGUtNjEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_o15bPONE4M6pM46TwS2ZMTk2JeaUVoV7b9YBK57mPZ
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

This application uses [Clerk](https://clerk.com) for authentication. Key features:

- Email/password authentication
- Social login (Google, GitHub, etc.)
- Email verification
- Session management
- Protected routes with middleware

## 📡 API Integration

### Endpoints

The dashboard integrates with the following StablePay API endpoints:

#### Protected Endpoints (Require Authentication)

- `GET /protected/liquidity/my-info` - Get provider information
- `GET /protected/liquidity/deposit-instructions` - Get unique deposit address
- `POST /protected/liquidity/confirm-deposit` - Confirm a deposit
- `POST /protected/liquidity/withdraw` - Request a withdrawal
- `GET /protected/liquidity/transactions` - Get transaction history
- `GET /protected/liquidity/earnings` - Get earnings data
- `GET /protected/liquidity/notifications` - Get notifications
- `GET /protected/liquidity/settings` - Get user settings
- `PUT /protected/liquidity/settings` - Update user settings

#### Public Endpoints

- `GET /public/liquidity/stats` - Get pool statistics

### API Hooks

The application uses React Query hooks for data fetching:

```typescript
import { useProviderInfo, usePoolStats, useDepositInstructions } from '@/lib/api/hooks';

function Component() {
  const { data, isLoading, error } = useProviderInfo();
  const { data: stats } = usePoolStats();
  const { data: instructions } = useDepositInstructions();
  
  // ...
}
```

## 🎨 Design System

### Colors

The dashboard uses a carefully crafted color palette:

- **Primary**: Purple/Blue (`#8b5cf6`, `#7c3aed`, `#6d28d9`)
- **Secondary**: Green (`#10b981`, `#059669`)
- **Accent**: Orange (`#f97316`)
- **Success**: Green (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 32px - 20px
- **Body**: Regular, 16px
- **Small**: 14px
- **Caption**: 12px

## 🔒 Security

### Best Practices

- ✅ JWT token validation via Clerk
- ✅ Protected routes with middleware
- ✅ Input validation with Zod
- ✅ HTTPS-only in production
- ✅ Secure environment variables

### Ethereum Address Validation

All withdrawal addresses are validated using:

```typescript
function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
```

## 📊 Key Features Explained

### Deposit Flow

1. User gets unique BlockRadar address with QR code
2. User sends USDC to address via MetaMask
3. User confirms deposit via dashboard
4. System detects deposit and credits account
5. Funds auto-sweep to master pool

### Withdrawal Flow

1. System checks 7-day lock period
2. User enters amount and destination address
3. User confirms withdrawal details
4. System processes withdrawal from master pool
5. User receives USDC within 24 hours

### Lock Period

- **Duration**: 7 days from last deposit
- **Purpose**: Prevents gaming, ensures stable liquidity
- **Resets**: With each new deposit
- **After Expiry**: Withdraw anytime, any amount

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Mobile features:
- Collapsible sidebar
- Touch-optimized buttons
- Responsive tables and charts

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
```

### Environment Variables

Ensure these are set in production:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## 📖 Documentation

### Component Documentation

Each component includes JSDoc comments for clarity and maintainability.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Keep files under 500 lines
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
- [React Query](https://tanstack.com/query) - Data fetching
- [Recharts](https://recharts.org/) - Charts

## 📞 Support

- **Email**: support@goopenly.xyz
- **Documentation**: https://docs.goopenly.xyz
- **Discord**: https://discord.gg/goopenly
- **Twitter**: @GoOpenly

## 🗺️ Roadmap

- [x] Phase 1: MVP (Core Features)
- [x] Phase 2: Enhanced Features
- [ ] Phase 3: Advanced Features
  - [ ] VIP Dashboard
  - [ ] Referral Program
  - [ ] Mobile App (React Native)
  - [ ] API Access
  - [ ] Advanced Analytics

---

**Built with ❤️ by the StablePay Team**

Last updated: October 23, 2025
