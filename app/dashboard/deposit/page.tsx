'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDepositInstructions, useConfirmDeposit } from '@/lib/api/hooks';
import { Copy, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';
import { isValidEthAddress } from '@/lib/utils/format';

export default function DepositPage() {
  const { data: instructions, isLoading } = useDepositInstructions();
  const confirmDeposit = useConfirmDeposit();
  const [copied, setCopied] = useState(false);

  console.log('💰 [DepositPage] Instructions data:', instructions);
  console.log('💰 [DepositPage] Loading state:', isLoading);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckDeposits = async () => {
    try {
      const result = await confirmDeposit.mutateAsync({
        chain: 'base',
        token: 'USDC',
      });
      
      console.log('💰 [DepositPage] Deposit check result:', result);
      
      // Check if deposits were found
      if (result?.data?.depositsDetected > 0) {
        const amount = result.data.totalAmountCredited;
        toast.success(`✅ Deposit of $${amount} credited successfully!`);
      } else {
        toast.info('No new deposits detected. Please ensure your transaction has been confirmed on the blockchain (1-2 minutes).');
      }
    } catch (error: any) {
      console.error('💰 [DepositPage] Deposit check error:', error);
      toast.error(error.message || 'Failed to check for deposits');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!instructions) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-800">
              <AlertCircle className="mr-2 h-5 w-5" />
              <p>Unable to load deposit instructions. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deposit USDC</h1>
        <p className="mt-2 text-gray-600">
          Send USDC to your unique deposit address to start earning
        </p>
      </div>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <AlertCircle className="mr-2 h-5 w-5" />
            Important Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            {instructions?.instructions && Array.isArray(instructions.instructions) ? (
              instructions.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{instruction}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Only send USDC to this address</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Ensure you're using the correct network</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Minimum deposit amount applies</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Deposits are typically processed within 2-5 minutes</span>
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Deposit Address */}
        <Card>
          <CardHeader>
            <CardTitle>Your Deposit Address</CardTitle>
            <CardDescription>
              Send {instructions?.token} on {instructions?.chain?.toUpperCase()} network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-gray-200">
              <QRCodeCanvas 
                value={instructions?.depositAddress || ''} 
                size={200}
                level="H"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Deposit Address
              </label>
              <div className="flex space-x-2">
                <Input
                  value={instructions?.depositAddress || ''}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(instructions?.depositAddress || '')}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Network & Token Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Network</p>
                <p className="font-semibold text-gray-900 uppercase">{instructions?.chain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Token</p>
                <p className="font-semibold text-gray-900">{instructions?.token}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Minimum Deposit</p>
                <p className="font-semibold text-gray-900">
                  ${instructions?.minimumDeposit} USDC
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Lock Period</p>
                <p className="font-semibold text-gray-900">
                  {instructions?.lockPeriodDays} days from last deposit
                </p>
              </div>
            </div>

            {instructions?.note && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 italic">{instructions.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check for Deposits */}
        <Card>
          <CardHeader>
            <CardTitle>Check for Deposits</CardTitle>
            <CardDescription>
              After sending USDC to the address above, click below to check for your deposit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                How it works:
              </p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Send USDC to your unique address above</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Wait 1-2 minutes for blockchain confirmation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Click "Check for Deposits" below</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>System automatically detects and credits new deposits</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                ⚠️ Important:
              </p>
              <ul className="space-y-1 text-sm text-amber-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>First deposit: Minimum ${instructions?.minimumDeposit || 100} USDC</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Subsequent deposits: No minimum</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Only NEW deposits are credited (no double-crediting)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Funds locked for {instructions?.lockPeriodDays || 7} days from last deposit</span>
                </li>
              </ul>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleCheckDeposits}
              disabled={confirmDeposit.isPending}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${confirmDeposit.isPending ? 'animate-spin' : ''}`} />
              {confirmDeposit.isPending ? 'Checking BlockRadar...' : 'Check for Deposits'}
            </Button>

            <p className="text-xs text-center text-gray-500">
              This checks BlockRadar for new USDC deposits to your address
            </p>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                What happens next?
              </h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>System checks BlockRadar for new deposits</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>New deposits are automatically credited</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Funds added to your liquidity pool balance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Start earning immediately!</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

