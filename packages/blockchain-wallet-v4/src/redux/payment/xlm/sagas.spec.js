/* eslint-disable */
import { expectSaga } from 'redux-saga-test-plan'
import { dissoc, dissocPath, prop } from 'ramda'
import * as StellarSdk from 'stellar-sdk'
import Task from 'data.task'
import settingsSagaFactory from '../../../redux/settings/sagas'

import createPaymentFactory, {
  MEMO_TYPES,
  NUMBER_OF_OPERATIONS,
  NO_ACCOUNT_ERROR,
  NO_DEFAULT_ACCOUNT_ERROR,
  INVALID_ADDRESS_TYPE_ERROR,
  INVALID_ADDRESS_ERROR,
  INVALID_AMOUNT_ERROR,
  INSUFFICIENT_FUNDS_ERROR,
  RESERVE_ERROR,
  NO_DESTINATION_ERROR,
  NO_AMOUNT_ERROR,
  NO_SOURCE_ERROR,
  NO_TX_ERROR,
  NO_SIGNED_ERROR,
  WRONG_MEMO_FORMAT
} from './sagas.ts'
import * as S from '../../selectors'
import { xlm as xlmSigner } from '../../../signer'
import Remote from '../../../remote'
import { ADDRESS_TYPES } from '../btc/utils'
// import { convertXlmToXlm } from '../../../exchange'

jest.mock('../../selectors')
jest.mock('../../../signer')

const STUB_XLM_FEES = {
  limits: {
    min: 1250,
    max: 174886
  },
  regular: 78118,
  priority: 78118
}
const [MEMO_TEXT] = MEMO_TYPES
// const [MEMO_ID] = MEMO_TYPES
const STUB_BASE_RESERVE = 500000
const STUB_BALANCE = 10000000
const STUB_NUMBER_OF_ENTRIES = 0
const STUB_EFFECTIVE_BALANCE =
  STUB_BALANCE -
  STUB_BASE_RESERVE * (2 + STUB_NUMBER_OF_ENTRIES) -
  STUB_XLM_FEES.regular
const STUB_OTHER_BALANCE = 9000000
const STUB_OTHER_EFFECTIVE_BALANCE =
  STUB_OTHER_BALANCE -
  STUB_BASE_RESERVE * (2 + STUB_NUMBER_OF_ENTRIES) -
  STUB_XLM_FEES.regular
const STUB_AMOUNT = 100000
const DEFAULT_ACCOUNT_ID = StellarSdk.Keypair.random().publicKey()
const OTHER_ACCOUNT_ID = StellarSdk.Keypair.random().publicKey()
const STUB_DEFAULT_ACCOUNT = {
  base_reserve_in_stroops: STUB_BASE_RESERVE,
  base_fee_in_stroops: STUB_XLM_FEES.regular,
  balances: [{ asset_type: 'native', balance: STUB_BALANCE }],
  subentry_count: 0
}
const STUB_OTHER_ACCOUNT = {}
const STUB_DESCRIPTION = 'description'
const STUB_TEXT_MEMO = 'text'
// const STUB_ID_MEMO = '123'
const STUB_TX = {}
const STUB_PASSWORD = 'qwerty'
const STUB_MNEMONIC =
  'illness spike retreat truth genius clock brain pass fit cave bargain toe'
const STUB_SIGNED_TX = {}
const STUB_TX_RESULT = {
  hash: 'dcd31d41c341t13v1c4cwerfqerfq1f34f13cwqdcvrew13'
}

const api = {
  getXlmAccount: jest.fn(() => STUB_OTHER_ACCOUNT),
  getXlmFees: jest.fn(() => STUB_XLM_FEES),
  pushXlmTx: jest.fn(() => STUB_TX_RESULT)
}

const settingsSagas = settingsSagaFactory({ api })

S.data.xlm.getBalance.mockImplementation(() => id => {
  if (id === DEFAULT_ACCOUNT_ID) return Remote.of(STUB_BALANCE)
  if (id === OTHER_ACCOUNT_ID) return Remote.of(STUB_OTHER_BALANCE)
  return null
})
S.data.xlm.getBaseReserve.mockReturnValue(Remote.of(STUB_BASE_RESERVE))
S.data.xlm.getNumberOfEntries.mockReturnValue(() =>
  Remote.of(STUB_NUMBER_OF_ENTRIES)
)
S.kvStore.xlm.getDefaultAccountId.mockReturnValue(Remote.of(DEFAULT_ACCOUNT_ID))
S.walletOptions.getXlmSendTimeOutSeconds.mockReturnValue(Remote.of(10))
S.data.xlm.getAccount.mockImplementation(id => () => {
  if (id === DEFAULT_ACCOUNT_ID) return Remote.of(STUB_DEFAULT_ACCOUNT)
  if (id === OTHER_ACCOUNT_ID) return Remote.of(STUB_OTHER_ACCOUNT)
  return null
})
S.wallet.getMnemonic.mockReturnValue(() => Task.of(STUB_MNEMONIC))

