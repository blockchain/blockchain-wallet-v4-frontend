import { getFormValues } from 'redux-form'
import { END } from 'redux-saga'
import { call, delay, put, race, retry, select, take } from 'redux-saga/effects'

import { Remote } from '@core'
import { APIType } from '@core/network/api'
import {
  BSPaymentMethodType,
  BSPaymentTypes,
  BSTransactionStateEnum,
  BSTransactionType,
  ExtraKYCContext,
  ProductTypes,
  WalletFiatType
} from '@core/types'
import { errorCodeAndMessage, errorHandler } from '@core/utils'
import { actions, model, selectors } from 'data'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import {
  AddBankStepType,
  BankDWStepType,
  BankPartners,
  BankStatusType,
  BrokerageModalOriginType,
  BSCheckoutFormValuesType,
  CustodialSanctionsEnum,
  ModalName,
  ProductEligibilityForUser,
  VerifyIdentityOriginType
} from 'data/types'
import { getExtraKYCCompletedStatus } from 'services/sagas/extraKYC'

import profileSagas from '../../modules/profile/sagas'
import { DEFAULT_METHODS, POLLING } from './model'
import * as S from './selectors'
import { actions as A } from './slice'
import { BankCredentialsType, DepositTerms, PlaidAccountType, YodleeAccountType } from './types'

