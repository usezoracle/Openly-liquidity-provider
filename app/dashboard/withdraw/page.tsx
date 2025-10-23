'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProviderInfo, useWithdraw } from '@/lib/api/hooks';
import { formatCurrency, formatDate, isValidEthAddress } from '@/lib/utils/format';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const { data: providerInfo, isLoading } = useProviderInfo();
  const withdraw = useWithdraw();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const isLocked = !providerInfo?.canWithdraw;
  const daysUntilWithdrawal = providerInfo?.daysUntilWithdrawal || 0;
  const availableBalance = providerInfo?.currentBalance || 0;

  console.log('💸 [WithdrawPage] Provider info:', providerInfo);
  console.log('💸 [WithdrawPage] Is locked:', isLocked);
  console.log('💸 [WithdrawPage] Available balance:', availableBalance);
  console.log('💸 [WithdrawPage] Loading state:', isLoading);

  const handleWithdraw = () => {
    if (!amount || !address) {
      toast.error('Please enter amount and destination address');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0 || withdrawAmount > availableBalance) {
      toast.error('Invalid withdrawal amount');
      return;
    }

    if (!isValidEthAddress(address)) {
      toast.error('Invalid Ethereum address');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      await withdraw.mutateAsync({
        amount: parseFloat(amount),
        destination_address: address,
        confirm: true,
      });
      toast.success('Withdrawal request submitted successfully!');
      setAmount('');
      setAddress('');
      setShowConfirm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process withdrawal');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Withdraw USDC</h1>
        <p className="mt-2 text-gray-600">
          Withdraw your funds to any Ethereum address
        </p>
      </div>

      {/* Lock Status Warning */}
      {isLocked && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <Clock className="mr-2 h-5 w-5" />
              Withdrawal Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              Your funds are locked for <strong>{daysUntilWithdrawal} more day{daysUntilWithdrawal !== 1 ? 's' : ''}</strong>.
              This 7-day lock period ensures stable liquidity in the pool. After this period, you can withdraw anytime.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-gray-900">
            {formatCurrency(availableBalance)}
          </div>
          <p className="text-sm text-gray-600 mt-1">USDC available for withdrawal</p>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Details</CardTitle>
          <CardDescription>
            Enter the amount and destination address for your withdrawal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Amount (USDC)
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={availableBalance}
                min="0"
                step="0.01"
                disabled={isLocked}
                className="pr-20"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setAmount(availableBalance.toString())}
                disabled={isLocked}
              >
                Max
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {formatCurrency(availableBalance)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Destination Address
            </label>
            <Input
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLocked}
              className="font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a valid Ethereum address
            </p>
          </div>

          {!showConfirm ? (
            <Button
              className="w-full"
              onClick={handleWithdraw}
              disabled={isLocked || !amount || !address}
            >
              Continue to Confirmation
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <h4 className="font-medium text-gray-900">Confirm Withdrawal</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">To:</span>
                  <span className="font-mono text-xs text-gray-900">{address.slice(0, 10)}...{address.slice(-8)}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirm(false)}
                  disabled={withdraw.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleConfirmWithdraw}
                  disabled={withdraw.isPending}
                >
                  {withdraw.isPending ? 'Processing...' : 'Confirm Withdrawal'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <AlertCircle className="mr-2 h-5 w-5" />
            Withdrawal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Withdrawals are processed within 24 hours</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Funds are sent from the master pool to your address</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Gas fees are covered by the protocol</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>You'll receive a notification when the withdrawal is complete</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

