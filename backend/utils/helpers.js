/**
 * Generate a unique trip number format TRIP-YYYYMMDD-XXXX
 * @returns {string}
 */
export const generateTripNumber = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TRIP-${dateStr}-${randomNum}`;
};

/**
 * Check if a date is in the past compared to today (date-only comparison)
 * @param {string|Date} dateVal 
 * @returns {boolean}
 */
export const isPastDate = (dateVal) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(dateVal);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};