const { FORM_BS_CHECKOUT } = model.components.buySell

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { isTier2 } = profileSagas({
    api,
    coreSagas,
    networks
  })
  const deleteSavedBank = function* ({ payload: bankId }: ReturnType<typeof A.deleteSavedBank>) {
    try {
      yield put(actions.form.startSubmit('linkedBanks'))
      yield call(api.deleteSavedAccount, bankId, 'banktransfer')
      yield put(A.fetchBankTransferAccounts())
      yield take([A.fetchBankTransferAccountsSuccess.type, A.fetchBankTransferAccountsError.type])
      yield put(actions.form.stopSubmit('linkedBanks'))
      yield put(actions.alerts.displaySuccess('Bank removed.'))
      yield put(actions.modals.closeModal(ModalName.BANK_DETAILS_MODAL))
      yield put(actions.modals.closeModal(ModalName.REMOVE_BANK_MODAL))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('linkedBanks', { _error: error }))
      yield put(actions.alerts.displayError('Error removing bank.'))
    }
  }

  const transferAccountState = function* (id: string) {
    const data = yield call(api.getBankTransferAccountDetails, id)
    switch (data.state) {
      case 'ACTIVE':
        return data
      case 'BLOCKED':
        return data.error
      default:
        throw new Error('retry active account check')
    }
  }

  const conditionalRetry = function* (id: string) {
    const MAX_TRIES = Array(6)
    let ITERATION = 1

    const decay = (multiplier: number) => {
      return multiplier * 1000
    }

    while (MAX_TRIES.length) {
      try {
        return yield call(transferAccountState, id)
      } catch (error) {
        yield delay(decay(ITERATION))
        ITERATION += ITERATION * 2
        MAX_TRIES.pop()
      }
    }
  }

  const getBankUpdatePayload = function* (
    bankCredentials: BankCredentialsType,
    account: string | PlaidAccountType | YodleeAccountType
  ) {
    if (typeof account === 'string' && bankCredentials) {
      // Yapily
      const domainsR = yield select(selectors.core.walletOptions.getDomains)
      const { comRoot } = domainsR.getOrElse({
        comRoot: 'https://www.blockchain.com'
      })
      const callback = `${comRoot}/brokerage-link-success`
      return [bankCredentials.id, { callback, institutionId: account }]
    }
    // Plaid
    // Yodlee
    return [bankCredentials.id, account]
  }

  const fetchBankTransferUpdate = function* ({
    payload
  }: ReturnType<typeof A.fetchBankTransferUpdate>) {
    try {
      const bankCredentials = S.getBankCredentials(yield select()).getOrFail(
        'Could not retrieve bank credentials'
      )
      const [bankId, attributes] = yield call(getBankUpdatePayload, bankCredentials, payload)
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

      // Polls the account details to check for Active or Blocked state
      const bankData = yield call(conditionalRetry, status.id)

      // Show bank status screen with success or failure error
      yield put(
        actions.components.brokerage.setAddBankStep({
          addBankStep: AddBankStepType.ADD_BANK_STATUS,
          bankStatus: bankData.state
        })
      )

      yield put(actions.components.brokerage.fetchBankTransferAccounts())

      if (bankData.state === 'ACTIVE') {
        const values: BSCheckoutFormValuesType = yield select(
          selectors.form.getFormValues(FORM_BS_CHECKOUT)
        )

        // Set the brokerage defaultMethod to this new bank. Typically to
        // auto-fill the bank account on the enter amount screen
        yield put(
          actions.components.brokerage.setBankDetails({
            account: bankData
          })
        )
        const sbMethodsR = selectors.components.buySell.getBSPaymentMethods(yield select())
        const sbMethods = sbMethodsR.getOrElse(DEFAULT_METHODS)
        if (Remote.Success.is(sbMethodsR) && sbMethods.methods.length) {
          const bankTransferMethod = sbMethods.methods.filter(
            (method) => method.type === BSPaymentTypes.BANK_TRANSFER
          )[0]

          // if there is no selected pair (BTC-USD) in redux when the we run handleMethodChange
          // it will throw so if the user adds a bank from general/settings let's skip setting the bank
          const pair = selectors.components.buySell.getBSPair(yield select())
          if (pair) {
            yield put(
              actions.components.buySell.handleMethodChange({
                isFlow: true,
                method: {
                  ...bankData,
                  limits: bankTransferMethod.limits,
                  type: BSPaymentTypes.BANK_TRANSFER
                }
              })
            )
          }
        }

        if (values?.amount) {
          yield put(
            actions.components.buySell.proceedToBuyConfirmation({
              paymentMethodId: status.id,
              paymentType: BSPaymentTypes.BANK_TRANSFER
            })
          )
        }
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

  const setupBankTransferProvider = function* () {
    try {
      const fiatCurrency = selectors.modules.profile
        .getTradingCurrency(yield select())
        .getOrFail('Could not retrieve trading currency.')
      yield put(
        actions.components.brokerage.fetchBankLinkCredentials(fiatCurrency as WalletFiatType)
      )
      return yield race({
        bankCredentials: take(actions.components.brokerage.setBankCredentials.type)
      })
    } catch (error) {
      yield put(actions.components.brokerage.fetchBankLinkCredentialsError(error))
    }
  }

  const fetchDepositTerms = function* ({ payload }: ReturnType<typeof A.fetchDepositTerms>) {
    try {
      yield put(actions.components.brokerage.fetchDepositTermsLoading())
      const data: DepositTerms = yield call(
        api.getDepositTerms,
        payload.amount,
        payload.paymentMethodId
      )
      yield put(actions.components.brokerage.fetchDepositTermsSuccess(data))
    } catch (error) {
      yield put(actions.components.brokerage.fetchDepositTermsFailure(error))
    }
  }

  const fetchBankRefreshCredentials = function* ({
    payload
  }: ReturnType<typeof A.fetchBankRefreshCredentials>) {
    try {
      yield put(actions.components.brokerage.fetchBankLinkCredentialsLoading())
      const data: BankCredentialsType = yield call(api.refreshBankAccountLink, payload, {})
      yield put(actions.components.brokerage.setBankCredentials(data))
    } catch (error) {
      yield put(actions.components.brokerage.fetchBankLinkCredentialsError(error))
    }
  }

  const fetchBankLinkCredentials = function* ({
    payload: currency
  }: ReturnType<typeof A.fetchBankLinkCredentials>) {
    const plaidEnabled = (yield select(
      selectors.core.walletOptions.getAddPlaidPaymentProvider
    )).getOrElse(false)
    const data = {
      attributes: plaidEnabled
        ? {
            supportedPartners: [BankPartners.PLAID, BankPartners.YAPILY]
          }
        : undefined,
      currency
    }
    try {
      yield put(A.fetchBankLinkCredentialsLoading())
      const credentials: BankCredentialsType = yield call(api.createBankAccountLink, data)
      yield put(A.setBankCredentials(credentials))
    } catch (e) {
      yield put(A.fetchBankLinkCredentialsError(e))
    }
  }

  const fetchBankTransferAccounts = function* () {
    try {
      yield put(A.fetchBankTransferAccountsLoading())
      const accounts = yield call(api.getBankTransferAccounts)
      yield put(A.fetchBankTransferAccountsSuccess(accounts))

      // Set the default account whenever you fetch the entire saved accounts
      // list. It's convenient.
      if (accounts.length > 0) {
        const account = accounts.find((a) => a.state === 'ACTIVE')
        yield put(A.setBankDetails({ account }))
      }
    } catch (e) {
      const { code: network_error_code, message: network_error_description } =
        errorCodeAndMessage(e)
      const error: PartialClientErrorProperties = {
        network_endpoint: '/payments/banktransfer',
        network_error_code,
        network_error_description,
        source: 'NABU'
      }
      yield put(A.fetchBankTransferAccountsError(error))
    }
  }

  const handleDepositFiatClick = function* ({
    payload
  }: ReturnType<typeof A.handleDepositFiatClick>) {
    const isUserTier2 = yield call(isTier2)
    if (!isUserTier2) {
      return
    }
    // Verify identity before deposit if TIER 2
    const completedKYC = yield call(getExtraKYCCompletedStatus, {
      api,
      context: ExtraKYCContext.FIAT_DEPOSIT,
      origin: 'BuySell' as VerifyIdentityOriginType
    })

    // If KYC was closed before answering, return
    if (!completedKYC) {
      return
    }

    yield put(
      actions.components.brokerage.showModal({
        modalType: 'BANK_DEPOSIT_MODAL',
        origin: BrokerageModalOriginType.DEPOSIT_BUTTON
      })
    )
    yield put(
      actions.components.brokerage.setDWStep({
        dwStep: BankDWStepType.LOADING
      })
    )

    const paymentMethods: BSPaymentMethodType[] = yield call(api.getBSPaymentMethods, payload, true)

    const eligibleMethods = paymentMethods.filter(
      (method) =>
        method.currency === payload &&
        (method.type === BSPaymentTypes.BANK_ACCOUNT ||
          method.type === BSPaymentTypes.BANK_TRANSFER)
    )

    if (eligibleMethods.length === 0) {
      return yield put(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.INELIGIBLE
        })
      )
    }

    // User is only allowed to do Wire/Sepa/Faster Payments so just take them to wire details screen
    if (eligibleMethods.length === 1 && eligibleMethods[0].type === BSPaymentTypes.BANK_ACCOUNT) {
      return yield put(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.WIRE_INSTRUCTIONS
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
            (a) => a.currency === payload && a.state === 'ACTIVE'
          )[0]
        })
      )
      // Resets any previous form errors
      yield put(actions.form.destroy('brokerageTx'))
    }
    yield put(
      actions.components.brokerage.setDWStep({
        dwStep: BankDWStepType.ENTER_AMOUNT
      })
    )
  }

  const handleWithdrawClick = function* ({ payload }: ReturnType<typeof A.handleWithdrawClick>) {
    const isUserTier2 = yield call(isTier2)
    if (!isUserTier2) {
      return
    }
    // Verify identity before deposit if TIER 2
    const completedKYC = yield call(getExtraKYCCompletedStatus, {
      api,
      context: ExtraKYCContext.FIAT_WITHDRAW,
      origin: 'Withdraw' as VerifyIdentityOriginType
    })

    // If KYC was closed before answering, return
    if (!completedKYC) {
      return
    }

    yield put(actions.form.destroy('brokerageTx'))
    yield put(actions.components.withdraw.showModal({ fiatCurrency: payload }))

    const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
      yield select()
    )
    const bankTransferAccounts = bankTransferAccountsR.getOrElse([])
    if (bankTransferAccounts.length) {
      yield put(
        actions.components.brokerage.setBankDetails({
          account: bankTransferAccounts.filter(
            (a) => a.currency === payload && a.state === 'ACTIVE'
          )[0]
        })
      )
    }
  }

  const showModal = function* ({ payload }: ReturnType<typeof A.showModal>) {
    const { modalType, origin } = payload

    // get current user tier
    const isUserTier2 = yield call(isTier2)

    const products = selectors.custodial.getProductEligibilityForUser(yield select()).getOrElse({
      custodialWallets: { canDepositCrypto: false, enabled: false },
      depositFiat: { reasonNotEligible: undefined }
    } as ProductEligibilityForUser)

    // show sanctions for sell
    if (products?.depositFiat?.reasonNotEligible) {
      const message =
        products.depositFiat.reasonNotEligible.reason !== CustodialSanctionsEnum.EU_5_SANCTION
          ? products.depositFiat.reasonNotEligible.message
          : undefined
      const sanctionsType = products.depositFiat.reasonNotEligible.type
      yield put(
        actions.modals.showModal(ModalName.SANCTIONS_INFO_MODAL, {
          message,
          origin: 'DepositWithdrawalModal',
          sanctionsType
        })
      )
      return
    }

    // check is user eligible to do sell/buy
    // we skip this for gold users
    if (!isUserTier2) {
      const userCanDeposit = products.custodialWallets.canDepositCrypto
      // prompt upgrade modal in case that user can't buy more
      if (!userCanDeposit) {
        yield put(
          actions.modals.showModal(ModalName.UPGRADE_NOW_SILVER_MODAL, {
            origin: 'DepositWithdrawalModal'
          })
        )
        return
      }
    }

    yield put(actions.modals.showModal(modalType, { origin }))
  }

  const ClearedStatusCheck = function* (orderId) {
    const order: BSTransactionType = yield call(api.getPaymentById, orderId)

    if (
      order.state === BSTransactionStateEnum.CLEARED ||
      order.state === BSTransactionStateEnum.COMPLETE ||
      order.state === BSTransactionStateEnum.FAILED ||
      order.state === BSTransactionStateEnum.MANUAL_REVIEW
    ) {
      return order
    }
    throw new Error('retrying to fetch for cleared status')
  }

  const AuthUrlCheck = function* (orderId) {
    const order: BSTransactionType = yield call(api.getPaymentById, orderId)

    if (
      (order.extraAttributes &&
        'authorisationUrl' in order.extraAttributes &&
        order.extraAttributes.authorisationUrl) ||
      order.state === BSTransactionStateEnum.FAILED
    ) {
      return order
    }
    throw new Error('retrying to fetch for AuthUrl')
  }

  const createFiatDeposit = function* () {
    const { amount, currency } = yield select(getFormValues('brokerageTx'))
    const { id, partner } = yield select(selectors.components.brokerage.getAccount)
    const domainsR = yield select(selectors.core.walletOptions.getDomains)
    const { comRoot } = domainsR.getOrElse({
      comRoot: 'https://www.blockchain.com'
    })
    const callback =
      partner === BankPartners.YAPILY ? `${comRoot}/brokerage-link-success` : undefined
    const attributes = { callback }
    try {
      if (partner !== BankPartners.YAPILY) {
        // Checks the status of the baank account before creating the order in case
        // we need to redirect the user to the the brokerage flow
        yield put(A.paymentAccountCheck({ amount, paymentMethodId: id }))
        yield take(actions.components.brokerage.paymentAccountRefreshSkipped.type)
      }

      const data = yield call(api.createFiatDeposit, amount, id, currency, attributes)
      const { RETRY_AMOUNT, SECONDS } = POLLING
      // If yapily we need to transition to another screen and poll for auth
      // details before polling for order status
      if (partner === BankPartners.YAPILY) {
        const order = yield retry(RETRY_AMOUNT, SECONDS * 1000, AuthUrlCheck, data.paymentId)
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
      } else {
        // The order has successfully been submitted, go to loading step while we poll order status
        yield put(
          actions.components.brokerage.setDWStep({
            dwStep: BankDWStepType.LOADING
          })
        )
      }

      // Poll for order status in order to show success, timed out or failed
      try {
        const updatedOrder: BSTransactionType = yield retry(
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

  const paymentAccountCheck = function* ({ payload }: ReturnType<typeof A.paymentAccountCheck>) {
    const { amount, paymentMethodId } = payload
    const plaidEnabled = (yield select(
      selectors.core.walletOptions.getAddPlaidPaymentProvider
    )).getOrElse(false)

    // Only used for Bank Transfers for now
    if (!paymentMethodId || !plaidEnabled) {
      yield put(A.paymentAccountRefreshSkipped())
      return
    }

    const status: ReturnType<typeof api.updateBankAccountLink> = yield call(
      api.updateBankAccountLink,
      paymentMethodId,
      { settlementRequest: { amount, product: ProductTypes.SIMPLEBUY } }
    )

    const { reason, settlementType } = status.attributes?.settlementResponse

    if (settlementType === 'UNAVAILABLE' || reason === 'REQUIRES_UPDATE') {
      yield put(
        A.setDWStep({
          dwStep: BankDWStepType.PAYMENT_ACCOUNT_ERROR,
          reason
        })
      )
      return
    }

    // If settlement is available, we can proceed
    yield put(A.paymentAccountRefreshSkipped())
  }

  return {
    createFiatDeposit,
    deleteSavedBank,
    fetchBankLinkCredentials,
    fetchBankRefreshCredentials,
    fetchBankTransferAccounts,
    fetchBankTransferUpdate,
    fetchCrossBorderLimits,
    fetchDepositTerms,
    handleDepositFiatClick,
    handleWithdrawClick,
    paymentAccountCheck,
    setupBankTransferProvider,
    showModal
  }
}
