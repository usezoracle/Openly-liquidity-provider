# API Updates - Real API Integration

**Updated:** October 23, 2025

This document tracks all updates made to match the actual API responses from `https://api.goopenly.xyz/api/v1`.

---

## Summary

The API uses **camelCase** naming convention and returns `ok` instead of `success` as the primary success indicator.

---

## Updated Endpoints

### 1. ✅ Get Provider Information
**Endpoint:** `GET /protected/liquidity/my-info`

**Field Name Changes:**
| Old (Expected) | New (Actual) | Type |
|---------------|--------------|------|
| `provider_id` | *(removed)* | - |
| `email` | *(removed)* | - |
| `balance` | `currentBalance` | number |
| `total_deposited` | `totalDeposited` | number |
| `total_withdrawn` | `totalWithdrawn` | number |
| `total_earnings` | `totalEarnings` | number |
| `apy` | *(removed)* | - |
| `lock_until` | *(removed)* | - |
| `created_at` | *(removed)* | - |
| `last_activity` | *(removed)* | - |
| - | `canWithdraw` | boolean |
| - | `chain` | string |
| - | `daysUntilWithdrawal` | number |
| - | `deposits` | Deposit[] |
| - | `isProvider` | boolean |
| - | `token` | string |
| - | `withdrawals` | Withdrawal[] |

**Actual Response:**
```json
{
  "ok": true,
  "message": "Provider information retrieved successfully",
  "data": {
    "canWithdraw": true,
    "chain": "base",
    "currentBalance": 0,
    "daysUntilWithdrawal": 0,
    "deposits": [],
    "isProvider": true,
    "token": "USDC",
    "totalDeposited": 0,
    "totalEarnings": 0,
    "totalWithdrawn": 0,
    "withdrawals": []
  }
}
```

**Key Changes:**
- `canWithdraw`: Boolean indicating if withdrawals are allowed
- `daysUntilWithdrawal`: Number of days until withdrawal lock expires (0 if unlocked)
- `deposits`: Array of deposit records (currently empty)
- `withdrawals`: Array of withdrawal records (currently empty)
- Removed: APY, lock_until (replaced with canWithdraw/daysUntilWithdrawal)
- Removed: User metadata (provider_id, email, created_at, last_activity)

---

### 2. ✅ Get Deposit Instructions
**Endpoint:** `GET /protected/liquidity/deposit-instructions`

**Field Name Changes:**
| Old (Expected) | New (Actual) | Type |
|---------------|--------------|------|
| `deposit_address` | `depositAddress` | string |
| `network` | `chain` | string |
| `minimum_deposit` | `minimumDeposit` | number |
| `qr_code_url` | *(removed)* | - |
| - | `lockPeriodDays` | number |
| - | `note` | string |

