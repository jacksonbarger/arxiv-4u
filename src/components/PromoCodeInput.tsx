'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

interface PromoCodeInputProps {
  onPromoApplied: (discount: { type: string; value: number; code: string }) => void;
  tier?: 'basic' | 'premium';
}

export function PromoCodeInput({ onPromoApplied, tier = 'basic' }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: string } | null>(null);
  const { showToast } = useToast();

  const validatePromoCode = async () => {
    if (!code.trim()) {
      showToast('Please enter a promo code', 'warning');
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), tier }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setAppliedPromo({
          code: data.code,
          discount: data.discount_type === 'percentage'
            ? `${data.discount_value}% off`
            : data.discount_type === 'free_months'
            ? `${data.discount_value} free month${data.discount_value > 1 ? 's' : ''}`
            : `$${(data.discount_value / 100).toFixed(2)} off`,
        });
        onPromoApplied({
          type: data.discount_type,
          value: data.discount_value,
          code: data.code,
        });
        showToast(`Promo code applied! ${appliedPromo?.discount}`, 'success');
      } else {
        showToast(data.error || 'Invalid promo code', 'error');
      }
    } catch (error) {
      console.error('Promo code validation error:', error);
      showToast('Failed to validate promo code', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setCode('');
    onPromoApplied({ type: '', value: 0, code: '' });
    showToast('Promo code removed', 'info');
  };

  if (appliedPromo) {
    return (
      <div
        className="flex items-center justify-between p-4 rounded-xl border-2 animate-scaleIn"
        style={{
          backgroundColor: '#ECFDF5',
          borderColor: '#10B981',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#10B981' }}
          >
            <svg className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#065F46' }}>
              {appliedPromo.code}
            </p>
            <p className="text-xs" style={{ color: '#059669' }}>
              {appliedPromo.discount} applied
            </p>
          </div>
        </div>
        <button
          onClick={removePromo}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#059669' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D1FAE5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" style={{ color: '#4A5568' }}>
        Have a promo code?
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && validatePromoCode()}
          placeholder="Enter code"
          disabled={isValidating}
          className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E2E8F0',
            color: '#2D3748',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#9EDCE1'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
        />
        <button
          onClick={validatePromoCode}
          disabled={isValidating || !code.trim()}
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#9EDCE1',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(158, 220, 225, 0.3)',
          }}
          onMouseEnter={(e) => {
            if (!isValidating && code.trim()) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(158, 220, 225, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(158, 220, 225, 0.3)';
          }}
        >
          {isValidating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Checking...
            </span>
          ) : (
            'Apply'
          )}
        </button>
      </div>
    </div>
  );
}
