import { call, put, retry, select, take } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { Remote } from 'blockchain-wallet-v4/src'
import { SBCheckoutFormValuesType } from 'data/types'

import * as A from './actions'
import * as AT from './actionTypes'

// TODO: removed this SB dependency
import { DEFAULT_SB_METHODS } from '../simpleBuy/model'
// import { FastLinkType } from './types'

export default ({ api }: { api: APIType; coreSagas: any; networks: any }) => {
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
      yield put(actions.modals.closeModal('BROKERAGE_MODAL'))
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
          actions.components.simpleBuy.setStep({
            step: 'LINK_BANK_STATUS',
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
            const sbMethods = sbMethodsR.getOrElse(DEFAULT_SB_METHODS)
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
        }
      }
    } catch (e) {
      yield put(
        actions.components.simpleBuy.setStep({
          step: 'LINK_BANK_STATUS',
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

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin } = payload
    yield put(actions.modals.showModal('BROKERAGE_MODAL', { origin }))
  }

  return {
    deleteSavedBank,
    fetchBankTransferAccounts,
    fetchBankTransferUpdate,
    fetchFastLink,
    showModal
  }
}