**Actual Response:**
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
      "1. Send USDC to your unique deposit address: 0xE6Bab...",
      "2. Use the BASE network",
      "3. Minimum deposit: $100 USDC",
      "4. After sending, call POST /protected/liquidity/confirm-deposit",
      "5. Funds are locked for 7 days from your last deposit",
      "6. Check balance anytime: GET /protected/liquidity/my-info"
    ],
    "note": "Send USDC to your unique deposit address..."
  }
}
```

---

### 3. ✅ Get Pool Statistics
**Endpoint:** `GET /public/liquidity/stats`

**Field Name Changes:**
| Old (Expected) | New (Actual) | Type |
|---------------|--------------|------|
| `total_liquidity` | `totalLiquidity` | number |
| `total_providers` | `totalProviders` | number |
| `average_apy` | *(removed)* | - |
| `total_volume_24h` | *(removed)* | - |
| `pool_utilization` | *(removed)* | - |
| `total_earnings_distributed` | *(removed)* | - |
| - | `totalDeposited` | number |
| - | `totalWithdrawn` | number |
| - | `averageProviderBalance` | number |
| - | `lockPeriodDays` | number |

**Actual Response:**
```json
{
  "ok": true,
  "message": "Pool statistics retrieved successfully",
  "data": {
    "totalLiquidity": 0,
    "totalProviders": 2,
    "totalDeposited": 0,
    "totalWithdrawn": 0,
    "averageProviderBalance": 0,
    "lockPeriodDays": 7
  }
}
```

**Calculations:**
- `totalLiquidity` = `totalDeposited` - `totalWithdrawn`
- `averageProviderBalance` = `totalLiquidity` / `totalProviders`

---

## API Conventions

### Response Format
All API responses use this format:

**Success:**
```typescript
{
  ok: true,
  message: string,
  data: T
}
```

**Error:**
```typescript
{
  ok: false,
  message: string,
  error: string,
  details?: any
}
```

### Naming Convention
- **All fields:** camelCase (e.g., `depositAddress`, `totalLiquidity`)
- **No snake_case:** API does not use `deposit_address`, `total_liquidity`, etc.
- **Consistent:** Both request and response use camelCase

### Network
- **Primary network:** Base (Layer 2)
- **Field name:** `chain: "base"`
- **Token:** USDC

### Lock Period
- **Duration:** 7 days (from last deposit)
- **Field:** `lockPeriodDays: 7`
- **Applies to:** All deposits and withdrawals

---

### 4. ✅ Confirm Deposit (Auto-Detection)
**Endpoint:** `POST /protected/liquidity/confirm-deposit`

**Field Name Changes:**
| Old (Expected) | New (Actual) | Type |
|---------------|--------------|------|
| `tx_hash` | *(removed)* | - |
| `amount` | *(removed)* | - |
| - | `chain` | string |
| - | `token` | string |

**Actual Request:**
```json
{
  "chain": "base",
  "token": "USDC"
}
```

**Actual Response:**
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
        "txHash": "0x1234...",
        "timestamp": "2025-10-23T10:30:00Z",
        "confirmations": 15
      }
    ]
  }
}
```

**Key Changes:**
- **No manual tx_hash entry** - System auto-detects from BlockRadar
- **No manual amount entry** - System reads from blockchain
- Only requires `chain` and `token` to trigger check
- Prevents double-crediting automatically
- Returns all newly detected deposits

**Process:**
1. User calls endpoint with `{chain: "base", token: "USDC"}`
2. System checks BlockRadar for provider's unique address
3. Detects NEW USDC deposits
4. Credits account automatically
5. Returns deposit details with tx hashes

---

## Files Updated

### TypeScript Types
**File:** `lib/types/index.ts`

1. **ProviderInfo interface:**
```typescript
export interface ProviderInfo {
  canWithdraw: boolean;          // was: lock_until (conceptually different)
  chain: string;                 // NEW
  currentBalance: number;        // was: balance
  daysUntilWithdrawal: number;   // was: lock_until (conceptually different)
  deposits: Deposit[];           // NEW
  isProvider: boolean;           // NEW
  token: string;                 // NEW
  totalDeposited: number;        // was: total_deposited (camelCase)
  totalEarnings: number;         // was: total_earnings (camelCase)
  totalWithdrawn: number;        // was: total_withdrawn (camelCase)
  withdrawals: Withdrawal[];     // NEW
}

// New nested interfaces
export interface Deposit {
  id: string;
  amount: number;
  timestamp: string;
  txHash: string;
  status: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  timestamp: string;
  txHash: string;
  status: string;
  destinationAddress: string;
}
```

2. **DepositInstructions interface:**
```typescript
export interface DepositInstructions {
  depositAddress: string;     // was: deposit_address
  chain: string;               // was: network
  token: string;
  minimumDeposit: number;      // was: minimum_deposit
  lockPeriodDays: number;      // NEW
  instructions: string[];
  note: string;                // NEW
}
```

3. **PoolStats interface:**
```typescript
export interface PoolStats {
  totalLiquidity: number;           // was: total_liquidity
  totalProviders: number;            // was: total_providers
  totalDeposited: number;            // NEW
  totalWithdrawn: number;            // NEW
  averageProviderBalance: number;    // NEW (was: average_apy)
  lockPeriodDays: number;            // NEW
}
```

4. **ApiResponse interface:**
```typescript
export interface ApiResponse<T> {
  ok: boolean;              // Primary field (was: success)
  success?: boolean;        // Backwards compatibility
  data: T;
  message?: string;
  error?: string;
}
```

---

