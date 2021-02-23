import { call, put, retry, select, take } from 'redux-saga/effects'
import { getFormValues } from 'redux-form'

import { actions, selectors } from 'data'
import {
  AddBankStepType,
  BankDepositStepType,
  BrokerageModalOriginType,
  SBCheckoutFormValuesType
} from 'data/types'
import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { Remote } from 'blockchain-wallet-v4/src'

import * as A from './actions'
import * as AT from './actionTypes'
import { DEFAULT_METHODS } from './model'
import profileSagas from '../../modules/profile/sagas'

// import { FastLinkType } from './types'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const { isTier2 } = profileSagas({
    api,
    coreSagas,
    networks
  })
  const deleteSavedBank = function * ({
    bankId
  }: ReturnType<typeof A.deleteSavedBank>) {
    try {
      yield put(actions.form.startSubmit('linkedBanks'))
      yield call(api.deleteSavedAccount, bankId, 'banktransfer')
      yield put(A.fetchBankTransferAccounts())
      yield take([
        AT.FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS,
        AT.FETCH_BANK_TRANSFER_UPDATE_ERROR
      ])
      yield put(actions.form.stopSubmit('linkedBanks'))
      yield put(actions.alerts.displaySuccess('Bank removed.'))
      yield put(actions.modals.closeModal('BANK_DETAILS_MODAL'))
      yield put(actions.modals.closeModal('REMOVE_BANK_MODAL'))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('linkedBanks', { _error: error }))
      yield put(actions.alerts.displayError('Error removing bank.'))
    }
  }

  const transferAccountState = function * (id: string) {
    const data = yield call(api.getBankTransferAccountDetails, id)
    if (data.state === 'ACTIVE') {
      return data
    } else if (data.state === 'BLOCKED') {
      return data.error
    } else {
      throw new Error('retry active account check')
    }
  }

  const conditionalRetry = function * (id: string) {
    const data = yield retry(60, 1000, transferAccountState, id)
    return data
  }
  const fetchBankTransferUpdate = function * ({
    accounts
  }: ReturnType<typeof A.fetchBankTransferUpdate>) {
    try {
      const fastLink = yield select(selectors.components.brokerage.getFastLink)
      for (let a of accounts) {
        const status: ReturnType<typeof api.updateBankAccountLink> = yield call(
          api.updateBankAccountLink,
          a.providerAccountId,
          fastLink.data.id,
          a.accountId
        )

        // Polls the account details to check for Active state
        const bankData = yield call(conditionalRetry, status.id)
        // Shows bank status screen based on whether has blocked account or not

        yield put(
          actions.components.brokerage.setStep({
            step: AddBankStepType.ADD_BANK_STATUS,
            bankStatus: bankData.state
          })
        )

        yield put(actions.components.brokerage.fetchBankTransferAccounts())

        if (bankData.state === 'ACTIVE') {
          const values: SBCheckoutFormValuesType = yield select(
            selectors.form.getFormValues('simpleBuyCheckout')
          )
          if (values?.amount) {
            yield put(
              actions.components.simpleBuy.createSBOrder(
                'BANK_TRANSFER',
                status.id
              )
            )
          } else {
            const sbMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
              yield select()
            )
            const sbMethods = sbMethodsR.getOrElse(DEFAULT_METHODS)
            if (Remote.Success.is(sbMethodsR) && sbMethods.methods.length) {
              const bankTransferMethod = sbMethods.methods.filter(
                method => method.type === 'BANK_TRANSFER'
              )[0]
              yield put(
                actions.components.simpleBuy.handleSBMethodChange({
                  ...bankData,
                  limits: bankTransferMethod.limits,
                  type: 'BANK_TRANSFER'
                })
              )
            }
          }
        } else {
          actions.analytics.logEvent([
            'BANK_LINK_FAILED',
            bankData.state,
            a.providerName,
            a.providerId
          ])
        }
      }
    } catch (e) {
      yield put(
        actions.components.brokerage.setStep({
          step: AddBankStepType.ADD_BANK_STATUS,
          bankStatus: 'DEFAULT_ERROR'
        })
      )
    }
  }

  const fetchFastLink = function * () {
    try {
      const fastLink = yield call(api.createBankAccountLink, 'USD')
      yield put(A.setFastLink(fastLink))
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
    }
  }

  const fetchBankTransferAccounts = function * () {
    try {
      const accounts = yield call(api.getBankTransferAccounts)
      yield put(A.fetchBankTransferAccountsSuccess(accounts))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchBankTransferAccountsError(error))
    }
  }

  const handleDepositFiatClick = function * () {
    const bankTransferAccounts = yield select(
      selectors.components.brokerage.getBankTransferAccounts
    )
    if (bankTransferAccounts?.data?.length) {
      yield put(
        actions.components.brokerage.setBankDetails({
          account: bankTransferAccounts.data[0]
        })
      )
    }
    yield put(
      actions.components.brokerage.showModal(
        BrokerageModalOriginType.DEPOSIT_BUTTON,
        'BANK_DEPOSIT_MODAL'
      )
    )
    yield put(
      actions.components.brokerage.setStep({
        step: BankDepositStepType.DEPOSIT_METHODS
      })
    )
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin, modalType } = payload
    yield put(actions.modals.showModal(modalType, { origin }))
  }

  const createFiatDeposit = function * () {
    const { amount, currency } = yield select(getFormValues('brokerageTx'))
    const { id } = yield select(selectors.components.brokerage.getAccount)
    try {
      const data = yield call(api.createFiatDeposit, amount, id, currency)
      if (data && data.paymentId) {
        yield put(
          actions.components.brokerage.setStep({
            step: BankDepositStepType.DEPOSIT_STATUS
          })
        )
      }
    } catch (e) {
      // TODO: implement error fallback
    }
  }

  const handleMethodChange = function * (action) {
    // check tier 2
    // if not kick to KYC flow
    // if yes, kick to bank transfer or wire `action.method.type`

    const { method } = action
    const isUserTier2 = yield call(isTier2)
    if (!isUserTier2) {
      switch (method.type) {
        case 'BANK_ACCOUNT':
        case 'BANK_TRANSFER':
          // identityVerificationActions.verifyIdentity(2, false)
          // return yield put(actions)
          // return yield put(
          //   ShowModal KYC
          //   A.setStep({
          //     step: 'KYC_REQUIRED'
          //   })
          // )
          break
        default:
          return
      }
    }

    // User is Tier 2
    switch (method.type) {
      default:
      case 'BANK_ACCOUNT':
        return yield put(
          actions.components.brokerage.setStep({
            step: BankDepositStepType.WIRE_INSTRUCTIONS
          })
        )
      case 'BANK_TRANSFER':
        return yield put(
          actions.components.brokerage.setStep({
            step: BankDepositStepType.ENTER_AMOUNT
          })
        )
    }
  }

  return {
    deleteSavedBank,
    createFiatDeposit,
    fetchBankTransferAccounts,
    fetchBankTransferUpdate,
    fetchFastLink,
    handleDepositFiatClick,
    handleMethodChange,
    showModal
  }
}
