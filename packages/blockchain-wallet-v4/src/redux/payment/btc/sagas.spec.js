import { call, select } from 'redux-saga/effects'
import createPaymentFactory from './sagas'
import { FROM } from './utils'
import { prop } from 'ramda'
import * as S from '../../selectors'
import { btc } from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'

jest.mock('../../../signer')
jest.mock('../../../coinSelection')
jest.mock('../../../coinSelection/coin')

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

const CHANGE_ADDRESS = '1BzILT4NbxZp4TeeNM2TjdCUvHKW2ZHxFx'
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

const SELECT_ALL_RESULT = { outputs: [{ value: EFFECTIVE_BALANCE_AMOUNT }] }

btc.signWithWIF.mockImplementation(() => true)
CoinSelection.selectAll.mockImplementation(() => {
  return SELECT_ALL_RESULT
})
CoinSelection.descentDraw.mockImplementation(() => true)
Coin.fromJS.mockImplementation(() => true)

let api = { getBitcoinFee: () => feeResult }

describe('createPayment', () => {
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
      expect(
        () => result.next()
      ).toThrow(new Error('unknown_from'))
    })
    it('should throw if no selection is passed', () => {
      let result = calculateSignature(network, PASSWORD_VALUE, FROM.WATCH_ONLY, undefined)
      expect(
        () => result.next()
      ).toThrow(new Error('missing_selection'))
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

  describe('calculateSweepSelection', () => {
    it('should throw if missing to', () => {
      expect(() => calculateSweepSelection({
        to: undefined,
        fee: FEE_VALUE,
        coins: [],
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_to'))
    })
    it('should throw if to length does not equal 1', () => {
      expect(() => calculateSweepSelection({
        to: TO_ADDRESS,
        fee: FEE_VALUE,
        coins: [],
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('can_only_sweep_to_one_target'))
    })
    it('should throw if fee is not positive integer', () => {
      expect(() => calculateSweepSelection({
        to: [TO_ADDRESS],
        fee: undefined,
        coins: [],
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_fee_per_byte'))
    })
    it('should throw if coins isNil', () => {
      expect(() => calculateSweepSelection({
        to: [TO_ADDRESS],
        fee: FEE_VALUE,
        coins: undefined,
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_coins'))
    })
    it('should throw if effectiveBalance is zero', () => {
      expect(() => calculateSweepSelection({
        to: [TO_ADDRESS],
        fee: FEE_VALUE,
        coins: ['coin'],
        effectiveBalance: 0
      })).toThrowError(new Error('empty_addresses'))
    })
    it('should return CoinSelection.selectAll if all conditions are met', () => {
      expect(calculateSweepSelection({
        to: [TO_ADDRESS],
        fee: FEE_VALUE,
        coins: ['coin'],
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toBe(SELECT_ALL_RESULT)
    })
  })

  describe('calculateSelection', () => {
    it('should throw if missing to', () => {
      expect(() => calculateSelection({
        to: undefined,
        amount: AMOUNT,
        fee: FEE_VALUE,
        coins: [],
        change: CHANGE_ADDRESS,
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_to'))
    })
    it('should throw if missing amount', () => {
      expect(() => calculateSelection({
        to: TO_ADDRESS,
        amount: undefined,
        fee: FEE_VALUE,
        coins: [],
        change: CHANGE_ADDRESS,
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_amount'))
    })
    it('should throw if missing fee', () => {
      expect(() => calculateSelection({
        to: TO_ADDRESS,
        amount: AMOUNT,
        fee: undefined,
        coins: [],
        change: CHANGE_ADDRESS,
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_fee_per_byte'))
    })
    it('should throw if missing coins', () => {
      expect(() => calculateSelection({
        to: TO_ADDRESS,
        amount: AMOUNT,
        fee: FEE_VALUE,
        coins: undefined,
        change: CHANGE_ADDRESS,
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_coins'))
    })
    it('should throw if effective balance is zero', () => {
      expect(() => calculateSelection({
        to: TO_ADDRESS,
        amount: AMOUNT,
        fee: FEE_VALUE,
        coins: ['coin'],
        change: CHANGE_ADDRESS,
        effectiveBalance: 0
      })).toThrowError(new Error('empty_addresses'))
    })
    it('should throw if missing change address', () => {
      expect(() => calculateSelection({
        to: TO_ADDRESS,
        amount: AMOUNT,
        fee: FEE_VALUE,
        coins: ['coin'],
        change: undefined,
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toThrowError(new Error('missing_change_address'))
    })
    it('should return CoinSelection.descentDraw if all conditions are met', () => {
      expect(calculateSelection({
        to: TO_ADDRESS,
        amount: AMOUNT,
        fee: FEE_VALUE,
        coins: ['coin'],
        change: CHANGE_ADDRESS,
        effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
      })).toBe(true)
    })
  })

  describe('calculatePublish', () => {
    it('should throw if no txHex', () => {
      let result = calculatePublish()
      expect(
        () => result.next()
      ).toThrow(new Error('missing_signed_tx'))
    })
  })

  describe('calculateFee', () => {
    it('should return the fee', () => {
      expect(
        calculateFee(FEE_VALUE, p.fees)
      ).toBe(FEE_VALUE)
    })
    it('should use the payment fees object to get the fee if string is passed', () => {
      expect(
        calculateFee('regular', p.fees)
      ).toBe(feeResult.regular)
    })
    it('should throw if fee is not passed', () => {
      expect(
        () => calculateFee(undefined, p.fees)
      ).toThrow(new Error('no_fee_set'))
    })
  })
})
