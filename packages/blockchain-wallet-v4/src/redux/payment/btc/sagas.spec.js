import { call, select } from 'redux-saga/effects'
import createPaymentFactory from './sagas'
import { ADDRESS_TYPES } from './utils'
import { prop } from 'ramda'
import * as S from '../../selectors'
import { btc } from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'

jest.mock('../../selectors')
jest.mock('../../../signer')
jest.mock('../../../coinSelection')
jest.mock('../../../coinSelection/coin')

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

const FEE_VALUE = 50
const EFFECTIVE_BALANCE_AMOUNT = 100000
const AMOUNT = 157228
const ADDRESS_TYPES_INDEX = 0
const PASSWORD_VALUE = 'password'
const TRANSPORT_VALUE = undefined
const SCRAMBLEKEY_VALUE = 'K3Y'
const CHANGE_ADDRESS = '1BzILT4NbxZp4TeeNM2TjdCUvHKW2ZHxFx'
const TO_ADDRESS = '1LiASK9MawXo9SppMn3RhfWUvHKW2ZHxFx'
const ADDRESS_TYPES_DATA = {
  change: 'change_address',
  from: ['xpub'],
  fromAccountIdx: ADDRESS_TYPES_INDEX,
  fromType: ADDRESS_TYPES.ACCOUNT
}

const p = {
  fees: feeResult,
  fromType: ADDRESS_TYPES.ACCOUNT,
  selection: [],
  txHex: 'txHex'
}

const STUB_TYPE = ADDRESS_TYPES.ACCOUNT

const SELECT_ALL_RESULT = { outputs: [{ value: EFFECTIVE_BALANCE_AMOUNT }] }

S.wallet.getWrapper.mockImplementation(() => {})
S.wallet.getWallet.mockImplementation(() => 1)
btc.signWithWIF.mockImplementation(() => true)
CoinSelection.selectAll.mockImplementation(() => {
  return SELECT_ALL_RESULT
})
CoinSelection.descentDraw.mockImplementation(() => true)
Coin.fromJS.mockImplementation(() => true)

let api = { getBtcFees: () => feeResult }

