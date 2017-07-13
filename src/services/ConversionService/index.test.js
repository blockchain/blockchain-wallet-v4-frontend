import { convertToCurrency } from './index.js'
import Maybe from 'data.maybe'

const testCases = [
  {
    coin: 'bitcoin',
    amount: 100000000,
    currency: 'EUR',
    rates: { 'GBP': {'last': 2158.18} },
    value: Maybe.Nothing()
  },
  {
    coin: 'bitcoin',
    amount: 100000000,
    currency: 'GBP',
    rates: { 'GBP': {'last': 2158.18} },
    value: Maybe.Just(2158.18)
  }
]

testCases.forEach(function (testCase) {
  test('Converts correct currency amount', function () {
    expect(convertToCurrency(testCase.coin, testCase.amount, testCase.currency, testCase.rates)).toEqual(testCase.value)
  })
})