### API Hooks
**File:** `lib/api/hooks.ts`

Updated all response handlers to check for both `ok` and `success`:
```typescript
// Handle both wrapped responses
if (response.data.ok !== undefined || response.data.success !== undefined) {
  return response.data.data;
}
return response.data;
```

**Updated hooks:**
- ✅ `useDepositInstructions()`
- ✅ `usePoolStats()`

---

### React Components

**File:** `components/balance-card.tsx`

**Changes:**
```typescript
// Balance display
providerInfo?.currentBalance    // was: balance

// Removed APY display, now shows:
providerInfo?.chain?.toUpperCase()  // Network (BASE)
providerInfo?.token                 // Token (USDC)
```

**File:** `components/goals-section.tsx`

**Changes:**
```typescript
providerInfo?.totalEarnings    // was: total_earnings
```

**File:** `components/balance-details-page.tsx`

**Changes:**
```typescript
// All provider info fields
providerInfo?.currentBalance      // was: balance
providerInfo?.totalDeposited      // was: total_deposited
providerInfo?.totalEarnings       // was: total_earnings
providerInfo?.totalWithdrawn      // was: total_withdrawn
providerInfo?.canWithdraw         // NEW (was: checking lock_until)
providerInfo?.daysUntilWithdrawal // NEW (was: lock_until)
providerInfo?.deposits?.length    // NEW - count of deposits

// Performance metrics updated:
// - "Current APY" → "Can Withdraw" (Yes/No or days until)
// - "Active Days" → "Total Deposits" (count + total amount)
```

**File:** `app/dashboard/withdraw/page.tsx`

**Changes:**
```typescript
// Lock status
const isLocked = !providerInfo?.canWithdraw;      // was: checking lock_until date
const daysUntilWithdrawal = providerInfo?.daysUntilWithdrawal || 0;  // NEW
const availableBalance = providerInfo?.currentBalance || 0;  // was: balance

// Display: "locked for X more days" instead of "locked until DATE"
```

**File:** `app/dashboard/deposit/page.tsx`

**Changes:**
```typescript
// Deposit confirmation simplified (no tx_hash or amount needed)
await confirmDeposit.mutateAsync({
  chain: 'base',
  token: 'USDC',
});

// OLD (removed):
// - Manual tx_hash input field
// - Manual amount input field
// - Transaction hash validation
// 
// NEW:
// - Single "Check for Deposits" button
// - Auto-detects from BlockRadar
// - No manual entry required

// Address field
instructions?.depositAddress    // was: deposit_address

// Network display
instructions?.chain?.toUpperCase()   // was: network

// Minimum deposit
instructions?.minimumDeposit    // was: minimum_deposit

// New fields
instructions?.lockPeriodDays
instructions?.note
```

**File:** `components/balance-details-page.tsx`

**Changes:**
```typescript
// Pool stats fields
poolStats?.totalLiquidity       // was: total_liquidity
poolStats?.totalProviders       // was: total_providers
poolStats?.averageProviderBalance  // was: average_apy
poolStats?.totalDeposited       // NEW
poolStats?.lockPeriodDays       // NEW (was: pool_utilization)
```

**UI Updates:**
- Pool Share calculation uses `totalLiquidity`
- Pool Health section now shows Lock Period instead of Utilization Rate
- Added "Average Balance" metric
- Added "Total Deposited" metric

---

### Documentation
**File:** `API_ENDPOINTS.md`

**Updates:**
1. Added "API Conventions" section explaining:
   - camelCase naming convention
   - Response format with `ok` field
   - Date/time formats (ISO 8601)
   - Number formats (currency, percentages, days)
   - Blockchain address format

