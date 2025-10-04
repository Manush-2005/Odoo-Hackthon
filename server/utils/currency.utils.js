/**
 * Dummy currency conversion utility for testing.
 * Returns a fixed rate of 1 for same currency, or a mock rate for others.
 * @param {string} fromCurrency - The currency to convert from.
 * @param {string} toCurrency - The currency to convert to.
 * @returns {Promise<{ rate: number }>}
 */
export async function fetchCurrencyRates(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
        return { rate: 1 };
    }
    // Mock rates for demonstration
    const mockRates = {
        USD: { EUR: 0.92, INR: 83 },
        EUR: { USD: 1.09, INR: 90 },
        INR: { USD: 0.012, EUR: 0.011 }
    };
    const rate = mockRates[fromCurrency]?.[toCurrency] || 1;
    return { rate };
}