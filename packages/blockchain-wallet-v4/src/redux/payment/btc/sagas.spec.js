import { call } from 'redux-saga/effects'
import createPaymentFactory from './sagas'
import { FROM } from './utils'
import { prop } from 'ramda'

const feeResult = {
  limits: {
    min: 2,
    max: 9
  },
  priority: 6,
  regular: 5
}

const network = {
  pubKeyHash: 0,
  scriptHash: 5,
  wif: 128,
  bip32: {}
}

const AMOUNT = 157228

const FROM_INDEX = 0

const PASSWORD_VALUE = 'password'

const TO_ADDRESS = '1LiASK9MawXo9SppMn3RhfWUvHKW2ZHxFx'

const FROM_DATA = {
  change: 'change_address',
  from: ['xpub'],
  fromAccountIdx: FROM_INDEX,
  fromType: FROM.ACCOUNT
}

const FEE_VALUE = 50

const p = {
  fees: feeResult,
  fromType: null,
  selection: []
}

describe('createPayment', () => {
  let api = { getBitcoinFee: () => feeResult }
  let {
    create,
    calculateTo,
    calculateAmount,
    calculateEffectiveBalance,
    calculateFee,
    calculateFrom,
    calculateSelection,
    calculateSignature,
    calculateSweepSelection,
    getWalletUnspent
  } = createPaymentFactory({ api })
  let payment = create({ network, payment: p })

  describe('*init', () => {
    it('should fetch fee values and set to value.fees', () => {
      let gen = payment.init()
      expect(gen.next().value).toEqual(call(api.getBitcoinFee))
      expect(gen.next(feeResult).value.value().fees).toEqual(feeResult)
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*to', () => {
    it('should call calculateTo', () => {
      let gen = payment.to(TO_ADDRESS)
      expect(gen.next().value).toEqual(call(calculateTo, TO_ADDRESS, network))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*amount', () => {
    it('should call calculateAmount', () => {
      let gen = payment.amount(AMOUNT)
      expect(gen.next().value).toEqual(call(calculateAmount, AMOUNT))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*from', () => {
    it('should set from', () => {
      let gen = payment.from(FROM_INDEX)
      expect(gen.next().value).toEqual(call(calculateFrom, FROM_INDEX, network))
      expect(gen.next(FROM_DATA).value).toEqual(call(getWalletUnspent, network, FROM_DATA))
    })
  })

  describe('*fee', () => {
    it('should set the fee', () => {
      let gen = payment.fee(FEE_VALUE)
      expect(gen.next().value).toEqual(call(calculateFee, FEE_VALUE, prop('fees', p)))
      expect(gen.next(FEE_VALUE).value).toEqual(call(calculateEffectiveBalance, {
        undefined,
        fee: FEE_VALUE
      }))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*build', () => {
    it('should call calculateSelection', () => {
      let gen = payment.build()
      expect(gen.next().value).toEqual(call(calculateSelection, p))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*buildSweep', () => {
    it('should call calculateSweepSelection', () => {
      let gen = payment.buildSweep()
      expect(gen.next().value).toEqual(call(calculateSweepSelection, p))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*sign', () => {
    it('should call calculateSignature', () => {
      let gen = payment.sign(PASSWORD_VALUE)
      expect(gen.next(PASSWORD_VALUE).value).toEqual(call(calculateSignature, network, PASSWORD_VALUE, prop('fromType', p), prop('selection', p)))
      expect(gen.next().done).toEqual(true)
    })
  })

})