2. Updated endpoint documentation:
   - Get Deposit Instructions (endpoint #3)
   - Get Pool Statistics (endpoint #1)

3. Updated example responses to match actual API

4. Added field calculation notes:
   - `averageProviderBalance = totalLiquidity / totalProviders`
   - `totalLiquidity = totalDeposited - totalWithdrawn`

---

## Breaking Changes

### Removed Fields

**From ProviderInfo:**
- ❌ `provider_id` - No longer returned by API
- ❌ `email` - No longer returned by API
- ❌ `apy` - No longer returned by API
- ❌ `lock_until` - Replaced by `canWithdraw` + `daysUntilWithdrawal`
- ❌ `created_at` - No longer returned by API
- ❌ `last_activity` - No longer returned by API

**From PoolStats:**
- ❌ `average_apy` - No longer returned by API
- ❌ `total_volume_24h` - No longer returned by API  
- ❌ `pool_utilization` - No longer returned by API
- ❌ `total_earnings_distributed` - No longer returned by API

**From DepositInstructions:**
- ❌ `qr_code_url` - QR code generated client-side from `depositAddress`

### New Fields

**ProviderInfo:**
- ✅ `canWithdraw` - Boolean indicating withdrawal status
- ✅ `chain` - Blockchain network ("base")
- ✅ `daysUntilWithdrawal` - Days until withdrawal allowed
- ✅ `deposits` - Array of deposit records
- ✅ `isProvider` - Registration status
- ✅ `token` - Token type ("USDC")
- ✅ `withdrawals` - Array of withdrawal records

**PoolStats:**
- ✅ `totalDeposited` - Total amount deposited
- ✅ `totalWithdrawn` - Total amount withdrawn
- ✅ `averageProviderBalance` - Average balance per provider
- ✅ `lockPeriodDays` - Lock period duration

**DepositInstructions:**
- ✅ `lockPeriodDays` - Lock period duration (7 days)
- ✅ `note` - Additional instructional note

---

## Migration Checklist

When integrating with additional endpoints, verify:

- [ ] Field names are in camelCase
- [ ] Response uses `ok` field for success indicator
- [ ] TypeScript interfaces match actual API response
- [ ] Components use correct field names
- [ ] Documentation is updated with actual response examples
- [ ] Error handling checks both `ok` and legacy `success` fields
- [ ] Date/time fields are ISO 8601 format
- [ ] Currency amounts are decimal numbers
- [ ] Ethereum addresses start with `0x` and are 42 characters

---

## Testing Checklist

To verify API integration:

### Provider Information
- [ ] Current balance displays (`currentBalance`)
- [ ] Network shows "BASE" (`chain`)
- [ ] Token shows "USDC" (`token`)
- [ ] Total deposited, earnings, withdrawn display correctly
- [ ] Can withdraw status shows correctly (`canWithdraw`)
- [ ] Days until withdrawal displays when locked (`daysUntilWithdrawal`)
- [ ] Deposit count displays (`deposits.length`)

### Deposit Instructions
- [ ] Address displays correctly (0xE6Bab...)
- [ ] Network shows "BASE" (uppercase)
- [ ] QR code generates from depositAddress
- [ ] All 6 instructions displayed
- [ ] Lock period shown (7 days)
- [ ] Note displayed at bottom
- [ ] Minimum deposit shows $100 USDC

### Pool Statistics  
- [ ] Total Liquidity displays
- [ ] Total Providers shows count
- [ ] Average Balance calculated correctly
- [ ] Total Deposited displays
- [ ] Lock period shows 7 days
- [ ] Pool share calculates: (balance / totalLiquidity * 100)

---

## Known Issues & Solutions

### Issue: `isSignedIn` is `undefined` during Clerk initialization
**Solution:** Changed all query `enabled` flags from `isSignedIn` to `isSignedIn === true`

### Issue: Fields returned as `undefined`
**Solution:** Always check for both camelCase (actual) and snake_case (legacy) field names

### Issue: QR code not displaying
**Solution:** Use `depositAddress` field, not `deposit_address`

---

## Next Steps

When new endpoints are integrated:

1. **Capture actual response** via console logs
2. **Update TypeScript interface** to match exact field names
3. **Update API hooks** to handle response format
4. **Update components** to use correct field names
5. **Update documentation** with actual examples
6. **Test thoroughly** with real API data

---

## Support

For API-related questions:
- **API Docs:** `/API_ENDPOINTS.md`
- **Setup Guide:** `/SETUP.md`
- **Console Logs:** Check browser console for detailed API logs
- **Base URL:** `https://api.goopenly.xyz/api/v1`

---

**Document Version:** 1.0.0  
**Last Verified:** October 23, 2025  
**API Version:** v1

