import { call } from 'redux-saga/effects'
import createPaymentFactory from './createPayment'

const feeResult = {
  'limits': {
    'min': 2,
    'max': 9
  },
  'priority': 6,
  'regular': 5
}

describe('createPayment', () => {
  let api = { getBitcoinFee: () => {} }
  let createPayment = createPaymentFactory({ api })
  let payment = createPayment()

  describe('*init', () => {
    it('should fetch fee values and set to value.fees', () => {
      let gen = payment.init()
      expect(gen.next().value).toEqual(call(api.getBitcoinFee))
      expect(gen.next(feeResult).value.value().fees).toEqual(feeResult)
      expect(gen.next().done).toEqual(true)
    })
  })
})
