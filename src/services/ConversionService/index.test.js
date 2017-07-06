import { convertToBitcoin, convertToCurrency } from 'index.js'
import Maybe from 'data.maybe'

var testCases = [
  {
    amount: 199132,
    unit: '',
    value: Maybe.Nothing()
  },
  {
    amount: '199132',
    unit: 'BTC',
    value: Maybe.Nothing()
  },
  {
    amount: 199132,
    unit: 'BTC',
    value: Maybe.Just('0.00199132 BTC')
  },
  {
    amount: 199132,
    unit: 'MBC',
    value: Maybe.Just('1.99132 mBTC')
  },
  {
    amount: 199132,
    unit: 'UBC',
    value: Maybe.Just('1991.32 bits')
  }
]

testCases.forEach(function (testCase) {
  test('Converts correct bitcoin amount', () => {
    expect(convertToBitcoin(testCase.amount, testCase.unit)).toEqual(testCase.value)
  })
})

testCases = [
  {
    amount: '100000000',
    currency: 'GBP',
    rates: {
      'GBP': {'last': 2158.18, 'symbol': '£'}
    },
    value: Maybe.Nothing()
  },
  {
    amount: 100000000,
    currency: 'GBP',
    rates: {
      'GBP': {'last': '2158.18', 'symbol': '£'}
    },
    value: Maybe.Nothing()
  },
  {
    amount: 100000000,
    currency: 'EUR',
    rates: {
      'GBP': {'last': 2158.18, 'symbol': '£'}
    },
    value: Maybe.Nothing()
  },
  {
    amount: 100000000,
    currency: 'GBP',
    rates: {
      'GBP': {'last': 2158.18, 'symbol': '£'}
    },
    value: Maybe.Just('2158.18 £')
  }
]

testCases.forEach(function (testCase) {
  test('Converts correct currency amount', function () {
    expect(convertToCurrency(testCase.amount, testCase.currency, testCase.rates)).toEqual(testCase.value)
  })
})
