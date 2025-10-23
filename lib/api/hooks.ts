import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { createClientApiInstance } from './client';
import type {
  ProviderInfo,
  DepositInstructions,
  Transaction,
  PoolStats,
  EarningsData,
  Notification,
  UserSettings,
  WithdrawalRequest,
  DepositConfirmation,
  ApiResponse,
} from '../types';

// Hook to get authenticated API client
export const useApiClient = () => {
  const { getToken, isSignedIn } = useAuth();
  
  console.log('🔐 [useApiClient] Authentication state - isSignedIn:', isSignedIn);
  
  const getClient = async () => {
    console.log('🔐 [useApiClient] Creating API client...');
    console.log('🔐 [useApiClient] isSignedIn:', isSignedIn);
    
    if (!isSignedIn) {
      console.error('❌ [useApiClient] User is not signed in');
      throw new Error('User not authenticated');
    }
    
    console.log('🔐 [useApiClient] Retrieving auth token...');
    const token = await getToken();
    console.log('🔐 [useApiClient] Token retrieved:', token ? `${token.substring(0, 15)}... (length: ${token.length})` : 'NULL');
    
    if (!token) {
      console.error('❌ [useApiClient] Token is null or empty');
      throw new Error('Failed to retrieve authentication token');
    }
    
    return createClientApiInstance(token);
  };
  
  return { getClient, isSignedIn };
};