describe('createPayment', () => {
  const securityModule = {}

  let {
    create,
    __calculateTo,
    __calculateAmount,
    __calculateEffectiveBalance,
    __calculateFee,
    __calculateFrom,
    __calculatePublish,
    __calculateSelection,
    __calculateSignature,
    __calculateSweepSelection,
    __getWalletUnspent
  } = createPaymentFactory({ api, securityModule })
  let payment = create({ network, payment: p })

  describe('*init', () => {
    it('should fetch fee values and set to value.fees', () => {
      let gen = payment.init()
      expect(gen.next().value).toEqual(call(api.getBtcFees))
      expect(gen.next(feeResult).value.value().fees).toEqual(feeResult)
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*to', () => {
    it('should call calculateTo', () => {
      let gen = payment.to(TO_ADDRESS, STUB_TYPE)
      expect(gen.next().value).toEqual(
        call(__calculateTo, TO_ADDRESS, STUB_TYPE, network)
      )
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*amount', () => {
    it('should call calculateAmount', () => {
      let gen = payment.amount(AMOUNT)
      expect(gen.next().value).toEqual(call(__calculateAmount, AMOUNT))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*from', () => {
    it('should set from', () => {
      let gen = payment.from(ADDRESS_TYPES_INDEX, STUB_TYPE)
      expect(gen.next().value).toEqual(
        call(__calculateFrom, ADDRESS_TYPES_INDEX, STUB_TYPE, network)
      )
      expect(gen.next(ADDRESS_TYPES_DATA).value).toEqual(
        call(__getWalletUnspent, network, ADDRESS_TYPES_DATA)
      )
    })
  })

  describe('*fee', () => {
    it('should set the fee', () => {
      let gen = payment.fee(FEE_VALUE)
      expect(gen.next().value).toEqual(
        call(__calculateFee, FEE_VALUE, prop('fees', p))
      )
      expect(gen.next(FEE_VALUE).value).toEqual(
        call(__calculateEffectiveBalance, {
          undefined,
          fee: FEE_VALUE
        })
      )
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*build', () => {
    it('should call calculateSelection', () => {
      let gen = payment.build()
      expect(gen.next().value).toEqual(call(__calculateSelection, p))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*buildSweep', () => {
    it('should call calculateSweepSelection', () => {
      let gen = payment.buildSweep()
      expect(gen.next().value).toEqual(call(__calculateSweepSelection, p))
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*sign', () => {
    it('should call calculateSignature', () => {
      let gen = payment.sign(PASSWORD_VALUE, TRANSPORT_VALUE, SCRAMBLEKEY_VALUE)
      expect(gen.next(PASSWORD_VALUE).value).toEqual(
        call(
          __calculateSignature,
          securityModule,
          network,
          PASSWORD_VALUE,
          TRANSPORT_VALUE,
          SCRAMBLEKEY_VALUE,
          prop('fromType', p),
          prop('selection', p),
          prop('changeIndex', p)
        )
      )
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('*publish', () => {
    it('should call calculatePublish', () => {
      let gen = payment.publish()
      expect(gen.next().value).toEqual(
        call(__calculatePublish, prop('txHex', p))
      )
      gen.next()
      expect(gen.next().done).toEqual(true)
    })
  })

  describe('calculateSignature', () => {
    it('should follow the ADDRESS_TYPES.ACCOUNT case', () => {
      let WRAPPER_VALUE = {}
      let result = __calculateSignature(
        securityModule,
        network,
        PASSWORD_VALUE,
        TRANSPORT_VALUE,
        SCRAMBLEKEY_VALUE,
        ADDRESS_TYPES.ACCOUNT,
        prop('selection', p)
      )
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next(WRAPPER_VALUE).value).toBeTruthy()
      expect(result.next().done).toEqual(true)
    })
    it('should follow the ADDRESS_TYPES.LEGACY case', () => {
      let WRAPPER_VALUE = {}
      let result = __calculateSignature(
        securityModule,
        network,
        PASSWORD_VALUE,
        TRANSPORT_VALUE,
        SCRAMBLEKEY_VALUE,
        ADDRESS_TYPES.LEGACY,
        prop('selection', p)
      )
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next(WRAPPER_VALUE).value).toBeTruthy()
      expect(result.next().done).toEqual(true)
    })
    it('should follow the ADDRESS_TYPES.EXTERNAL case', () => {
      let result = __calculateSignature(
        securityModule,
        network,
        PASSWORD_VALUE,
        TRANSPORT_VALUE,
        SCRAMBLEKEY_VALUE,
        ADDRESS_TYPES.EXTERNAL,
        prop('selection', p)
      )
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next().value).toBe(true)
    })
    it('should follow the ADDRESS_TYPES.WATCH_ONLY case', () => {
      let result = __calculateSignature(
        securityModule,
        network,
        PASSWORD_VALUE,
        TRANSPORT_VALUE,
        SCRAMBLEKEY_VALUE,
        ADDRESS_TYPES.WATCH_ONLY,
        prop('selection', p)
      )
      expect(result.next().value).toEqual(select(S.wallet.getWrapper))
      expect(result.next().value).toBe(true)
    })
    it('should throw if no selection is passed', () => {
      let result = __calculateSignature(
        network,
        PASSWORD_VALUE,
        ADDRESS_TYPES.WATCH_ONLY,
        undefined
      )
      expect(() => result.next()).toThrow(new Error('missing_selection'))
    })
  })

  describe('calculateEffectiveBalance', () => {
    it('should return the outputs', () => {
      let result = __calculateEffectiveBalance({ fee: 100, coins: [] })
      expect(result).toBe(EFFECTIVE_BALANCE_AMOUNT)
    })
    it('should return undefined with no fee', () => {
      let result = __calculateEffectiveBalance({ coins: [] })
      expect(result).toBe(undefined)
    })
  })

  describe('calculateSweepSelection', () => {
    it('should throw if missing to', () => {
      expect(() =>
        __calculateSweepSelection({
          to: undefined,
          fee: FEE_VALUE,
          coins: [],
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_to'))
    })
    it('should throw if to length does not equal 1', () => {
      expect(() =>
        __calculateSweepSelection({
          to: TO_ADDRESS,
          fee: FEE_VALUE,
          coins: [],
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('can_only_sweep_to_one_target'))
    })
    it('should throw if fee is not positive integer', () => {
      expect(() =>
        __calculateSweepSelection({
          to: [TO_ADDRESS],
          fee: undefined,
          coins: [],
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_fee_per_byte'))
    })
    it('should throw if coins isNil', () => {
      expect(() =>
        __calculateSweepSelection({
          to: [TO_ADDRESS],
          fee: FEE_VALUE,
          coins: undefined,
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_coins'))
    })
    it('should throw if effectiveBalance is zero', () => {
      expect(() =>
        __calculateSweepSelection({
          to: [TO_ADDRESS],
          fee: FEE_VALUE,
          coins: ['coin'],
          effectiveBalance: 0
        })
      ).toThrowError(new Error('empty_addresses'))
    })
    it('should return CoinSelection.selectAll if all conditions are met', () => {
      expect(
        __calculateSweepSelection({
          to: [TO_ADDRESS],
          fee: FEE_VALUE,
          coins: ['coin'],
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toBe(SELECT_ALL_RESULT)
    })
  })

  describe('calculateSelection', () => {
    it('should throw if missing to', () => {
      expect(() =>
        __calculateSelection({
          to: undefined,
          amount: AMOUNT,
          fee: FEE_VALUE,
          coins: [],
          change: CHANGE_ADDRESS,
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_to'))
    })
    it('should throw if missing amount', () => {
      expect(() =>
        __calculateSelection({
          to: TO_ADDRESS,
          amount: undefined,
          fee: FEE_VALUE,
          coins: [],
          change: CHANGE_ADDRESS,
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_amount'))
    })
    it('should throw if missing fee', () => {
      expect(() =>
        __calculateSelection({
          to: TO_ADDRESS,
          amount: AMOUNT,
          fee: undefined,
          coins: [],
          change: CHANGE_ADDRESS,
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_fee_per_byte'))
    })
    it('should throw if missing coins', () => {
      expect(() =>
        __calculateSelection({
          to: TO_ADDRESS,
          amount: AMOUNT,
          fee: FEE_VALUE,
          coins: undefined,
          change: CHANGE_ADDRESS,
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_coins'))
    })
    it('should throw if effective balance is zero', () => {
      expect(() =>
        __calculateSelection({
          to: TO_ADDRESS,
          amount: AMOUNT,
          fee: FEE_VALUE,
          coins: ['coin'],
          change: CHANGE_ADDRESS,
          effectiveBalance: 0
        })
      ).toThrowError(new Error('empty_addresses'))
    })
    it('should throw if missing change address', () => {
      expect(() =>
        __calculateSelection({
          to: TO_ADDRESS,
          amount: AMOUNT,
          fee: FEE_VALUE,
          coins: ['coin'],
          change: undefined,
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toThrowError(new Error('missing_change_address'))
    })
    it('should return CoinSelection.descentDraw if all conditions are met', () => {
      expect(
        __calculateSelection({
          to: TO_ADDRESS,
          amount: AMOUNT,
          fee: FEE_VALUE,
          coins: ['coin'],
          change: CHANGE_ADDRESS,
          effectiveBalance: EFFECTIVE_BALANCE_AMOUNT
        })
      ).toBe(true)
    })
  })

  describe('calculatePublish', () => {
    it('should throw if no txHex', () => {
      let result = __calculatePublish()
      expect(() => result.next()).toThrow(new Error('missing_signed_tx'))
    })
  })

  describe('calculateFee', () => {
    it('should return the fee', () => {
      expect(__calculateFee(FEE_VALUE, p.fees)).toBe(FEE_VALUE)
    })
    it('should use the payment fees object to get the fee if string is passed', () => {
      expect(__calculateFee('regular', p.fees)).toBe(feeResult.regular)
    })
    it('should throw if fee is not passed', () => {
      expect(() => __calculateFee(undefined, p.fees)).toThrow(
        new Error('no_fee_set')
      )
    })
  })

  describe('calculateAmount', () => {
    it('should return the amounts', () => {
      expect(__calculateAmount(AMOUNT)).toEqual([AMOUNT])
    })
    it('should return the amounts if an array is passed', () => {
      expect(__calculateAmount([AMOUNT, AMOUNT])).toEqual([AMOUNT, AMOUNT])
    })
    it('should throw if amount is invalid', () => {
      expect(() => __calculateAmount('151000')).toThrow(
        new Error('no_amount_set')
      )
    })
  })

  describe('calculateTo', () => {
    it('should return output with the type and address given an address or index', () => {
      let result = __calculateTo(TO_ADDRESS, network)
      result.next()
      expect(result.next().value).toEqual([
        { type: ADDRESS_TYPES.ADDRESS, address: TO_ADDRESS }
      ])
    })
  })
})
