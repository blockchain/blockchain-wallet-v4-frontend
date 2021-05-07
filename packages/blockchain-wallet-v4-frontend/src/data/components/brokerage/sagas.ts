import { getFormValues } from 'redux-form'
import { call, delay, put, retry, select, take } from 'redux-saga/effects'

import { Remote } from 'blockchain-wallet-v4/src'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { SBTransactionType } from 'core/types'
import { actions, selectors } from 'data'
import {
  AddBankStepType,
  BankDWStepType,
  BankPartners,
  BankStatusType,
  BrokerageModalOriginType,
  FastLinkType,
  SBCheckoutFormValuesType
} from 'data/types'

import profileSagas from '../../modules/profile/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import { DEFAULT_METHODS, POLLING } from './model'
import * as S from './selectors'
import { OBType } from './types'

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
    const { RETRY_AMOUNT, SECONDS } = POLLING
    const data = yield retry(
      RETRY_AMOUNT,
      SECONDS * 1000,
      transferAccountState,
      id
    )
    return data
  }

  const fetchBankTransferUpdate = function * (
    action: ReturnType<typeof A.fetchBankTransferUpdate>
  ) {
    try {
      const { account } = action.payload

      let bankId
      let attributes
      const bankCredentials = S.getBankCredentials(yield select()).getOrElse(
        {} as OBType
      )
      const fastLink = S.getFastLink(yield select()).getOrElse(
        {} as FastLinkType
      )

      if (typeof account === 'string' && bankCredentials) {
        // Yapily
        const domainsR = yield select(selectors.core.walletOptions.getDomains)
        const { yapilyCallbackUrl } = domainsR.getOrElse({
          yapilyCallbackUrl: 'https://www.blockchain.com/brokerage-link-success'
        })
        const callback = yapilyCallbackUrl
        bankId = bankCredentials.id
        attributes = { institutionId: account, callback }
      } else if (typeof account === 'object' && fastLink) {
        // Yodlee
        bankId = fastLink.id
        attributes = {
          providerAccountId: account.providerAccountId,
          accountId: account.accountId
        }
      }

      const status: ReturnType<typeof api.updateBankAccountLink> = yield call(
        api.updateBankAccountLink,
        bankId,
        attributes
      )

      yield put(
        actions.components.brokerage.setBankDetails({
          account: status
        })
      )

      // Polls the account details to check for Active state
      const bankData = yield call(conditionalRetry, status.id)
      // Shows bank status screen based on whether has blocked account or not

      yield put(
        actions.components.brokerage.setAddBankStep({
          addBankStep: AddBankStepType.ADD_BANK_STATUS,
          bankStatus: bankData.state
        })
      )

      yield put(actions.components.brokerage.fetchBankTransferAccounts())

      if (bankData.state === 'ACTIVE') {
        const values: SBCheckoutFormValuesType = yield select(
          selectors.form.getFormValues('simpleBuyCheckout')
        )

        // Set the brokerage defaultMethod to this new bank. Typically to
        // auto-fill the bank account on the enter amount screen
        yield put(
          actions.components.brokerage.setBankDetails({
            account: bankData
          })
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
          ...attributes
        ])
      }
    } catch (e) {
      yield put(
        actions.components.brokerage.setAddBankStep({
          addBankStep: AddBankStepType.ADD_BANK_STATUS,
          bankStatus: BankStatusType.DEFAULT_ERROR
        })
      )
    }
  }

  const fetchBankLinkCredentials = function * (action) {
    try {
      yield put(A.fetchBankLinkCredentialsLoading())
      const { fiatCurrency } = action.payload
      const credentials = yield call(api.createBankAccountLink, fiatCurrency)
      if (credentials.partner === BankPartners.YODLEE) {
        yield put(A.setFastLink(credentials))
      } else if (credentials.partner === BankPartners.YAPILY) {
        yield put(A.setBankCredentials(credentials))
      }
    } catch (e) {
      yield put(A.fetchBankLinkCredentialsError(e.description))
    }
  }

  const fetchBankTransferAccounts = function * () {
    try {
      yield put(A.fetchBankTransferAccountsLoading())
      const accounts = yield call(api.getBankTransferAccounts)
      yield put(A.fetchBankTransferAccountsSuccess(accounts))

      // Set the default account whenever you fetch the entire saved accounts
      // list. It's convenient.
      if (accounts.length > 0) {
        const account = accounts.find(a => a.state === 'ACTIVE')
        yield put(A.setBankDetails({ account }))
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchBankTransferAccountsError(error))
    }
  }

  const handleDepositFiatClick = function * ({
    payload
  }: ReturnType<typeof A.handleDepositFiatClick>) {
    yield put(
      actions.components.brokerage.showModal(
        BrokerageModalOriginType.DEPOSIT_BUTTON,
        'BANK_DEPOSIT_MODAL'
      )
    )
    yield put(
      actions.components.brokerage.setDWStep({
        dwStep: BankDWStepType.LOADING
      })
    )
    try {
      // If user is not eligible for the requested fiat the route will 400
      // and this code will throw so no need to check the response body
      yield call(api.getSBPaymentAccount, payload.fiatCurrency)
    } catch (e) {
      return yield put(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.INELIGIBLE
        })
      )
    }
    const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
      yield select()
    )
    const bankTransferAccounts = bankTransferAccountsR.getOrElse([])
    if (bankTransferAccounts.length) {
      yield put(
        actions.components.brokerage.setBankDetails({
          account: bankTransferAccounts.filter(
            a => a.currency === payload.fiatCurrency && a.state === 'ACTIVE'
          )[0]
        })
      )
      yield put(
        actions.components.brokerage.showModal(
          BrokerageModalOriginType.DEPOSIT_BUTTON,
          'BANK_DEPOSIT_MODAL'
        )
      )
      // Resets any previous form errors
      yield put(actions.form.destroy('brokerageTx'))
      yield put(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.ENTER_AMOUNT
        })
      )
    } else {
      yield put(
        actions.components.brokerage.showModal(
          BrokerageModalOriginType.DEPOSIT_BUTTON,
          'BANK_DEPOSIT_MODAL'
        )
      )
      yield put(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.DEPOSIT_METHODS
        })
      )
    }
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { modalType, origin } = payload
    yield put(actions.modals.showModal(modalType, { origin }))
  }

  const ClearedStatusCheck = function * (orderId) {
    let order: SBTransactionType = yield call(api.getPaymentById, orderId)

    if (
      order.state === 'CLEARED' ||
      order.state === 'COMPLETE' ||
      order.state === 'FAILED'
    ) {
      return order
    } else {
      throw new Error('retrying to fetch for cleared status')
    }
  }

  const AuthUrlCheck = function * (orderId) {
    let order: SBTransactionType = yield call(api.getPaymentById, orderId)

    if (
      (order.extraAttributes &&
        'authorisationUrl' in order.extraAttributes &&
        order.extraAttributes.authorisationUrl) ||
      order.state === 'FAILED'
    ) {
      return order
    } else {
      throw new Error('retrying to fetch for AuthUrl')
    }
  }

  const createFiatDeposit = function * () {
    const { amount, currency } = yield select(getFormValues('brokerageTx'))
    const { id, partner } = yield select(
      selectors.components.brokerage.getAccount
    )
    const domainsR = yield select(selectors.core.walletOptions.getDomains)
    const { yapilyCallbackUrl } = domainsR.getOrElse({
      yapilyCallbackUrl: 'https://www.blockchain.com/brokerage-link-success'
    })
    const callback =
      partner === BankPartners.YAPILY ? yapilyCallbackUrl : undefined
    const attributes = { callback }
    try {
      const data = yield call(
        api.createFiatDeposit,
        amount,
        id,
        currency,
        attributes
      )
      const { RETRY_AMOUNT, SECONDS } = POLLING
      // If yapily we need to transition to another screen and poll for auth
      // details before polling for order status
      if (partner === BankPartners.YAPILY) {
        const order = yield retry(
          RETRY_AMOUNT,
          SECONDS * 1000,
          AuthUrlCheck,
          data.paymentId
        )
        if (
          order.extraAttributes &&
          'authorisationUrl' in order.extraAttributes &&
          order.extraAttributes.authorisationUrl
        ) {
          yield put(actions.form.change('brokerageTx', 'order', order))
          yield put(
            actions.components.brokerage.setDWStep({
              dwStep: BankDWStepType.DEPOSIT_CONNECT
            })
          )
        }
      }
      // Poll for order status in order to show success, timed out or failed
      try {
        const updatedOrder: SBTransactionType = yield retry(
          RETRY_AMOUNT,
          SECONDS * 1000,
          ClearedStatusCheck,
          data.paymentId
        )
        yield put(actions.form.change('brokerageTx', 'order', updatedOrder))
      } catch (error) {
        yield put(actions.form.change('brokerageTx', 'retryTimeout', true))
      }

      yield put(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.DEPOSIT_STATUS
        })
      )
      // refresh the tx list after small delay so the newest tx shows up right away
      yield delay(1000)
      yield put(actions.core.data.fiat.fetchTransactions(currency, true))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('brokerageTx', { _error: error }))
      yield put(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.ENTER_AMOUNT
        })
      )
    }
  }

  const handleMethodChange = function * (action) {
    const { method } = action
    const isUserTier2 = yield call(isTier2)

    // check if user is tier 2
    // if not, kick to KYC flow
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

    // if yes, kick to bank transfer or wire `action.method.type`
    switch (method.type) {
      default:
      case 'BANK_ACCOUNT':
        return yield put(
          actions.components.brokerage.setDWStep({
            dwStep: BankDWStepType.WIRE_INSTRUCTIONS
          })
        )
      case 'BANK_TRANSFER':
        return yield put(
          actions.components.brokerage.setDWStep({
            dwStep: BankDWStepType.ENTER_AMOUNT
          })
        )
    }
  }

  return {
    deleteSavedBank,
    createFiatDeposit,
    fetchBankTransferAccounts,
    fetchBankTransferUpdate,
    fetchBankLinkCredentials,
    handleDepositFiatClick,
    handleMethodChange,
    showModal
  }
}
