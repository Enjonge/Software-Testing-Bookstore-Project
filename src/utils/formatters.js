// src/utils/formatters.js
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

export const formatPrice = (amount) => {
  return `KSh ${amount.toLocaleString()}`;
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};