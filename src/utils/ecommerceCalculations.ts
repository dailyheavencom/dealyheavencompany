import { CurrencyConfig } from '../types';

/**
 * Multi-currency conversion with markup and rounding
 */
export function convertPrice(
  basePriceUSD: number,
  currency: CurrencyConfig
): number {
  if (!currency || basePriceUSD <= 0) return 0;
  // Apply currency exchange rate
  const converted = basePriceUSD * currency.rate;
  // Apply owner markup if any (e.g. 1.5% buffer)
  const withMarkup = converted * (1 + (currency.markupPercent || 0) / 100);
  // Round to currency decimals
  const factor = Math.pow(10, currency.decimals ?? 2);
  return Math.round(withMarkup * factor) / factor;
}

/**
 * Format currency price string
 */
export function formatPrice(
  amountInUSD: number,
  currency: CurrencyConfig
): string {
  if (!currency) return `$${amountInUSD.toFixed(2)}`;
  const converted = convertPrice(amountInUSD, currency);
  const formattedNumber = converted.toLocaleString(undefined, {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });

  return currency.symbolPosition === 'after'
    ? `${formattedNumber} ${currency.symbol}`
    : `${currency.symbol}${formattedNumber}`;
}

export interface OrderCalculationInput {
  items: { price: number; quantity: number }[];
  couponDiscountPercent?: number;
  shippingFee?: number;
  taxRatePercent?: number;
  isCod?: boolean;
  codFee?: number;
}

export interface OrderCalculationResult {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  codFee: number;
  total: number;
}

/**
 * Calculate full breakdown of order financials
 */
export function calculateOrderTotals(
  input: OrderCalculationInput
): OrderCalculationResult {
  const subtotal = input.items.reduce(
    (sum, item) => sum + Math.max(0, item.price) * Math.max(1, item.quantity),
    0
  );

  const discountPercent = Math.min(100, Math.max(0, input.couponDiscountPercent || 0));
  const discountAmount = Math.round((subtotal * (discountPercent / 100)) * 100) / 100;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);

  const shippingFee = input.shippingFee ?? (subtotal > 150 ? 0 : 15); // Free shipping over $150
  const taxRate = Math.max(0, input.taxRatePercent ?? 6); // standard 6%
  const taxAmount = Math.round((taxableSubtotal * (taxRate / 100)) * 100) / 100;

  const codFee = input.isCod ? (input.codFee ?? 5) : 0;
  const total = Math.max(0, Math.round((taxableSubtotal + shippingFee + taxAmount + codFee) * 100) / 100);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount,
    shippingFee,
    taxAmount,
    codFee,
    total,
  };
}

/**
 * Dropshipping markup and margin calculation
 */
export function calculateDropshipPrice(
  supplierCost: number,
  shippingEstimate: number,
  markupPercent: number,
  fixedHandlingFee: number = 0
): { sellingPrice: number; grossProfit: number; marginPercent: number } {
  const baseCost = Math.max(0, supplierCost) + Math.max(0, shippingEstimate);
  const markupMultiplier = 1 + Math.max(0, markupPercent) / 100;
  const rawPrice = (baseCost * markupMultiplier) + fixedHandlingFee;
  // Psychological round to .99 or clean decimal
  const sellingPrice = Math.ceil(rawPrice) - 0.01 > 0 ? Number((Math.ceil(rawPrice) - 0.01).toFixed(2)) : Number(rawPrice.toFixed(2));
  const grossProfit = Number((sellingPrice - baseCost).toFixed(2));
  const marginPercent = sellingPrice > 0 ? Number(((grossProfit / sellingPrice) * 100).toFixed(1)) : 0;

  return {
    sellingPrice,
    grossProfit,
    marginPercent,
  };
}

/**
 * Calculate marketplace seller commission and payout
 */
export function calculateSellerCommission(
  itemTotal: number,
  commissionPercent: number,
  fixedFee: number = 0.5
): { commissionAmount: number; sellerNetPayout: number } {
  const safeTotal = Math.max(0, itemTotal);
  const percentDeduction = safeTotal * (Math.max(0, commissionPercent) / 100);
  const totalCommission = Math.min(safeTotal, percentDeduction + fixedFee);
  const sellerNet = Math.max(0, safeTotal - totalCommission);

  return {
    commissionAmount: Number(totalCommission.toFixed(2)),
    sellerNetPayout: Number(sellerNet.toFixed(2)),
  };
}

/**
 * COD Eligibility verification
 */
export function checkCodEligibility(
  orderTotalUSD: number,
  country: string,
  config: {
    isEnabled: boolean;
    maxLimitUSD: number;
    allowedCountries: string[];
  }
): { isEligible: boolean; reason?: string } {
  if (!config.isEnabled) {
    return { isEligible: false, reason: 'Cash on Delivery is currently disabled by store administration.' };
  }
  if (!config.allowedCountries.some(c => c.toLowerCase() === country.toLowerCase())) {
    return { isEligible: false, reason: `COD is not supported in ${country}. Available in select regions.` };
  }
  if (orderTotalUSD > config.maxLimitUSD) {
    return { isEligible: false, reason: `Order exceeds maximum COD limit of $${config.maxLimitUSD}. Please use online payment.` };
  }
  if (orderTotalUSD < 10) {
    return { isEligible: false, reason: 'Minimum order amount for COD is $10.00.' };
  }
  return { isEligible: true };
}
