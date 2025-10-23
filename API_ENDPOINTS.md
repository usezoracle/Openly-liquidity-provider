# StablePay Liquidity Provider API Endpoints Documentation

**Base URL:** `https://api.goopenly.xyz/api/v1`

**Last Updated:** October 23, 2025

---

## Table of Contents
- [Authentication](#authentication)
- [API Conventions](#api-conventions)
- [Public Endpoints](#public-endpoints)
- [Protected Endpoints](#protected-endpoints)
  - [Provider Management](#provider-management)
  - [Transactions](#transactions)
  - [Deposits & Withdrawals](#deposits--withdrawals)
  - [Notifications](#notifications)
  - [Settings](#settings)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### Authentication Method
All protected endpoints require **Bearer Token** authentication via Clerk.

**Header Format:**
```
Authorization: Bearer <clerk_jwt_token>
```

### Token Retrieval
Tokens are obtained through Clerk's `getToken()` method in the frontend application.

**Token Lifecycle:**
- Tokens are valid for a limited time
- Frontend automatically refreshes tokens
- 401 status triggers re-authentication

---

## API Conventions

### Naming Convention
The API uses **camelCase** for all field names consistently:

**Correct:**
- `depositAddress` ✅
- `totalLiquidity` ✅
- `minimumDeposit` ✅
- `lockPeriodDays` ✅

**Not used:**
- `deposit_address` ❌ (snake_case)
- `DepositAddress` ❌ (PascalCase)
- `DEPOSIT_ADDRESS` ❌ (UPPER_CASE)

### Response Wrapper
All responses use `ok` as the success indicator:
```typescript
{
  ok: boolean,      // true for success, false for error
  message: string,  // Human-readable message
  data?: T          // Response data (omitted on error)
}
```

### Date/Time Format
All timestamps use **ISO 8601** format:
- `2025-10-23T10:30:00Z` ✅
- `2025-10-23T10:30:00.000Z` ✅ (with milliseconds)

### Number Formats
- **Currency amounts:** Decimal numbers (e.g., `1000.50`)
- **Percentages:** Decimal numbers, not multiplied by 100 (e.g., `8.5` for 8.5%)
- **Days:** Integers (e.g., `7` for 7 days)

### Blockchain Addresses
All Ethereum addresses:
- Must start with `0x`
- Must be 42 characters long (0x + 40 hex characters)
- Case-insensitive but API returns checksummed addresses

---

## Public Endpoints

### 1. Get Pool Statistics

**Endpoint:** `GET /public/liquidity/stats`

**Description:** Retrieves public statistics about the liquidity pool, including total liquidity, number of providers, and pool utilization metrics. This endpoint does not require authentication and is useful for displaying public pool information on landing pages.

**Authentication:** ❌ Not Required

**Query Parameters:** None

**Response:**
```typescript
{
  ok: boolean,
  message: string,
  data: {
    totalLiquidity: number,          // Total USDC in the pool (camelCase)
    totalProviders: number,          // Number of liquidity providers
    totalDeposited: number,          // Total amount deposited
    totalWithdrawn: number,          // Total amount withdrawn
    averageProviderBalance: number,  // Average balance per provider
    lockPeriodDays: number           // Lock period in days
  }
}
```

**Example Response:**
```json
{
  "ok": true,
  "message": "Pool statistics retrieved successfully",
  "data": {
    "totalLiquidity": 5000000.50,
    "totalProviders": 248,
    "totalDeposited": 6500000.00,
    "totalWithdrawn": 1500000.00,
    "averageProviderBalance": 20161.29,
    "lockPeriodDays": 7
  }
}
```

**Use Cases:**
- Display pool health on dashboard
- Show public statistics on landing page
- Calculate user's pool share percentage (user balance / totalLiquidity)
- Display average provider balance
- Show total pool metrics (deposits, withdrawals, liquidity)
- Display lock period information

**Cache Duration:** 60 seconds

**Notes:**
- This is the only public endpoint
- Does not expose user-specific information
- Updated every minute with latest pool metrics
- Uses **camelCase** for all field names (totalLiquidity, totalProviders, etc.)
- `averageProviderBalance` = totalLiquidity / totalProviders
- `totalLiquidity` = totalDeposited - totalWithdrawn

---

## Protected Endpoints

All protected endpoints require Bearer token authentication.

---

## Provider Management

### 2. Get Provider Information

**Endpoint:** `GET /protected/liquidity/my-info`

**Description:** Retrieves comprehensive information about the authenticated liquidity provider, including their current balance, total deposits, withdrawals, earnings, APY, and lock status. This is the primary endpoint for displaying user-specific portfolio information.

**Authentication:** ✅ Required

**Query Parameters:** None

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    provider_id: string,             // Unique provider identifier
    email: string,                   // Provider's email address
    balance: number,                 // Current available balance (USDC)
    total_deposited: number,         // Lifetime total deposits
    total_withdrawn: number,         // Lifetime total withdrawals
    total_earnings: number,          // Lifetime total earnings
    apy: number,                     // Current APY rate (%)
    lock_until: string | null,       // ISO 8601 date when funds unlock (null if not locked)
    created_at: string,              // ISO 8601 date when account was created
    last_activity: string            // ISO 8601 date of last transaction
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Provider information retrieved successfully",
  "data": {
    "provider_id": "prov_abc123xyz",
    "email": "user@example.com",
    "balance": 10000.50,
    "total_deposited": 15000.00,
    "total_withdrawn": 2000.00,
    "total_earnings": 1500.75,
    "apy": 8.5,
    "lock_until": "2025-10-30T14:30:00Z",
    "created_at": "2025-01-15T10:00:00Z",
    "last_activity": "2025-10-23T12:45:30Z"
  }
}
```

**Use Cases:**
- Display user portfolio overview
- Show current balance and APY
- Display withdrawal lock status
- Calculate net profit (total_earnings - total_withdrawn)
- Show account age and activity

**Cache Duration:** 30 seconds

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token
- `404 Not Found`: Provider not found (new user)

**Notes:**
- `lock_until` is `null` if no active lock period
- Lock period is 7 days from last deposit
- APY is calculated dynamically based on pool performance
- Balance excludes locked funds during withdrawal period

---

### 3. Get Deposit Instructions

**Endpoint:** `GET /protected/liquidity/deposit-instructions`

**Description:** Generates or retrieves the provider's unique deposit address and instructions for depositing USDC into the liquidity pool. Each provider gets a unique deposit address that is monitored by the system for incoming transactions.

**Authentication:** ✅ Required

**Query Parameters:** None

**Response:**
```typescript
{
  ok: boolean,
  message: string,
  data: {
    depositAddress: string,          // Unique deposit address (camelCase)
    chain: string,                   // Blockchain network (e.g., "base", "ethereum")
    token: string,                   // Token type (e.g., "USDC")
    minimumDeposit: number,          // Minimum deposit amount (camelCase)
    lockPeriodDays: number,          // Lock period in days (camelCase)
    instructions: string[],          // Array of deposit instructions
    note: string                     // Additional note about the process
  }
}
```

**Example Response:**
```json
{
  "ok": true,
  "message": "Deposit instructions retrieved successfully",
  "data": {
    "depositAddress": "0xE6Bab00a8f4003C2F5981F8506f3f6544149ce2E",
    "chain": "base",
    "token": "USDC",
    "minimumDeposit": 100,
    "lockPeriodDays": 7,
    "instructions": [
      "1. Send USDC to your unique deposit address: 0xE6Bab00a8f4003C2F5981F8506f3f6544149ce2E",
      "2. Use the BASE network",
      "3. Minimum deposit: $100 USDC",
      "4. After sending, call POST /protected/liquidity/confirm-deposit to register",
      "5. Funds are locked for 7 days from your last deposit",
      "6. Check balance anytime: GET /protected/liquidity/my-info"
    ],
    "note": "Send USDC to your unique deposit address, then call POST /liquidity/confirm-deposit to credit your account"
  }
}
```

**Use Cases:**
- Display unique deposit address to user
- Generate QR code for mobile deposits
- Show deposit instructions and warnings
- Display minimum deposit requirement
- Confirm network and token type

**Cache Duration:** 5 minutes

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token
- `500 Internal Server Error`: Failed to generate deposit address

**Notes:**
- Each provider has one persistent deposit address
- Address is generated on first request  
- Uses **camelCase** for field names (depositAddress, minimumDeposit, lockPeriodDays)
- Frontend generates QR code from `depositAddress` field
- System monitors this address for incoming USDC transactions on Base network
- Deposits trigger automatic sweep to master pool after confirmation
- Base network (Layer 2) used for lower transaction costs

---

## Transactions

### 4. Get Transaction History

**Endpoint:** `GET /protected/liquidity/transactions`

**Description:** Retrieves the complete transaction history for the authenticated provider, including deposits, withdrawals, and earnings. Transactions are sorted by timestamp in descending order (most recent first) and include status information for tracking pending operations.

**Authentication:** ✅ Required

**Query Parameters:**
- `limit` (optional, number): Maximum number of transactions to return (default: 100, max: 500)
- `offset` (optional, number): Number of transactions to skip for pagination (default: 0)
- `type` (optional, string): Filter by transaction type ('deposit' | 'withdrawal' | 'earning')
- `status` (optional, string): Filter by status ('pending' | 'completed' | 'failed')
- `from_date` (optional, string): ISO 8601 date - start of date range
- `to_date` (optional, string): ISO 8601 date - end of date range

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    transactions: Array<{
      id: string,                    // Unique transaction identifier
      type: 'deposit' | 'withdrawal' | 'earning',
      amount: number,                // Transaction amount (USDC)
      status: 'pending' | 'completed' | 'failed',
      timestamp: string,             // ISO 8601 timestamp
      tx_hash: string | null,        // Blockchain transaction hash (null for earnings)
      description: string            // Human-readable description
    }>,
    total_count: number,             // Total transactions available
    has_more: boolean                // Whether more transactions exist
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "tx_001",
        "type": "deposit",
        "amount": 5000.00,
        "status": "completed",
        "timestamp": "2025-10-23T10:30:00Z",
        "tx_hash": "0x1234567890abcdef...",
        "description": "Deposit of 5000 USDC"
      },
      {
        "id": "tx_002",
        "type": "earning",
        "amount": 12.50,
        "status": "completed",
        "timestamp": "2025-10-23T00:00:00Z",
        "tx_hash": null,
        "description": "Daily earnings distribution"
      },
      {
        "id": "tx_003",
        "type": "withdrawal",
        "amount": 1000.00,
        "status": "pending",
        "timestamp": "2025-10-22T15:20:00Z",
        "tx_hash": "0xabcdef1234567890...",
        "description": "Withdrawal to 0x742d...0bEb"
      }
    ],
    "total_count": 245,
    "has_more": true
  }
}
```

**Use Cases:**
- Display transaction history table
- Filter transactions by type or status
- Export transaction history to CSV
- Track pending withdrawals
- View daily earnings distribution
- Audit all account activity

**Cache Duration:** 30 seconds

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token
- `400 Bad Request`: Invalid query parameters

**Notes:**
- Earnings are credited automatically at 00:00 UTC daily
- `tx_hash` is null for earning transactions
- Deposits show blockchain transaction hash
- Withdrawals show destination transaction hash
- Transactions are immutable once completed
- Failed transactions remain in history for audit purposes

---

### 5. Get Earnings Data

**Endpoint:** `GET /protected/liquidity/earnings`

**Description:** Retrieves detailed earnings analytics for the authenticated provider, including daily earnings history, total earnings, projected annual earnings, and average daily earnings. This data is used for charts and performance metrics.

**Authentication:** ✅ Required

**Query Parameters:**
- `days` (optional, number): Number of days of history to return (default: 30, max: 365)
- `from_date` (optional, string): ISO 8601 date - start of date range
- `to_date` (optional, string): ISO 8601 date - end of date range

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    daily_earnings: Array<{
      date: string,                  // ISO 8601 date
      amount: number,                // Earnings for that day (USDC)
      apy: number                    // APY rate on that day (%)
    }>,
    total_earnings: number,          // Lifetime total earnings
    projected_annual: number,        // Projected annual earnings based on current rate
    average_daily: number            // Average daily earnings
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Earnings data retrieved successfully",
  "data": {
    "daily_earnings": [
      {
        "date": "2025-10-23",
        "amount": 12.50,
        "apy": 8.5
      },
      {
        "date": "2025-10-22",
        "amount": 11.80,
        "apy": 8.3
      },
      {
        "date": "2025-10-21",
        "amount": 13.20,
        "apy": 8.7
      }
    ],
    "total_earnings": 1500.75,
    "projected_annual": 4562.50,
    "average_daily": 12.50
  }
}
```

**Use Cases:**
- Display earnings trend chart (AreaChart)
- Show daily earnings performance
- Calculate projected annual earnings
- Display average daily earnings
- Track APY changes over time
- Show earnings performance metrics

**Cache Duration:** 60 seconds

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token
- `400 Bad Request`: Invalid date range

**Notes:**
- Earnings are calculated and distributed at 00:00 UTC
- APY varies based on pool performance
- `projected_annual` assumes constant current rate
- `average_daily` calculated from last 30 days
- Historical data preserved for full account lifetime

---

## Deposits & Withdrawals

### 6. Confirm Deposit

**Endpoint:** `POST /protected/liquidity/confirm-deposit`

**Description:** Checks BlockRadar for new USDC deposits to your unique deposit address and automatically credits your account. The system detects and validates new deposits without requiring transaction hash or amount input. This prevents double-crediting and ensures only new deposits are processed.

**Authentication:** ✅ Required

**Request Body:**
```typescript
{
  chain: string,      // Blockchain network ("base")
  token: string       // Token type ("USDC")
}
```

**Example Request:**
```json
{
  "chain": "base",
  "token": "USDC"
}
```

**Response:**
```typescript
{
  ok: boolean,
  message: string,
  data: {
    depositsDetected: number,            // Number of new deposits found
    totalAmountCredited: number,         // Total USDC credited
    deposits: Array<{
      amount: number,                    // Deposit amount
      txHash: string,                    // Blockchain transaction hash
      timestamp: string,                 // ISO 8601 timestamp
      confirmations: number              // Number of blockchain confirmations
    }>
  }
}
```

**Example Response:**
```json
{
  "ok": true,
  "message": "Deposits detected and credited successfully",
  "data": {
    "depositsDetected": 1,
    "totalAmountCredited": 500.00,
    "deposits": [
      {
        "amount": 500.00,
        "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "timestamp": "2025-10-23T10:30:00Z",
        "confirmations": 15
      }
    ]
  }
}
```

**Use Cases:**
- Auto-detect deposits from BlockRadar
- Credit user account without manual entry
- Prevent double-crediting of deposits
- Track all deposits with transaction hashes

**Process:**
1. System checks your unique BlockRadar address
2. Detects new USDC deposits on Base network
3. Credits your liquidity pool balance
4. Records deposit with transaction hash
5. Updates your lock period (7 days from last deposit)

**Error Responses:**
- `401 Unauthorized`: Invalid or expired authentication token
- `404 Not Found`: No new deposits detected
- `422 Unprocessable Entity`: Deposit below minimum ($100 for first deposit)
- `500 Internal Server Error`: BlockRadar API unavailable

**Notes:**
- **First deposit:** Minimum $100 USDC required
- **Subsequent deposits:** No minimum requirement
- Only **NEW** deposits are credited (prevents double-crediting)
- Wait 1-2 minutes after sending for blockchain confirmation
- System checks BlockRadar directly (no manual tx hash entry needed)
- Funds locked for 7 days from last deposit
- Deposits automatically added to provider's balance

**Validation Rules:**
- First deposit must be >= $100 USDC
- Must be sent to provider's unique deposit address
- Must be USDC on Base network
- Must have sufficient blockchain confirmations
- Duplicate deposits are automatically filtered out

---

### 7. Request Withdrawal

**Endpoint:** `POST /protected/liquidity/withdraw`

**Description:** Submits a withdrawal request to move funds from the liquidity pool to a specified Ethereum address. Withdrawals are subject to a 7-day lock period from the last deposit and require explicit confirmation. The system validates the destination address and amount before processing.

**Authentication:** ✅ Required

**Request Body:**
```typescript
{
  amount: number,                    // Withdrawal amount in USDC
  destination_address: string,       // Ethereum address to receive funds
  confirm: boolean                   // Explicit confirmation flag
}
```

**Example Request:**
```json
{
  "amount": 1000.00,
  "destination_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "confirm": true
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    withdrawal_id: string,           // Unique withdrawal identifier
    status: 'pending' | 'processing' | 'completed',
    amount: number,                  // Withdrawal amount
    destination_address: string,     // Destination address
    estimated_completion: string,    // ISO 8601 timestamp
    tx_hash: string | null          // Blockchain transaction hash (null until processed)
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully",
  "data": {
    "withdrawal_id": "wdl_abc123",
    "status": "pending",
    "amount": 1000.00,
    "destination_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "estimated_completion": "2025-10-24T10:00:00Z",
    "tx_hash": null
  }
}
```

**Use Cases:**
- Process user withdrawal requests
- Display withdrawal confirmation dialog
- Track withdrawal status
- Notify user when withdrawal completes
- Show pending withdrawals

**Error Responses:**
- `400 Bad Request`: Invalid amount or address format
- `403 Forbidden`: Funds are locked (within 7-day lock period)
- `422 Unprocessable Entity`: Insufficient balance
- `409 Conflict`: Pending withdrawal already exists

**Notes:**
- Funds must not be locked (7-day period from last deposit)
- Amount must be <= available balance
- Withdrawals processed within 24 hours
- Gas fees covered by protocol
- Maximum 1 pending withdrawal per provider

**Validation Rules:**
- Amount must be > 0 and <= available balance
- Destination address must be valid Ethereum address (0x + 40 hex chars)
- `confirm` must be `true`
- No active lock period
- No other pending withdrawals

**Lock Period Calculation:**
- Lock starts from last deposit timestamp
- Lock duration: 7 days (168 hours)
- `lock_until` shown in provider info
- Withdrawals rejected if current time < lock_until

---

## Notifications

### 8. Get Notifications

**Endpoint:** `GET /protected/liquidity/notifications`

**Description:** Retrieves all notifications for the authenticated provider, including system alerts, deposit confirmations, withdrawal updates, and earnings notifications. Notifications are sorted by timestamp in descending order and can be marked as read.

**Authentication:** ✅ Required

**Query Parameters:**
- `unread_only` (optional, boolean): Return only unread notifications (default: false)
- `limit` (optional, number): Maximum notifications to return (default: 50, max: 200)
- `offset` (optional, number): Pagination offset (default: 0)

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    notifications: Array<{
      id: string,                    // Unique notification identifier
      type: 'info' | 'success' | 'warning' | 'error',
      title: string,                 // Notification title
      message: string,               // Notification message body
      timestamp: string,             // ISO 8601 timestamp
      read: boolean,                 // Read status
      action_url: string | null      // Optional URL for action button
    }>,
    unread_count: number             // Total unread notifications
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "id": "notif_001",
        "type": "success",
        "title": "Deposit Confirmed",
        "message": "Your deposit of 5000 USDC has been confirmed and credited to your account.",
        "timestamp": "2025-10-23T10:35:00Z",
        "read": false,
        "action_url": "/dashboard"
      },
      {
        "id": "notif_002",
        "type": "info",
        "title": "Daily Earnings",
        "message": "You earned 12.50 USDC today! Your current APY is 8.5%.",
        "timestamp": "2025-10-23T00:05:00Z",
        "read": true,
        "action_url": "/dashboard/earnings"
      },
      {
        "id": "notif_003",
        "type": "warning",
        "title": "Withdrawal Lock Expiring",
        "message": "Your withdrawal lock period will expire in 2 days.",
        "timestamp": "2025-10-21T12:00:00Z",
        "read": true,
        "action_url": "/dashboard/withdraw"
      }
    ],
    "unread_count": 1
  }
}
```

**Use Cases:**
- Display notification bell with unread count
- Show notification center/inbox
- Alert users to important events
- Track deposit and withdrawal status
- Notify of earnings distributions

**Cache Duration:** 30 seconds

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token

**Notes:**
- Notifications sorted by timestamp (newest first)
- Unread notifications trigger badge count
- System generates notifications automatically
- Notifications never deleted, only marked read
- Real-time notifications via WebSocket (future)

**Notification Types:**
- **info**: General information, earnings updates
- **success**: Successful operations (deposits, withdrawals)
- **warning**: Important alerts (lock expiring, low balance)
- **error**: Failed operations, issues requiring attention

---

### 9. Mark Notification as Read

**Endpoint:** `PUT /protected/liquidity/notifications/{notification_id}/read`

**Description:** Marks a specific notification as read for the authenticated provider. This updates the notification's read status and decrements the unread count. Used when user views or dismisses a notification.

**Authentication:** ✅ Required

**URL Parameters:**
- `notification_id` (required, string): The unique identifier of the notification

**Request Body:** None

**Example Request:**
```
PUT /protected/liquidity/notifications/notif_001/read
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    notification_id: string,
    read: boolean,                   // Updated read status (true)
    marked_at: string               // ISO 8601 timestamp when marked
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "notification_id": "notif_001",
    "read": true,
    "marked_at": "2025-10-23T12:30:00Z"
  }
}
```

**Use Cases:**
- Mark notification as read when user clicks it
- Dismiss notification from list
- Update unread count badge
- Track which notifications user has seen

**Error Responses:**
- `404 Not Found`: Notification not found
- `409 Conflict`: Notification already marked as read

**Notes:**
- Idempotent operation (safe to call multiple times)
- Already read notifications return success
- Optimistic UI updates recommended
- Frontend caches updated immediately

---

## Settings

### 10. Get User Settings

**Endpoint:** `GET /protected/liquidity/settings`

**Description:** Retrieves the user's application settings and preferences, including notification preferences, security settings, and display options. These settings control how the application behaves for the specific provider.

**Authentication:** ✅ Required

**Query Parameters:** None

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    email_notifications: boolean,    // Receive email notifications
    push_notifications: boolean,     // Receive push notifications
    transaction_alerts: boolean,     // Alert on every transaction
    weekly_summary: boolean,         // Receive weekly summary email
    two_factor_enabled: boolean,     // 2FA enabled status
    preferred_currency: string       // Display currency (USD, EUR, etc.)
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "User settings retrieved successfully",
  "data": {
    "email_notifications": true,
    "push_notifications": false,
    "transaction_alerts": true,
    "weekly_summary": true,
    "two_factor_enabled": false,
    "preferred_currency": "USD"
  }
}
```

**Use Cases:**
- Display current settings in UI
- Show notification preferences
- Display security settings
- Show currency preference

**Cache Duration:** 5 minutes

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token
- `404 Not Found`: Settings not initialized (new user)

**Notes:**
- Default settings created on first access
- Settings apply across all user sessions
- Email notifications require verified email

---

### 11. Update User Settings

**Endpoint:** `PUT /protected/liquidity/settings`

**Description:** Updates one or more user settings. Only provided fields are updated; omitted fields remain unchanged. This allows partial updates of user preferences without affecting other settings.

**Authentication:** ✅ Required

**Request Body:**
```typescript
{
  email_notifications?: boolean,
  push_notifications?: boolean,
  transaction_alerts?: boolean,
  weekly_summary?: boolean,
  two_factor_enabled?: boolean,
  preferred_currency?: string
}
```

**Example Request:**
```json
{
  "email_notifications": false,
  "transaction_alerts": false
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    email_notifications: boolean,
    push_notifications: boolean,
    transaction_alerts: boolean,
    weekly_summary: boolean,
    two_factor_enabled: boolean,
    preferred_currency: string
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "email_notifications": false,
    "push_notifications": false,
    "transaction_alerts": false,
    "weekly_summary": true,
    "two_factor_enabled": false,
    "preferred_currency": "USD"
  }
}
```

**Use Cases:**
- Save user preference changes
- Toggle notification settings
- Enable/disable 2FA
- Change display currency
- Update email preferences

**Error Responses:**
- `400 Bad Request`: Invalid field values
- `422 Unprocessable Entity`: Invalid currency code

**Notes:**
- Partial updates supported
- Returns complete updated settings
- Changes effective immediately
- Frontend cache invalidated after update

**Validation Rules:**
- Boolean fields must be `true` or `false`
- `preferred_currency` must be ISO 4217 code (USD, EUR, GBP, etc.)
- Email verification required before enabling email notifications

---

## Response Format

All API responses follow a consistent format:

### Success Response
```typescript
{
  ok: true,              // API uses 'ok' for success indicator
  message: string,
  data: T                // Type varies by endpoint
}
```

**Note:** Some responses may also include `success: boolean` field for compatibility.

### Error Response
```typescript
{
  ok: false,             // False indicates error
  message: string,
  error: string,
  details?: any          // Optional additional error details
}
```

### Status Codes
- `200 OK`: Successful GET, PUT requests
- `201 Created`: Successful POST requests
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Operation not allowed (e.g., locked funds)
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate or conflicting operation
- `422 Unprocessable Entity`: Validation failed
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Temporary service issue

---

## Error Handling

### Common Error Scenarios

#### 1. Authentication Errors
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Missing or invalid authentication token"
}
```

**Resolution:** User should sign in again via Clerk

#### 2. Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Invalid withdrawal amount",
  "details": {
    "field": "amount",
    "reason": "Amount exceeds available balance"
  }
}
```

**Resolution:** Display validation error to user

#### 3. Lock Period Errors
```json
{
  "success": false,
  "message": "Operation not allowed",
  "error": "Funds are locked until 2025-10-30T14:30:00Z",
  "details": {
    "lock_until": "2025-10-30T14:30:00Z",
    "days_remaining": 7
  }
}
```

**Resolution:** Display lock countdown to user

#### 4. Rate Limit Errors
```json
{
  "success": false,
  "message": "Too many requests",
  "error": "Rate limit exceeded. Please try again later.",
  "details": {
    "retry_after": 60,
    "limit": 100,
    "window": "1 hour"
  }
}
```

**Resolution:** Respect retry_after seconds before retrying

### Error Handling Best Practices

1. **Always check `success` field** before processing data
2. **Display `message` to users** for user-friendly errors
3. **Log `error` and `details`** for debugging
4. **Implement exponential backoff** for retries
5. **Handle 401 by redirecting to sign-in**
6. **Show validation errors** next to form fields
7. **Display lock period** prominently for forbidden operations

---

## Rate Limiting

### Rate Limits by Endpoint Type

**Public Endpoints:**
- `GET /public/liquidity/stats`: 100 requests per minute per IP

**Protected Endpoints (per authenticated user):**
- GET endpoints: 100 requests per minute
- POST/PUT endpoints: 30 requests per minute
- Notification endpoints: 60 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698065400
```

### Handling Rate Limits

When rate limited, API returns:
```json
{
  "success": false,
  "message": "Too many requests",
  "error": "Rate limit exceeded",
  "details": {
    "retry_after": 60
  }
}
```

**Best Practices:**
- Implement request throttling in frontend
- Cache responses appropriately
- Use WebSocket for real-time updates (future)
- Batch operations when possible

---

## Webhooks (Future Enhancement)

While not currently implemented, the system is designed to support webhooks for real-time updates:

**Planned Webhook Events:**
- `deposit.confirmed`: Deposit has been confirmed
- `withdrawal.completed`: Withdrawal has been processed
- `earning.distributed`: Daily earnings distributed
- `lock.expired`: Withdrawal lock period expired

---

## Testing & Development

### Development Environment
**Base URL:** `https://dev.api.goopenly.xyz/api/v1`

### Testing Credentials
Use Clerk's test mode for development

### Mock Data
The frontend is designed to handle both:
- Wrapped responses: `{ success: true, data: {...} }`
- Direct responses: `{ ...data }`

---

## Changelog

### Version 1.0.0 (October 23, 2025)
- Initial API documentation
- 11 endpoints implemented
- Authentication via Clerk
- RESTful design
- Comprehensive error handling

---

## Support & Contact

For API support or questions:
- **Documentation:** `/README.md`, `/SETUP.md`
- **Issue Tracker:** GitHub Issues
- **Email:** support@stablepay.io

---

**Document Version:** 1.0.0  
**Last Updated:** October 23, 2025  
**Maintained By:** StablePay Development Team