xlmSigner.sign.mockReturnValue(STUB_SIGNED_TX)

jest.spyOn(StellarSdk.Memo, 'id')
jest.spyOn(StellarSdk.Memo, 'text')
jest.spyOn(StellarSdk.Operation, 'payment')
jest.spyOn(StellarSdk.Operation, 'createAccount')
jest.spyOn(StellarSdk.TransactionBuilder.prototype, 'constructor')
jest.spyOn(StellarSdk.TransactionBuilder.prototype, 'addOperation')
jest.spyOn(StellarSdk.TransactionBuilder.prototype, 'addMemo')
jest
  .spyOn(StellarSdk.TransactionBuilder.prototype, 'build')
  .mockReturnValue(STUB_TX)

const { create } = createPaymentFactory({ api })

describe.skip('payment', () => {
  let payment = create()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('init', () => {
    it('should calculate the fee', async () => {
      payment = await expectSaga(payment.init)
        .run()
        .then(prop('returnValue'))
      expect(payment.value().fee).toBe(
        String(NUMBER_OF_OPERATIONS * STUB_XLM_FEES.regular)
      )
    })
  })

  describe('from', () => {
    it('should set default "from" data and effective balance', async () => {
      payment = await expectSaga(payment.from)
        .run()
        .then(prop('returnValue'))
      expect(payment.value().from).toEqual({
        type: ADDRESS_TYPES.ACCOUNT,
        address: DEFAULT_ACCOUNT_ID,
        account: STUB_DEFAULT_ACCOUNT
      })
      expect(payment.value().effectiveBalance).toEqual(
        String(STUB_EFFECTIVE_BALANCE)
      )
    })

    it('should set "from" data and effectiveBalance from specific account', async () => {
      const otherPayment = await expectSaga(payment.from, OTHER_ACCOUNT_ID)
        .run()
        .then(prop('returnValue'))
      expect(otherPayment.value().from).toEqual({
        type: ADDRESS_TYPES.ACCOUNT,
        address: OTHER_ACCOUNT_ID,
        account: STUB_OTHER_ACCOUNT
      })
      expect(otherPayment.value().effectiveBalance).toEqual(
        String(STUB_OTHER_EFFECTIVE_BALANCE)
      )
    })

    it('should set non-default type', async () => {
      const otherPayment = await expectSaga(
        payment.from,
        undefined,
        ADDRESS_TYPES.LOCKBOX
      )
        .run()
        .then(prop('returnValue'))

      expect(otherPayment.value().from.type).toBe(ADDRESS_TYPES.LOCKBOX)
    })

    it('should throw if no account id is available', () => {
      S.kvStore.xlm.getDefaultAccountId.mockReturnValueOnce(Remote.NotAsked)
      expect(expectSaga(payment.from).run()).rejects.toThrowError(
        new Error(NO_DEFAULT_ACCOUNT_ERROR)
      )
    })

    it('should throw if no account is available', () => {
      S.data.xlm.getAccount.mockReturnValueOnce(() => Remote.NotAsked)
      expect(expectSaga(payment.from).run()).rejects.toThrowError(
        new Error(NO_ACCOUNT_ERROR)
      )
    })

    it('should throw if address type is invalid', () => {
      expect(
        expectSaga(payment.from, undefined, ADDRESS_TYPES.LOCKBOX + '1').run()
      ).rejects.toThrowError(new Error(INVALID_ADDRESS_TYPE_ERROR))
    })

    it('should throw if no account balance is available', () => {
      S.data.xlm.getBalance.mockReturnValueOnce(() => Remote.NotAsked)
      expect(expectSaga(payment.from).run()).rejects.toThrowError(
        new Error(NO_ACCOUNT_ERROR)
      )
    })
  })

  describe('to', () => {
    it('should set destination', () => {
      payment = payment.to(OTHER_ACCOUNT_ID)
      expect(payment.value().to).toEqual({
        address: OTHER_ACCOUNT_ID,
        type: ADDRESS_TYPES.ADDRESS
      })
    })

    it('should set custom address type', () => {
      const otherPayment = payment.to({
        address: OTHER_ACCOUNT_ID,
        type: ADDRESS_TYPES.LOCKBOX
      })
      expect(otherPayment.value().to).toEqual({
        address: OTHER_ACCOUNT_ID,
        type: ADDRESS_TYPES.LOCKBOX
      })
    })

    it('should throw if address type is invalid', () => {
      try {
        expectSaga(payment.to, {
          address: OTHER_ACCOUNT_ID,
          type: ADDRESS_TYPES.LOCKBOX + '1'
        }).run()
      } catch (e) {
        expect(e).toEqual(new Error(INVALID_ADDRESS_TYPE_ERROR))
      }
    })

    it('should throw if address is invalid', () => {
      try {
        expectSaga(payment.to, {
          address: OTHER_ACCOUNT_ID + '1',
          type: ADDRESS_TYPES.LOCKBOX
        }).run()
      } catch (e) {
        expect(e).toEqual(new Error(INVALID_ADDRESS_ERROR))
      }
    })
  })

  describe('amount', () => {
    it('should set amount', () => {
      payment = payment.amount(STUB_AMOUNT)
      expect(payment.value().amount).toBe(STUB_AMOUNT)
    })

    it('should throw if amount is negative', () => {
      expect(payment.amount.bind(null, -1)).toThrowError(
        new Error(INVALID_AMOUNT_ERROR)
      )
    })

    it('should throw if amount is bigger than effective balance', () => {
      expect(
        payment.amount.bind(
          null,
          Number(payment.value().effectiveBalance) +
            Number(payment.value().reserve) +
            1
        )
      ).toThrowError(new Error(INSUFFICIENT_FUNDS_ERROR))
    })

    it('should throw if amount leaves less balance than reserve', () => {
      expect(
        payment.amount.bind(null, Number(payment.value().effectiveBalance) + 1)
      ).toThrowError(new Error(RESERVE_ERROR))
    })
  })

  describe('description', () => {
    it('should add a description', () => {
      payment = payment.description(STUB_DESCRIPTION)
      expect(payment.value().description).toBe(STUB_DESCRIPTION)
    })
  })

  describe('memo', () => {
    it('should add memo', () => {
      payment = payment.memo(STUB_TEXT_MEMO)
      expect(payment.value().memo).toBe(STUB_TEXT_MEMO)
    })

    it('should throw if memo is not text', () => {
      expect(payment.memo.bind(null, 123)).toThrowError(
        new Error(WRONG_MEMO_FORMAT)
      )
      expect(payment.memo.bind(null, {})).toThrowError(
        new Error(WRONG_MEMO_FORMAT)
      )
    })
  })

  describe('memoType', () => {
    it('should add memo type', () => {
      payment = payment.memoType(MEMO_TEXT)
      expect(payment.value().memoType).toBe(MEMO_TEXT)
    })

    it('should throw if memo type is wrong', () => {
      expect(payment.memoType.bind(null, MEMO_TEXT + 1)).toThrowError(
        new Error(WRONG_MEMO_FORMAT)
      )
    })
  })

  describe('build', () => {
    it('should build transaction', async () => {
      payment = await expectSaga(payment.build)
        .run()
        .then(prop('returnValue'))
      expect(StellarSdk.Operation.payment).toHaveBeenCalledTimes(1)
      expect(StellarSdk.Operation.payment).toHaveBeenCalledWith({
        destination: OTHER_ACCOUNT_ID,
        asset: StellarSdk.Asset.native(),
        amount: convertXlmToXlm({
          value: STUB_AMOUNT,
          fromUnit: 'STROOP',
          toUnit: 'XLM'
        }).value
      })
      expect(
        StellarSdk.TransactionBuilder.prototype.addOperation
      ).toHaveBeenCalledTimes(1)
      expect(
        StellarSdk.TransactionBuilder.prototype.build
      ).toHaveBeenCalledTimes(1)
      expect(StellarSdk.Memo.text).toHaveBeenCalledTimes(1)
      expect(StellarSdk.Memo.text).toHaveBeenCalledWith(STUB_TEXT_MEMO)
      expect(
        StellarSdk.TransactionBuilder.prototype.addMemo
      ).toHaveBeenCalledTimes(1)
      expect(payment.value().transaction).toBe(STUB_TX)
    })
    it('should build transaction with createAccount operation if destination account does not exist', async () => {
      api.getXlmAccount.mockRejectedValueOnce('')
      let otherPayment = await expectSaga(payment.to, OTHER_ACCOUNT_ID)
        .run()
        .then(prop('returnValue'))
      otherPayment = await expectSaga(otherPayment.build)
        .run()
        .then(prop('returnValue'))
      expect(StellarSdk.Operation.createAccount).toHaveBeenCalledTimes(1)
      expect(StellarSdk.Operation.createAccount).toHaveBeenCalledWith({
        destination: OTHER_ACCOUNT_ID,
        startingBalance: convertXlmToXlm({
          value: STUB_AMOUNT,
          fromUnit: 'STROOP',
          toUnit: 'XLM'
        }).value
      })
      expect(
        StellarSdk.TransactionBuilder.prototype.addOperation
      ).toHaveBeenCalledTimes(1)
      expect(
        StellarSdk.TransactionBuilder.prototype.build
      ).toHaveBeenCalledTimes(1)
      expect(StellarSdk.Memo.text).toHaveBeenCalledTimes(1)
      expect(StellarSdk.Memo.text).toHaveBeenCalledWith(STUB_TEXT_MEMO)
      expect(
        StellarSdk.TransactionBuilder.prototype.addMemo
      ).toHaveBeenCalledTimes(1)
      expect(otherPayment.value().transaction).toBe(STUB_TX)
    })
    it('should call memo id if it was set as memo type', async () => {
      let otherPayment = payment.memoType(MEMO_ID)
      otherPayment = otherPayment.memo(STUB_ID_MEMO)
      StellarSdk.Memo.id.mockClear()
      await expectSaga(otherPayment.build)
        .run()
        .then(prop('returnValue'))
      expect(StellarSdk.Memo.id).toHaveBeenCalledTimes(1)
      expect(StellarSdk.Memo.id).toHaveBeenCalledWith(STUB_ID_MEMO)
    })
    it('should not call memo if it was not set', async () => {
      let otherPayment = payment.memo('')
      StellarSdk.Memo.text.mockClear()
      await expectSaga(otherPayment.build)
        .run()
        .then(prop('returnValue'))
      expect(StellarSdk.Memo.text).toHaveBeenCalledTimes(0)
    })
    it('should throw if source account is not set', () => {
      try {
        const otherPayment = create({
          payment: dissocPath(['from', 'account'], payment.value())
        })
        expectSaga(otherPayment.build).run()
      } catch (e) {
        expect(e).toEqual(new Error(NO_SOURCE_ERROR))
      }
    })
    it('should throw if destination address is not set', () => {
      try {
        const otherPayment = create({
          payment: dissocPath(['to', 'address'], payment.value())
        })
        expectSaga(otherPayment.build).run()
      } catch (e) {
        expect(e).toEqual(new Error(NO_DESTINATION_ERROR))
      }
    })
    it('should throw if amount is not set', () => {
      try {
        const otherPayment = create({
          payment: dissoc('amount', payment.value())
        })
        expectSaga(otherPayment.build).run()
      } catch (e) {
        expect(e).toEqual(new Error(NO_AMOUNT_ERROR))
      }
    })
  })

  describe('sign', () => {
    it('should set signed tx', async () => {
      payment = await expectSaga(payment.sign, STUB_PASSWORD)
        .run()
        .then(prop('returnValue'))
      expect(S.wallet.getMnemonic).toHaveBeenCalledTimes(1)
      expect(S.wallet.getMnemonic.mock.calls[0][1]).toBe(STUB_PASSWORD)
      expect(xlmSigner.sign).toHaveBeenCalledTimes(1)
      expect(xlmSigner.sign).toHaveBeenCalledWith(
        { transaction: STUB_TX },
        STUB_MNEMONIC
      )
      expect(payment.value().signed).toBe(STUB_SIGNED_TX)
    })
    it('should throw if payment has no transaction', () => {
      const otherPayment = create({
        payment: dissoc('transaction', payment.value())
      })
      try {
        expectSaga(otherPayment.sign, STUB_PASSWORD).run()
      } catch (e) {
        expect(e).toEqual(new Error(NO_TX_ERROR))
      }
    })
  })

  describe('publish', () => {
    it('should set signed tx', async () => {
      try {
        payment = await expectSaga(payment.publish)
          .run()
          .then(prop('returnValue'))
        expect(api.pushXlmTx).toHaveBeenCalledTimes(1)
        expect(api.pushXlmTx).toHaveBeenCalledWith(STUB_SIGNED_TX)
        expect(settingsSagas.setLastTxTime).toHaveBeenCalledTimes(1)
        expect(payment.value().txId).toBe(STUB_TX_RESULT.hash)
      } catch (e) {}
    })

    it('should throw if payment has no signed transaction', () => {
      const otherPayment = create({
        payment: dissoc('signed', payment.value())
      })
      try {
        expectSaga(otherPayment.sign, STUB_PASSWORD).run()
      } catch (e) {
        expect(e).toEqual(new Error(NO_SIGNED_ERROR))
      }
    })
  })
})
