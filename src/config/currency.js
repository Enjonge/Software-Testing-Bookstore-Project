export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'KES', symbol: 'Ksh', name: 'Kenyan Shilling' },
];

// Use KES as default or fallback to USD
export const APP_CURRENCY = SUPPORTED_CURRENCIES.find(currency => currency.code === 'KES') || SUPPORTED_CURRENCIES[0];

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `${APP_CURRENCY.symbol}${amount.toFixed(2)}`;
};