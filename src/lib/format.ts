export function formatPrice(amount: number, currency: string = 'INR'): string {
  const symbol = currency === 'INR' ? '\u20B9' : currency === 'USD' ? '$' : '';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${symbol}${formatted}`;
}

export function formatPriceDecimal(amount: number, currency: string = 'INR'): string {
  const symbol = currency === 'INR' ? '\u20B9' : currency === 'USD' ? '$' : '';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

export function calcDiscountPercent(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
