/**
 * Country → Currency configuration
 * This is the single source of truth
 * Used for:
 * - Contract display
 * - User balance display
 * - Transactions
 */

module.exports = {
    Belgium: {
        currency: 'EUR',
        symbol: '€',
    },
    Denmark: {
        currency: 'DKK',
        symbol: 'kr',
    },
    Germany: {
        currency: 'EUR',
        symbol: '€',
    },
    Italy: {
        currency: 'EUR',
        symbol: '€',
    },
    Portugal: {
        currency: 'EUR',
        symbol: '€',
    },
    Spain: {
        currency: 'EUR',
        symbol: '€',
    },
    'United Kingdom': {
        currency: 'GBP',
        symbol: '£',
    },
    Canada: {
        currency: 'CAD',
        symbol: '$',
    },
    Mexico: {
        currency: 'MXN',
        symbol: '$',
    },
    'United States': {
        currency: 'USD',
        symbol: '$',
    },
    Brazil: {
        currency: 'BRL',
        symbol: 'R$',
    },
    Ecuador: {
        currency: 'USD',
        symbol: '$',
    },

    // ✅ NEW COUNTRIES
    'South Africa': {
        currency: 'ZAR',
        symbol: 'R',
    },
    'Papua New Guinea': {
        currency: 'PGK',
        symbol: 'K',
    },
};