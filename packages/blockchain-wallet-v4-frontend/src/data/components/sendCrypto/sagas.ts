import { SEND_FORM } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/model'
import { SendFormType } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/types'
import { call, put, select } from 'redux-saga/effects'

import { convertCoinToCoin } from '@core/exchange'
import { APIType } from '@core/network/api'
import { FiatType, WalletAcountEnum } from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import { SwapBaseCounterTypes } from 'data/components/swap/types'
import { ModalName, ModalNameType } from 'data/modals/types'

import * as S from './selectors'
import { actions as A } from './slice'
import { SendCryptoStepType } from './types'

export default ({ api }: { api: APIType }) => {
  const fetchFees = function* () {
    yield put(A.fetchWithdrawalFeesLoading())
    try {
      const withdrawalFees: ReturnType<typeof api.getWithdrawalFees> = yield call(
        api.getWithdrawalFees,
        'simplebuy'
      )

      yield put(A.fetchWithdrawalFeesSuccess(withdrawalFees))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalFeesFailure(error))
    }
  }

  const fetchLocks = function* () {
    yield put(A.fetchWithdrawalLocksLoading())
    const currency = selectors.components.brokerage.getFiatCurrency(yield select()) as FiatType
    try {
      const withdrawalFees: ReturnType<typeof api.getWithdrawalLocks> = yield call(
        api.getWithdrawalLocks,
        currency
      )

      yield put(A.fetchWithdrawalLocksSuccess(withdrawalFees))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalLocksFailure(error))
    }
  }

  // TODO: remove when all tokens are moved to sendCrypto
  // This switches between the flyout and the old modal
  // depending on the crypto you're sending.
  const onFormChange = function* (action: {
    meta: { field: string; form: string }
    payload: string
  }) {
    const { meta, payload } = action
    const { field, form } = meta

    if (form.includes('SEND') && field === 'coin') {
      yield put(actions.modals.closeAllModals())
      if (selectors.core.data.coins.getCustodialCoins().includes(payload)) {
        // must come before show modal
        yield put(A.setInitialCoin(payload))
        // must come after setInitialCoin
        yield put(actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, { origin: 'Send' }))
      } else {
        const coin = window.coins[payload].coinfig.type.erc20Address ? 'ETH' : payload
        yield put(
          actions.modals.showModal(`SEND_${coin}_MODAL` as ModalNameType, {
            coin: payload,
            origin: 'Send'
          })
        )
      }
    }
  }

  const submitTransaction = function* () {
    try {
      yield put(A.setStep({ step: SendCryptoStepType.STATUS }))
      yield put(A.submitTransactionLoading())
      const formValues = selectors.form.getFormValues(SEND_FORM)(yield select()) as SendFormType
      const { amount, selectedAccount, to } = formValues
      const { coin } = selectedAccount
      const feesR = S.getWithdrawalFees(yield select(), selectedAccount.coin)
      const fee = feesR.getOrElse(undefined)

      const finalAmt = convertCoinToCoin({ baseToStandard: false, coin, value: amount })
      const finalFee = convertCoinToCoin({ baseToStandard: false, coin, value: fee || 0 })

      const response: ReturnType<typeof api.withdrawBSFunds> = yield call(
        api.withdrawBSFunds,
        to,
        coin,
        finalAmt,
        Number(finalFee)
      )

      yield put(A.submitTransactionSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.submitTransactionFailure(error))
    }
  }

  const fetchSendLimits = function* ({ payload }: ReturnType<typeof A.fetchSendLimits>) {
    const state = yield select()
    const { coin, type } = payload.account

    if (type !== SwapBaseCounterTypes.CUSTODIAL) {
      return
    }

    const currency = selectors.core.settings.getCurrency(state).getOrElse('USD')
    try {
      yield put(A.fetchSendLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        coin,
        WalletAcountEnum.CUSTODIAL,
        coin,
        WalletAcountEnum.NON_CUSTODIAL,
        currency
      )
      yield put(A.fetchSendLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.fetchSendLimitsFailure(e))
    }
  }

  return {
    fetchFees,
    fetchLocks,
    fetchSendLimits,
    onFormChange,
    // fetchTransactionDetails,
    submitTransaction
  }
}
