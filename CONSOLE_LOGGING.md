# Console Logging Guide

This document explains the comprehensive console logging system implemented throughout the StablePay Liquidity Provider Dashboard.

## Overview

All console logs use emoji prefixes to make them easily identifiable and filterable in the browser console:

- 🌐 **Configuration** - API configuration and setup
- 🔧 **Initialization** - Component and API client initialization
- 🔄 **Loading** - Data fetching in progress
- ✅ **Success** - Successful API responses
- 📦 **Data** - Processed data being returned
- 🚀 **Request** - Outgoing API requests
- ❌ **Error** - Error responses or exceptions
- 🔒 **Auth** - Authentication-related events
- 💳 **Components** - Component-specific logs
- 📊 **Charts/Tables** - Data visualization logs
- 📈 **Analytics** - Analytics page logs
- 🎯 **Goals** - Goals section logs
- 💰 **Deposit** - Deposit page logs
- 💸 **Withdraw** - Withdraw page logs

## Log Categories

### 1. API Client (`lib/api/client.ts`)

**Initial Configuration:**
```
🌐 [API Client] Base URL: https://api.goopenly.xyz/api/v1
```

**Instance Creation:**
```
🔧 [API Client] Creating API instance, token present: true/false
```

**Requests:**
```
🚀 [API Request] GET /protected/liquidity/my-info
  - headers: {...}
  - data: {...}
```

**Responses:**
```
✅ [API Response] GET /protected/liquidity/my-info
  - status: 200
  - data: {...}
```

**Errors:**
```
❌ [API Response Error] GET /protected/liquidity/my-info
  - status: 401
  - data: {...}
  - message: "Unauthorized"
```

**Auth Issues:**
```
🔒 [API] Unauthorized - redirecting to sign-in
```

### 2. API Hooks (`lib/api/hooks.ts`)

Each hook logs its lifecycle:

#### Query Hooks

**Provider Info:**
```
🔄 [API] Fetching provider info...
✅ [API] Provider info response: {...}
📦 [API] Provider info data: {...}
❌ [API] Error fetching provider info: {...}
```

**Deposit Instructions:**
```
🔄 [API] Fetching deposit instructions...
✅ [API] Deposit instructions response: {...}
📦 [API] Deposit instructions data: {...}
❌ [API] Error fetching deposit instructions: {...}
```

**Pool Stats:**
```
🔄 [API] Fetching pool stats (public)...
✅ [API] Pool stats response: {...}
📦 [API] Pool stats data: {...}
❌ [API] Error fetching pool stats: {...}
```

**Transactions:**
```
🔄 [API] Fetching transactions...
✅ [API] Transactions response: {...}
📦 [API] Transactions data: 5 transactions found
❌ [API] Error fetching transactions: {...}
```

**Earnings:**
```
🔄 [API] Fetching earnings...
✅ [API] Earnings response: {...}
📦 [API] Earnings data: {...}
❌ [API] Error fetching earnings: {...}
```

**Notifications:**
```
🔄 [API] Fetching notifications...
✅ [API] Notifications response: {...}
📦 [API] Notifications data: 3 notifications found
❌ [API] Error fetching notifications: {...}
```

**User Settings:**
```
🔄 [API] Fetching user settings...
✅ [API] User settings response: {...}
📦 [API] User settings data: {...}
❌ [API] Error fetching user settings: {...}
```

#### Mutation Hooks

**Confirm Deposit:**
```
🔄 [MUTATION] Confirming deposit: {tx_hash: "0x...", amount: 1000}
✅ [MUTATION] Deposit confirmed: {...}
✅ [MUTATION] Deposit confirmation successful, invalidating queries...
❌ [MUTATION] Error confirming deposit: {...}
❌ [MUTATION] Deposit confirmation failed: {...}
```

**Withdraw:**
```
🔄 [MUTATION] Processing withdrawal: {amount: 500, address: "0x..."}
✅ [MUTATION] Withdrawal processed: {...}
✅ [MUTATION] Withdrawal successful, invalidating queries...
❌ [MUTATION] Error processing withdrawal: {...}
❌ [MUTATION] Withdrawal failed: {...}
```

**Update Settings:**
```
🔄 [MUTATION] Updating settings: {email_notifications: true}
✅ [MUTATION] Settings updated: {...}
✅ [MUTATION] Settings update successful, updating cache...
❌ [MUTATION] Error updating settings: {...}
❌ [MUTATION] Settings update failed: {...}
```

**Mark Notification Read:**
```
🔄 [MUTATION] Marking notification as read: notif-123
✅ [MUTATION] Notification marked as read: {...}
✅ [MUTATION] Notification marked successfully, updating cache...
❌ [MUTATION] Error marking notification as read: {...}
❌ [MUTATION] Failed to mark notification as read: {...}
```

### 3. Component Logs

**Balance Card (`components/balance-card.tsx`):**
```
💳 [BalanceCard] Provider info: {...}
💳 [BalanceCard] Loading state: false
```

