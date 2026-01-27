/**
 * Country → Currency & Phone configuration
 * Single source of truth for:
 * - Currency display
 * - Balance display
 * - Phone validation
 */

module.exports = {
    Belgium: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+32',
            minLength: 8,
            maxLength: 9,
        },
    },

    Denmark: {
        currency: 'DKK',
        symbol: 'kr',
        phone: {
            code: '+45',
            minLength: 8,
            maxLength: 8,
        },
    },

    Germany: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+49',
            minLength: 10,
            maxLength: 11,
        },
    },

    Italy: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+39',
            minLength: 9,
            maxLength: 10,
        },
    },

    Portugal: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+351',
            minLength: 9,
            maxLength: 9,
        },
    },

    Spain: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+34',
            minLength: 9,
            maxLength: 9,
        },
    },

    'United Kingdom': {
        currency: 'GBP',
        symbol: '£',
        phone: {
            code: '+44',
            minLength: 10,
            maxLength: 11,
        },
    },

    Canada: {
        currency: 'CAD',
        symbol: '$',
        phone: {
            code: '+1',
            minLength: 10,
            maxLength: 10,
        },
    },

    Mexico: {
        currency: 'MXN',
        symbol: '$',
        phone: {
            code: '+52',
            minLength: 10,
            maxLength: 10,
        },
    },

    'United States': {
        currency: 'USD',
        symbol: '$',
        phone: {
            code: '+1',
            minLength: 10,
            maxLength: 10,
        },
    },

    Brazil: {
        currency: 'BRL',
        symbol: 'R$',
        phone: {
            code: '+55',
            minLength: 10,
            maxLength: 11,
        },
    },

    Ecuador: {
        currency: 'USD',
        symbol: '$',
        phone: {
            code: '+593',
            minLength: 9,
            maxLength: 9,
        },
    },


    'South Africa': {
        currency: 'ZAR',
        symbol: 'R',
        phone: {
            code: '+27',
            minLength: 9,
            maxLength: 9,
        },
    },

    'Papua New Guinea': {
        currency: 'PGK',
        symbol: 'K',
        phone: {
            code: '+675',
            minLength: 7,
            maxLength: 8,
        },
    },
};