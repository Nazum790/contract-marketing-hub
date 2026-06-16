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

    'Saudi Arabia': {
        currency: 'SAR',
        symbol: '﷼',
        phone: {
            code: '+966',
            minLength: 9,
            maxLength: 9,
        },
    },

    'United Arab Emirates': {
        currency: 'AED',
        symbol: 'د.إ',
        phone: {
            code: '+971',
            minLength: 9,
            maxLength: 9,
        },
    },

    France: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+33',
            minLength: 9,
            maxLength: 9,
        },
    },

    Netherlands: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+31',
            minLength: 9,
            maxLength: 9,
        },
    },

    Sweden: {
        currency: 'SEK',
        symbol: 'kr',
        phone: {
            code: '+46',
            minLength: 9,
            maxLength: 9,
        },
    },

    Norway: {
        currency: 'NOK',
        symbol: 'kr',
        phone: {
            code: '+47',
            minLength: 8,
            maxLength: 8,
        },
    },

    Finland: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+358',
            minLength: 9,
            maxLength: 10,
        },
    },

    Austria: {
        currency: 'EUR',
        symbol: '€',
        phone: {
            code: '+43',
            minLength: 10,
            maxLength: 11,
        },
    },

    Switzerland: {
        currency: 'CHF',
        symbol: 'CHF',
        phone: {
            code: '+41',
            minLength: 9,
            maxLength: 9,
        },
    },

    Australia: {
        currency: 'AUD',
        symbol: '$',
        phone: {
            code: '+61',
            minLength: 9,
            maxLength: 9,
        },
    },

    'New Zealand': {
        currency: 'NZD',
        symbol: '$',
        phone: {
            code: '+64',
            minLength: 9,
            maxLength: 9,
        },
    },
};