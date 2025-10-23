// Provider Information
export interface ProviderInfo {
  canWithdraw: boolean;          // Whether provider can withdraw (no active lock)
  chain: string;                 // Blockchain network ("base")
  currentBalance: number;        // Current available balance
  daysUntilWithdrawal: number;   // Days remaining until withdrawal allowed (0 if can withdraw)
  deposits: Deposit[];           // Array of deposit records
  isProvider: boolean;           // Whether user is a registered provider
  token: string;                 // Token type ("USDC")
  totalDeposited: number;        // Lifetime total deposited
  totalEarnings: number;         // Lifetime total earnings
  totalWithdrawn: number;        // Lifetime total withdrawn
  withdrawals: Withdrawal[];     // Array of withdrawal records
}

// Deposit record (nested in ProviderInfo)
export interface Deposit {
  id: string;
  amount: number;
  timestamp: string;
  txHash: string;
  status: string;
}

// Withdrawal record (nested in ProviderInfo)
export interface Withdrawal {
  id: string;
  amount: number;
  timestamp: string;
  txHash: string;
  status: string;
  destinationAddress: string;
}

// Deposit Instructions
export interface DepositInstructions {
  depositAddress: string;        // Using camelCase to match API
  chain: string;                  // "base" for Base network
  token: string;                  // "USDC"
  minimumDeposit: number;         // Minimum deposit amount (100)
  lockPeriodDays: number;         // Lock period in days (7)
  instructions: string[];         // Array of instruction strings
  note: string;                   // Additional note about deposit process
}

// Transaction
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  tx_hash?: string;
  description: string;
}

// Pool Statistics
export interface PoolStats {
  totalLiquidity: number;           // Total USDC in the pool (camelCase)
  totalProviders: number;            // Number of liquidity providers
  totalDeposited: number;            // Total amount deposited
  totalWithdrawn: number;            // Total amount withdrawn
  averageProviderBalance: number;    // Average balance per provider
  lockPeriodDays: number;            // Lock period in days
}

// Withdrawal Request
export interface WithdrawalRequest {
  amount: number;
  destination_address: string;
  confirm: boolean;
}

// Deposit Confirmation (auto-detects from BlockRadar)
export interface DepositConfirmation {
  chain: string;      // "base"
  token: string;      // "USDC"
}

// Earnings Data
export interface EarningsData {
  daily_earnings: DailyEarning[];
  total_earnings: number;
  projected_annual: number;
  average_daily: number;
}

export interface DailyEarning {
  date: string;
  amount: number;
  apy: number;
}

// Notification
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action_url?: string;
}

// User Settings
export interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  transaction_alerts: boolean;
  weekly_summary: boolean;
  two_factor_enabled: boolean;
  preferred_currency: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  ok: boolean;              // Using 'ok' to match actual API
  success?: boolean;        // Keep for backwards compatibility
  data: T;
  message?: string;
  error?: string;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

