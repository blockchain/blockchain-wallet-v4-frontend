import { convertToBitcoin, convertToCurrency } from './conversionService'

var testCases = [
  {
    amount: 199132,
    unit: '',
    result: { success: false, amount: 0, unit: '', value: '' }
  },
  {
    amount: '199132',
    unit: 'BTC',
    result: { success: false, amount: 0, unit: '', value: '' }
  },
  {
    amount: 199132,
    unit: 'BTC',
    result: { success: true, amount: 0.00199132, unit: 'BTC', value: '0.00199132 BTC' }
  },
  {
    amount: 199132,
    unit: 'MBC',
    result: { success: true, amount: 1.99132, unit: 'mBTC', value: '1.99132 mBTC' }
  },
  {
    amount: 199132,
    unit: 'UBC',
    result: { success: true, amount: 1991.32, unit: 'bits', value: '1991.32 bits' }
  }
]

testCases.forEach(function (testCase) {
  test('Converts correct bitcoin amount', () => {
    expect(convertToBitcoin(testCase.amount, testCase.unit)).toEqual(testCase.result)
  })
})

testCases = [
  {
    amount: '100000000',
    currency: 'GBP',
    rates: {
      'GBP': {'last': 2158.18, 'symbol': '£'}
    },
    result: { success: false, amount: 0, currency: '', value: '' }
  },
  {
    amount: 100000000,
    currency: 'GBP',
    rates: {
      'GBP': {'last': '2158.18', 'symbol': '£'}
    },
    result: { success: false, amount: 0, currency: '', value: '' }
  },
  {
    amount: 100000000,
    currency: 'EUR',
    rates: {
      'GBP': {'last': 2158.18, 'symbol': '£'}
    },
    result: { success: false, amount: 0, currency: '', value: '' }
  },
  {
    amount: 100000000,
    currency: 'GBP',
    rates: {
      'GBP': {'last': 2158.18, 'symbol': '£'}
    },
    result: { success: true, amount: 2158.18, currency: '£', value: '2158.18 £' }
  }
]

testCases.forEach(function (testCase) {
  test('Converts correct currency amount', function () {
    expect(convertToCurrency(testCase.amount, testCase.currency, testCase.rates)).toEqual(testCase.result)
  })
})
