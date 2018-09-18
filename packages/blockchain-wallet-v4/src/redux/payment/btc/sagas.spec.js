import { call, select } from 'redux-saga/effects'
import createPaymentFactory from './sagas'
import { FROM } from './utils'
import { prop } from 'ramda'
import * as S from '../../selectors'
import { btc } from '../../../signer'
import * as CoinSelection from '../../../coinSelection'

jest.mock('../../../signer')
jest.mock('../../../coinSelection')

const EFFECTIVE_BALANCE_AMOUNT = 100000

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
  fromType: FROM.ACCOUNT,
  selection: [],
  txHex: 'txHex'
}

btc.signWithWIF.mockImplementation(() => true)
CoinSelection.selectAll.mockImplementation(() => {
  return { outputs: [{ value: EFFECTIVE_BALANCE_AMOUNT }] }
})

describe('createPayment', () => {
  let api = { getBitcoinFee: () => feeResult }
  let {
    create,
    calculateTo,
    calculateAmount,
    calculateEffectiveBalance,
    calculateFee,
    calculateFrom,
    calculatePublish,
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

  describe('*publish', () => {
    it('should call calculatePublish', () => {
      let gen = payment.publish()
      expect(gen.next().value).toEqual(call(calculatePublish, prop('txHex', p)))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('calculateSignature', () => {
    it('should follow the FROM.ACCOUNT case', () => {
      let WRAPPER_VALUE = {}
      let result = calculateSignature(network, PASSWORD_VALUE, FROM.ACCOUNT, prop('selection', p))
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next(WRAPPER_VALUE).value).toBeTruthy()
      expect(result.next().done).toEqual(true)
    })
    it('should follow the FROM.LEGACY case', () => {
      let WRAPPER_VALUE = {}
      let result = calculateSignature(network, PASSWORD_VALUE, FROM.LEGACY, prop('selection', p))
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next(WRAPPER_VALUE).value).toBeTruthy()
      expect(result.next().done).toEqual(true)
    })
    it('should follow the FROM.EXTERNAL case', () => {
      let result = calculateSignature(network, PASSWORD_VALUE, FROM.EXTERNAL, prop('selection', p))
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next().value).toBe(true)
    })
    it('should follow the FROM.WATCH_ONLY case', () => {
      let result = calculateSignature(network, PASSWORD_VALUE, FROM.WATCH_ONLY, prop('selection', p))
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next().value).toBe(true)
    })
    it('should default to throwing an error', () => {
      let result = calculateSignature(network, PASSWORD_VALUE, 'FROM.ERROR', prop('selection', p))
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      // expect(result.next()).toThrow('unkown_from')
    })
  })

  describe('calculateEffectiveBalance', () => {
    it('should return the outputs', () => {
      let result = calculateEffectiveBalance({ fee: 100, coins: [] })
      expect(result).toBe(EFFECTIVE_BALANCE_AMOUNT)
    })
    it('should return undefined with no fee', () => {
      let result = calculateEffectiveBalance({ coins: [] })
      expect(result).toBe(undefined)
    })
  })
})
