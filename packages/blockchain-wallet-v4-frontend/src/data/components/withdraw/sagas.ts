import { call, put, select, take } from 'redux-saga/effects'

import { displayFiatToFiat } from '@core/exchange'
import { APIType } from '@core/network/api'
import { BSPaymentMethodType, BSPaymentTypes, FiatType } from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import {
  CustodialSanctionsEnum,
  ModalName,
  ProductEligibilityForUser,
  WithdrawStepEnum
} from 'data/types'

import { actions as custodialActions } from '../../custodial/slice'
import profileSagas from '../../modules/profile/sagas'
import { convertStandardToBase } from '../exchange/services'
import { actions as A } from './slice'

const SERVICE_NAME = 'simplebuy'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas; networks }) => {
  const { isTier2 } = profileSagas({ api, coreSagas, networks })

  const handleWithdrawSubmit = function* ({ payload }: ReturnType<typeof A.handleCustodyWithdraw>) {
    const WITHDRAW_CONFIRM_FORM = 'confirmCustodyWithdraw'

    try {
      yield put(actions.form.startSubmit(WITHDRAW_CONFIRM_FORM))
      if (payload.beneficiary) {
        const withdrawal: ReturnType<typeof api.withdrawFunds> = yield call(
          api.withdrawFunds,
          payload.beneficiary,
          payload.fiatCurrency,
          convertStandardToBase('FIAT', payload.amount)
        )
        yield put(actions.form.stopSubmit(WITHDRAW_CONFIRM_FORM))
        yield put(actions.core.data.fiat.fetchTransactions(payload.fiatCurrency, true))
        yield put(
          A.setStep({
            step: WithdrawStepEnum.WITHDRAWAL_DETAILS,
            withdrawal
          })
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(WITHDRAW_CONFIRM_FORM, { _error: error }))
    }
  }

  const showModal = function* ({ payload }: ReturnType<typeof A.showModal>) {
    const { fiatCurrency } = payload

    // get current user tier
    const isUserTier2 = yield call(isTier2)

    yield put(actions.custodial.fetchProductEligibilityForUser())
    yield take([
      custodialActions.fetchProductEligibilityForUserSuccess.type,
      custodialActions.fetchProductEligibilityForUserFailure.type
    ])

    const products = selectors.custodial.getProductEligibilityForUser(yield select()).getOrElse({
      custodialWallets: { canWithdrawCrypto: false, canWithdrawFiat: false, enabled: false },
      withdrawFiat: { enabled: false, reasonNotEligible: undefined }
    } as ProductEligibilityForUser)

    // check is user eligible to do withdrawal
    // we skip this for gold users
    if (!isUserTier2) {
      const userCanWithdrawal =
        products.custodialWallets?.canWithdrawCrypto &&
        products.custodialWallets?.canWithdrawFiat &&
        products.withdrawFiat?.enabled
      // prompt upgrade modal in case that user can't buy more
      if (!userCanWithdrawal) {
        yield put(
          actions.modals.showModal(ModalName.UPGRADE_NOW_SILVER_MODAL, {
            origin: 'WithdrawModal'
          })
        )
        // close withdrawal Modal
        yield put(actions.modals.closeModal(ModalName.CUSTODY_WITHDRAW_MODAL))
        return
      }
    }

    // show sanctions for withdrawal
    if (products?.withdrawFiat?.reasonNotEligible) {
      const message =
        products.withdrawFiat.reasonNotEligible.reason !== CustodialSanctionsEnum.EU_5_SANCTION
          ? products.withdrawFiat.reasonNotEligible.message
          : undefined
      const sanctionsType = products.withdrawFiat.reasonNotEligible.type
      yield put(
        actions.modals.showModal(ModalName.SANCTIONS_INFO_MODAL, {
          message,
          origin: 'WithdrawModal',
          sanctionsType
        })
      )
      yield put(actions.modals.closeModal(ModalName.CUSTODY_WITHDRAW_MODAL))
      return
    }

    yield put(
      actions.modals.showModal(ModalName.CUSTODY_WITHDRAW_MODAL, {
        origin: 'TransactionList'
      })
    )

    yield put(A.setStep({ step: WithdrawStepEnum.LOADING }))

    const paymentMethods: BSPaymentMethodType[] = yield call(
      api.getBSPaymentMethods,
      fiatCurrency,
      true
    )

    const eligibleMethods = paymentMethods.filter(
      (method) =>
        method.currency === fiatCurrency &&
        (method.type === BSPaymentTypes.BANK_ACCOUNT ||
          method.type === BSPaymentTypes.BANK_TRANSFER)
    )

    if (eligibleMethods.length === 0) {
      return yield put(A.setStep({ step: WithdrawStepEnum.INELIGIBLE }))
    }

    yield put(A.setStep({ fiatCurrency, step: WithdrawStepEnum.ENTER_AMOUNT }))
  }

  const handleWithdrawMaxAmountClick = function* (
    action: ReturnType<typeof A.handleWithdrawMaxAmountClick>
  ) {
    yield put(
      actions.form.change(
        'custodyWithdrawForm',
        'amount',
        displayFiatToFiat({ value: action.payload.amount })
      )
    )
  }

  const handleWithdrawMinAmountClick = function* (
    action: ReturnType<typeof A.handleWithdrawMinAmountClick>
  ) {
    yield put(
      actions.form.change(
        'custodyWithdrawForm',
        'amount',
        displayFiatToFiat({ value: action.payload.amount })
      )
    )
  }

  const fetchFees = function* (action: ReturnType<typeof A.fetchWithdrawalFees>) {
    yield put(A.fetchWithdrawalFeesLoading())
    try {
      const withdrawalFees: ReturnType<typeof api.getWithdrawalFees> = yield call(
        api.getWithdrawalFees,
        SERVICE_NAME,
        action.payload.paymentMethod
      )

      yield put(A.fetchWithdrawalFeesSuccess(withdrawalFees))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalFeesFailure(error))
    }
  }

  const fetchWithdrawLocks = function* (action: ReturnType<typeof A.fetchWithdrawalLock>) {
    yield put(A.fetchWithdrawalFeesLoading())
    const currency =
      action.payload.currency ||
      (selectors.components.withdraw.getFiatCurrency(yield select()) as FiatType)
    try {
      const locks: ReturnType<typeof api.getWithdrawalLocks> = yield call(
        api.getWithdrawalLocks,
        currency
      )
      yield put(A.fetchWithdrawalLockSuccess(locks))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalLockFailure(error))
    }
  }

  const fetchCrossBorderLimits = function* ({
    payload
  }: ReturnType<typeof A.fetchCrossBorderLimits>) {
    const { currency, fromAccount, inputCurrency, outputCurrency, toAccount } = payload
    try {
      yield put(A.fetchCrossBorderLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        inputCurrency,
        fromAccount,
        outputCurrency,
        toAccount,
        currency
      )
      yield put(A.fetchCrossBorderLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.fetchCrossBorderLimitsFailure(e))
    }
  }

  return {
    fetchCrossBorderLimits,
    fetchFees,
    fetchWithdrawLocks,
    handleWithdrawMaxAmountClick,
    handleWithdrawMinAmountClick,
    handleWithdrawSubmit,
    showModal
  }
}