// Provider Info Hook
export const useProviderInfo = () => {
  const { getClient, isSignedIn } = useApiClient();
  
  return useQuery({
    queryKey: ['providerInfo'],
    queryFn: async () => {
      console.log('🔄 [API] Fetching provider info...');
      try {
        const client = await getClient();
        const response = await client.get('/protected/liquidity/my-info');
        
        console.log('✅ [API] Provider info response:', response.data);
        
        // Handle both wrapped and unwrapped responses
        if (response.data.success !== undefined) {
          console.log('📦 [API] Provider info data:', response.data.data);
          return response.data.data;
        }
        console.log('📦 [API] Provider info data:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ [API] Error fetching provider info:', error.response?.data || error.message);
        throw error;
      }
    },
    enabled: isSignedIn === true, // Only run when explicitly signed in, not when undefined
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

// Deposit Instructions Hook
export const useDepositInstructions = () => {
  const { getClient, isSignedIn } = useApiClient();
  
  return useQuery({
    queryKey: ['depositInstructions'],
    queryFn: async () => {
      console.log('🔄 [API] Fetching deposit instructions...');
      console.log('🔐 [API] isSignedIn status:', isSignedIn);
      
      if (!isSignedIn) {
        console.error('❌ [API] Cannot fetch deposit instructions - user not signed in');
        throw new Error('User must be signed in to fetch deposit instructions');
      }
      
      try {
        const client = await getClient();
        const response = await client.get('/protected/liquidity/deposit-instructions');
        
        console.log('✅ [API] Deposit instructions response:', response.data);
        
        // Handle both wrapped responses (with ok/success) and direct responses
        if (response.data.ok !== undefined || response.data.success !== undefined) {
          console.log('📦 [API] Deposit instructions data:', response.data.data);
          return response.data.data;
        }
        console.log('📦 [API] Deposit instructions data:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ [API] Error fetching deposit instructions:', error.response?.data?.message || error.message);
        console.error('❌ [API] Full error object:', error);
        throw error;
      }
    },
    enabled: isSignedIn === true, // Only run when explicitly signed in
    staleTime: 300000, // 5 minutes
    retry: 1,
  });
};

// Pool Statistics Hook (Public - No Auth Required)
export const usePoolStats = () => {
  const { getClient } = useApiClient();
  
  return useQuery({
    queryKey: ['poolStats'],
    queryFn: async () => {
      console.log('🔄 [API] Fetching pool stats (public)...');
      try {
        // Use a client without auth token for public endpoint
        const client = createClientApiInstance(null);
        const response = await client.get('/public/liquidity/stats');
        
        console.log('✅ [API] Pool stats response:', response.data);
        
        // Handle both wrapped responses (with ok/success) and direct responses
        if (response.data.ok !== undefined || response.data.success !== undefined) {
          console.log('📦 [API] Pool stats data:', response.data.data);
          return response.data.data;
        }
        console.log('📦 [API] Pool stats data:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ [API] Error fetching pool stats:', error.response?.data || error.message);
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};

// Transactions Hook
export const useTransactions = () => {
  const { getClient, isSignedIn } = useApiClient();
  
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      console.log('🔄 [API] Fetching transactions...');
      try {
        const client = await getClient();
        const response = await client.get('/protected/liquidity/transactions');
        
        console.log('✅ [API] Transactions response:', response.data);
        
        if (response.data.success !== undefined) {
          const transactions = response.data.data || [];
          console.log(`📦 [API] Transactions data: ${transactions.length} transactions found`);
          return transactions;
        }
        const transactions = Array.isArray(response.data) ? response.data : [];
        console.log(`📦 [API] Transactions data: ${transactions.length} transactions found`);
        return transactions;
      } catch (error: any) {
        console.error('❌ [API] Error fetching transactions:', error.response?.data || error.message);
        return []; // Return empty array on error
      }
    },
    enabled: isSignedIn === true, // Only run when explicitly signed in
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

// Earnings Hook
export const useEarnings = () => {
  const { getClient, isSignedIn } = useApiClient();
  
  return useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      console.log('🔄 [API] Fetching earnings...');
      try {
        const client = await getClient();
        const response = await client.get('/protected/liquidity/earnings');
        
        console.log('✅ [API] Earnings response:', response.data);
        
        if (response.data.success !== undefined) {
          console.log('📦 [API] Earnings data:', response.data.data);
          return response.data.data;
        }
        console.log('📦 [API] Earnings data:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ [API] Error fetching earnings:', error.response?.data || error.message);
        // Return default structure on error
        return {
          daily_earnings: [],
          total_earnings: 0,
          projected_annual: 0,
          average_daily: 0,
        };
      }
    },
    enabled: isSignedIn === true, // Only run when explicitly signed in
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};

// Notifications Hook
export const useNotifications = () => {
  const { getClient, isSignedIn } = useApiClient();
  
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      console.log('🔄 [API] Fetching notifications...');
      try {
        const client = await getClient();
        const response = await client.get('/protected/liquidity/notifications');
        
        console.log('✅ [API] Notifications response:', response.data);
        
        if (response.data.success !== undefined) {
          const notifications = response.data.data || [];
          console.log(`📦 [API] Notifications data: ${notifications.length} notifications found`);
          return notifications;
        }
        const notifications = Array.isArray(response.data) ? response.data : [];
        console.log(`📦 [API] Notifications data: ${notifications.length} notifications found`);
        return notifications;
      } catch (error: any) {
        console.error('❌ [API] Error fetching notifications:', error.response?.data || error.message);
        return []; // Return empty array on error
      }
    },
    enabled: isSignedIn === true, // Only run when explicitly signed in
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

// User Settings Hook
export const useUserSettings = () => {
  const { getClient, isSignedIn } = useApiClient();
  
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      console.log('🔄 [API] Fetching user settings...');
      try {
        const client = await getClient();
        const response = await client.get('/protected/liquidity/settings');
        
        console.log('✅ [API] User settings response:', response.data);
        
        if (response.data.success !== undefined) {
          console.log('📦 [API] User settings data:', response.data.data);
          return response.data.data;
        }
        console.log('📦 [API] User settings data:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ [API] Error fetching user settings:', error.response?.data || error.message);
        // Return default settings on error
        return {
          email_notifications: true,
          push_notifications: false,
          transaction_alerts: true,
          weekly_summary: true,
          two_factor_enabled: false,
          preferred_currency: 'USD',
        };
      }
    },
    enabled: isSignedIn === true, // Only run when explicitly signed in
    staleTime: 300000, // 5 minutes
    retry: 1,
  });
};

// Confirm Deposit Mutation
export const useConfirmDeposit = () => {
  const { getClient } = useApiClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DepositConfirmation) => {
      console.log('🔄 [MUTATION] Checking for deposits on chain:', data.chain);
      try {
        const client = await getClient();
        const response = await client.post('/protected/liquidity/confirm-deposit', data);
        
        console.log('✅ [MUTATION] Deposit check response:', response.data);
        
        if (response.data.ok !== undefined) {
          console.log('📦 [MUTATION] Deposits credited:', response.data.data);
          return response.data;
        }
        return { ok: true, data: response.data };
      } catch (error: any) {
        console.error('❌ [MUTATION] Error checking deposits:', error.response?.data || error.message);
        
        // Extract error message from API response
        const errorData = error.response?.data;
        const errorMessage = errorData?.error?.message || errorData?.message || 'Failed to check for deposits';
        
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      console.log('✅ [MUTATION] Deposit confirmation successful, invalidating queries...');
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['providerInfo'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
    onError: (error) => {
      console.error('❌ [MUTATION] Deposit confirmation failed:', error);
    },
  });
};

// Withdraw Mutation
export const useWithdraw = () => {
  const { getClient } = useApiClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: WithdrawalRequest) => {
      console.log('🔄 [MUTATION] Processing withdrawal:', { amount: data.amount, address: data.destination_address });
      try {
        const client = await getClient();
        const response = await client.post('/protected/liquidity/withdraw', data);
        
        console.log('✅ [MUTATION] Withdrawal processed:', response.data);
        
        if (response.data.success !== undefined) {
          return response.data;
        }
        return { success: true, data: response.data };
      } catch (error: any) {
        console.error('❌ [MUTATION] Error processing withdrawal:', error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to process withdrawal';
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      console.log('✅ [MUTATION] Withdrawal successful, invalidating queries...');
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['providerInfo'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
    onError: (error) => {
      console.error('❌ [MUTATION] Withdrawal failed:', error);
    },
  });
};

// Update Settings Mutation
export const useUpdateSettings = () => {
  const { getClient } = useApiClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      console.log('🔄 [MUTATION] Updating settings:', data);
      try {
        const client = await getClient();
        const response = await client.put('/protected/liquidity/settings', data);
        
        console.log('✅ [MUTATION] Settings updated:', response.data);
        
        if (response.data.success !== undefined) {
          return response.data;
        }
        return { success: true, data: response.data };
      } catch (error: any) {
        console.error('❌ [MUTATION] Error updating settings:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update settings');
      }
    },
    onSuccess: (data) => {
      console.log('✅ [MUTATION] Settings update successful, updating cache...');
      // Update the cache with new settings
      queryClient.setQueryData(['userSettings'], data.data || data);
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('❌ [MUTATION] Settings update failed:', error);
    },
  });
};

// Mark Notification as Read Mutation
export const useMarkNotificationRead = () => {
  const { getClient } = useApiClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('🔄 [MUTATION] Marking notification as read:', notificationId);
      try {
        const client = await getClient();
        const response = await client.put(`/protected/liquidity/notifications/${notificationId}/read`);
        
        console.log('✅ [MUTATION] Notification marked as read:', response.data);
        
        if (response.data.success !== undefined) {
          return response.data;
        }
        return { success: true, data: response.data };
      } catch (error: any) {
        console.error('❌ [MUTATION] Error marking notification as read:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
      }
    },
    onSuccess: (_data, notificationId) => {
      console.log('✅ [MUTATION] Notification marked successfully, updating cache...');
      // Optimistically update the cache
      queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        );
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('❌ [MUTATION] Failed to mark notification as read:', error);
    },
  });
};