**Balance Details Page (`components/balance-details-page.tsx`):**
```
📈 [BalanceDetailsPage] Provider info: {...}
📈 [BalanceDetailsPage] Pool stats: {...}
📈 [BalanceDetailsPage] Transactions: 10
📈 [BalanceDetailsPage] Earnings: {...}
📈 [BalanceDetailsPage] Time range: 30days
```

**Transactions Table (`components/transactions-table.tsx`):**
```
📊 [TransactionsTable] Transactions loaded: 10 transactions
📊 [TransactionsTable] Loading state: false
📊 [TransactionsTable] Active tab: all
📊 [TransactionsTable] Filtered transactions: 10
```

**Spending Chart (`components/spending-chart.tsx`):**
```
📊 [SpendingChart] Total earnings: 1500
📊 [SpendingChart] Total withdrawals: 500
📊 [SpendingChart] Net profit: 1000
📊 [SpendingChart] Chart data points: 12
```

**Goals Section (`components/goals-section.tsx`):**
```
🎯 [GoalsSection] Current earnings: 2500
🎯 [GoalsSection] Progress: 25.00%
🎯 [GoalsSection] Remaining: 7500
```

**Header (`components/header.tsx`):**
```
🔔 [Header] Notifications: 5 total, 2 unread
```

**Deposit Page (`app/dashboard/deposit/page.tsx`):**
```
💰 [DepositPage] Instructions data: {...}
💰 [DepositPage] Loading state: false
```

**Withdraw Page (`app/dashboard/withdraw/page.tsx`):**
```
💸 [WithdrawPage] Provider info: {...}
💸 [WithdrawPage] Is locked: false
💸 [WithdrawPage] Available balance: 1000
💸 [WithdrawPage] Loading state: false
```

## How to Use

### Filtering Logs in Browser Console

**All API requests:**
```javascript
// Filter by request type
🚀 [API Request]
```

**All API responses:**
```javascript
// Filter by response type
✅ [API Response]
```

**All errors:**
```javascript
// Filter by error emoji
❌
```

**Specific feature:**
```javascript
// Filter by component/feature
[TransactionsTable]
[BalanceCard]
[MUTATION]
```

### Chrome DevTools Tips

1. **Filter by prefix:** Type the emoji or text in the console filter box
2. **Group logs:** Use the console's group/collapse feature
3. **Preserve log:** Check "Preserve log" to keep logs across page refreshes
4. **Custom filters:** Create custom filters in DevTools settings

### Production Considerations

These console logs are useful for development and debugging. For production:

1. **Remove logs:** Use a tool like `babel-plugin-transform-remove-console`
2. **Conditional logging:** Wrap logs in `if (process.env.NODE_ENV === 'development')`
3. **Log service:** Replace with a logging service (e.g., Sentry, LogRocket)

## Example Debug Session

### Debugging a failed transaction fetch:

1. Open browser console
2. Filter for: `[API]`
3. Look for:
   ```
   🔄 [API] Fetching transactions...
   ❌ [API] Error fetching transactions: {...}
   ```
4. Check the error object for details
5. Verify the API request was sent with correct headers:
   ```
   🚀 [API Request] GET /protected/liquidity/transactions
   ```

### Debugging deposit confirmation:

1. Filter for: `[MUTATION]`
2. Track the flow:
   ```
   🔄 [MUTATION] Confirming deposit: {tx_hash: "0x...", amount: 1000}
   ✅ [MUTATION] Deposit confirmed: {...}
   ✅ [MUTATION] Deposit confirmation successful, invalidating queries...
   ```
3. If it fails:
   ```
   ❌ [MUTATION] Error confirming deposit: {...}
   ```

### Debugging component rendering:

1. Filter for component name: `[BalanceCard]`
2. Check what data is being received:
   ```
   💳 [BalanceCard] Provider info: {balance: 1000, apy: 8.5, ...}
   💳 [BalanceCard] Loading state: false
   ```

## Log Levels

The logging system uses these implicit levels:

1. **INFO** - 🔄, 💳, 📊, 📈, 🎯, 🔔 (normal operation)
2. **SUCCESS** - ✅, 📦 (successful operations)
3. **WARN** - 🔒 (authentication issues)
4. **ERROR** - ❌ (errors and failures)

## Best Practices

1. **Don't log sensitive data:** Avoid logging passwords, tokens, or PII
2. **Keep logs concise:** Log only what's needed for debugging
3. **Use consistent formatting:** Follow the established emoji prefix pattern
4. **Clean up:** Remove debug logs before committing to production
5. **Use source maps:** Ensure source maps are enabled for easier debugging

## Future Enhancements

Consider adding:

1. **Log aggregation:** Send logs to a service like LogRocket or Sentry
2. **Performance metrics:** Add timing logs for slow operations
3. **User actions:** Log user interactions for analytics
4. **Error boundaries:** Catch and log React errors
5. **Network monitoring:** Track API call performance

---

Last updated: October 23, 2025

