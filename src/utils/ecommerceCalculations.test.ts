import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertPrice,
  formatPrice,
  calculateOrderTotals,
  calculateDropshipPrice,
  calculateSellerCommission,
  checkCodEligibility,
} from './ecommerceCalculations';
import { CurrencyConfig } from '../types';

const mockUSD: CurrencyConfig = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
  rate: 1.0,
  decimals: 2,
  markupPercent: 0,
  symbolPosition: 'before',
  isEnabled: true,
  isSettlementCurrency: true,
  flag: '🇺🇸',
};

const mockMYR: CurrencyConfig = {
  code: 'MYR',
  symbol: 'RM',
  name: 'Malaysian Ringgit',
  rate: 4.45,
  decimals: 2,
  markupPercent: 2.0, // 2% exchange markup
  symbolPosition: 'before',
  isEnabled: true,
  isSettlementCurrency: true,
  flag: '🇲🇾',
};

test('convertPrice converts correctly with markup and decimals', () => {
  const convertedUSD = convertPrice(100, mockUSD);
  assert.equal(convertedUSD, 100);

  // 100 * 4.45 = 445; 445 * 1.02 = 453.9
  const convertedMYR = convertPrice(100, mockMYR);
  assert.equal(convertedMYR, 453.9);
});

test('formatPrice formats with symbol in right position', () => {
  assert.equal(formatPrice(100, mockUSD), '$100.00');
  assert.equal(formatPrice(100, mockMYR), 'RM453.90');

  const mockEUR: CurrencyConfig = {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 0.92,
    decimals: 2,
    markupPercent: 0,
    symbolPosition: 'after',
    isEnabled: true,
    isSettlementCurrency: true,
    flag: '🇪🇺',
  };
  assert.equal(formatPrice(100, mockEUR), '92.00 €');
});

test('calculateOrderTotals applies discounts, free shipping thresholds, and tax', () => {
  // Items total $100 (< 150 threshold => shipping $15)
  // discount 10% on $100 = $10 => taxable $90 => 6% tax = $5.40
  // total = 90 + 15 + 5.40 = 110.40
  const result = calculateOrderTotals({
    items: [
      { price: 50, quantity: 1 },
      { price: 25, quantity: 2 },
    ],
    couponDiscountPercent: 10,
    taxRatePercent: 6,
  });

  assert.equal(result.subtotal, 100);
  assert.equal(result.discountAmount, 10);
  assert.equal(result.shippingFee, 15);
  assert.equal(result.taxAmount, 5.4);
  assert.equal(result.total, 110.4);
});

test('calculateOrderTotals gives free shipping over $150 and adds COD fee if applicable', () => {
  const result = calculateOrderTotals({
    items: [{ price: 200, quantity: 1 }],
    taxRatePercent: 10,
    isCod: true,
    codFee: 5,
  });

  assert.equal(result.subtotal, 200);
  assert.equal(result.shippingFee, 0); // free over 150
  assert.equal(result.taxAmount, 20);
  assert.equal(result.codFee, 5);
  assert.equal(result.total, 225);
});

test('calculateDropshipPrice computes retail price with margin and profit', () => {
  // supplierCost 30 + shippingEstimate 5 = 35 baseCost.
  // 35 * 1.5 (50% markup) = 52.5 + 2 fixed fee = 54.5. Ceil - 0.01 = 54.99.
  const res = calculateDropshipPrice(30, 5, 50, 2);
  assert.equal(res.sellingPrice, 54.99);
  assert.equal(res.grossProfit, 19.99);
  assert.ok(res.marginPercent > 30);
});

test('calculateSellerCommission properly divides vendor earnings', () => {
  // $100 order, 10% commission + $0.50 fixed fee = $10.50 commission, $89.50 vendor net
  const res = calculateSellerCommission(100, 10, 0.5);
  assert.equal(res.commissionAmount, 10.5);
  assert.equal(res.sellerNetPayout, 89.5);
});

test('checkCodEligibility enforces country and limit bounds', () => {
  const config = {
    isEnabled: true,
    maxLimitUSD: 500,
    allowedCountries: ['Malaysia', 'United States', 'Singapore'],
  };

  const valid = checkCodEligibility(120, 'Malaysia', config);
  assert.equal(valid.isEligible, true);

  const tooHigh = checkCodEligibility(600, 'Malaysia', config);
  assert.equal(tooHigh.isEligible, false);

  const countryBlocked = checkCodEligibility(120, 'Germany', config);
  assert.equal(countryBlocked.isEligible, false);
});
