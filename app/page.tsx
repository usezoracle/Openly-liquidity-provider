import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Wallet, 
  Zap,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600" />
              <span className="text-xl font-bold text-gray-900">StablePay</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
            Earn Competitive Returns on
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {' '}Your USDC
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Join the StablePay liquidity pool and start earning passive income on your stablecoin holdings.
            Simple, secure, and transparent.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Start Earning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/pool-stats">
              <Button size="lg" variant="outline">
                View Pool Stats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose StablePay?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to manage and grow your liquidity
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Competitive APY
              </h3>
              <p className="text-gray-600">
                Earn industry-leading returns on your USDC deposits with our optimized liquidity pool.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Transparent
              </h3>
              <p className="text-gray-600">
                Your funds are protected with enterprise-grade security and full blockchain transparency.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Deposits
              </h3>
              <p className="text-gray-600">
                Start earning immediately with quick deposits and real-time balance updates.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-3">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Withdrawals
              </h3>
              <p className="text-gray-600">
                Withdraw your funds anytime after the 7-day lock period with zero hassle.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Detailed Analytics
              </h3>
              <p className="text-gray-600">
                Track your earnings and performance with comprehensive analytics and reporting.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Hidden Fees
              </h3>
              <p className="text-gray-600">
                What you see is what you get. No surprise fees, no complicated terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your account in minutes with secure email authentication',
              },
              {
                step: '2',
                title: 'Deposit USDC',
                description: 'Send USDC to your unique deposit address via MetaMask',
              },
              {
                step: '3',
                title: 'Start Earning',
                description: 'Your funds join the pool and start earning immediately',
              },
              {
                step: '4',
                title: 'Track & Withdraw',
                description: 'Monitor your earnings and withdraw anytime after the lock period',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0">
          <CardContent className="py-16 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Earning?
            </h2>
            <p className="mt-4 text-lg text-purple-100">
              Join hundreds of liquidity providers already earning with StablePay
            </p>
            <div className="mt-8">
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600" />
                <span className="text-xl font-bold text-gray-900">StablePay</span>
              </div>
              <p className="text-gray-600 text-sm">
                A modern liquidity provider dashboard for earning competitive returns on USDC deposits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/dashboard/pool-stats">Pool Stats</Link></li>
                <li><Link href="/sign-up">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="mailto:support@goopenly.xyz">Contact</a></li>
                <li><a href="https://docs.goopenly.xyz" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                <li><a href="https://discord.gg/goopenly" target="_blank" rel="noopener noreferrer">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2025 StablePay. Built with ❤️ by the StablePay Team</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
