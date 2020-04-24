import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { call, delay, put, select, take } from 'redux-saga/effects'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import {
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  SBAccountType,
  SBCardStateType,
  SBCardType,
  SBOrderType,
  SBProviderDetailsType,
  SBQuoteType
} from 'core/types'
import {
  getCoinFromPair,
  getFiatFromPair,
  NO_FIAT_CURRENCY,
  NO_PAIR_SELECTED
} from './model'
import { SBAddCardFormValuesType, SBCheckoutFormValuesType } from './types'
import moment from 'moment'
import profileSagas from '../../modules/profile/sagas'

export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const { createUser, waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const isTier2 = function * () {
    yield call(waitForUserData)
    const userDataR = selectors.modules.profile.getUserData(yield select())
    const userData = userDataR.getOrElse({ tiers: { current: 0 } })
    return userData.tiers && userData.tiers.current >= 2
  }

  const activateSBCard = function * ({
    card
  }: ReturnType<typeof A.activateSBCard>) {
    let providerDetails: SBProviderDetailsType
    try {
      yield put(A.activateSBCardLoading())
      const domainsR = selectors.core.walletOptions.getDomains(yield select())
      const domains = domainsR.getOrElse({
        walletHelper: 'https://wallet-helper.blockchain.com'
      })
      if (card.partner === 'EVERYPAY') {
        providerDetails = yield call(
          api.activateSBCard,
          card.id,
          `${domains.walletHelper}/wallet-helper/everypay/#/response-handler`
        )
        yield put(A.activateSBCardSuccess(providerDetails))
      } else {
        throw new Error('UNKNOWN_PARTNER')
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.activateSBCardFailure(error))
    }
  }

  const cancelSBOrder = function * ({
    order
  }: ReturnType<typeof A.cancelSBOrder>) {
    try {
      const { state } = order
      const fiatCurrency = S.getFiatCurrency(yield select())
      yield put(actions.form.startSubmit('cancelSBOrderForm'))
      yield call(api.cancelSBOrder, order)
      yield put(actions.form.stopSubmit('cancelSBOrderForm'))
      yield put(A.fetchSBOrders())
      if (state === 'PENDING_CONFIRMATION' && fiatCurrency) {
        yield put(
          A.setStep({
            step: 'ENTER_AMOUNT',
            fiatCurrency
          })
        )
      } else {
        yield put(actions.modals.closeAllModals())
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('cancelSBOrderForm', { _error: error }))
    }
  }

  const createSBOrder = function * ({
    paymentMethodId
  }: ReturnType<typeof A.createSBOrder>) {
    try {
      const values: SBCheckoutFormValuesType = yield select(
        selectors.form.getFormValues('simpleBuyCheckout')
      )
      const pair = values.pair
      const amount = convertStandardToBase('FIAT', values.amount)
      if (!pair) throw new Error(NO_PAIR_SELECTED)
      // TODO: Simple Buy - make dynamic
      const action = 'BUY'
      yield put(actions.form.startSubmit('simpleBuyCheckout'))
      const order: SBOrderType = yield call(
        api.createSBOrder,
        pair.pair,
        action,
        true,
        { amount, symbol: getFiatFromPair(pair.pair) },
        { symbol: getCoinFromPair(pair.pair) },
        paymentMethodId
      )
      yield put(actions.form.stopSubmit('simpleBuyCheckout'))
      yield put(A.setStep({ step: 'CHECKOUT_CONFIRM', order }))
      yield put(A.fetchSBOrders())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('simpleBuyCheckout', { _error: error }))
    }
  }

  const confirmSBBankTransferOrder = function * () {
    try {
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error('NO_ORDER_EXISTS_TO_CONFIRM')
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      const confirmedOrder: SBOrderType = yield call(api.confirmSBOrder, order)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm'))
      yield put(A.setStep({ step: 'TRANSFER_DETAILS', order: confirmedOrder }))
      yield put(A.fetchSBOrders())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm', { _error: error }))
    }
  }

  const confirmSBCreditCardOrder = function * () {
    try {
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error('NO_ORDER_EXISTS_TO_CONFIRM')
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      const domainsR = selectors.core.walletOptions.getDomains(yield select())
      const domains = domainsR.getOrElse({
        walletHelper: 'https://wallet-helper.blockchain.com'
      })
      const attributes = order.paymentMethodId
        ? {
            everypay: {
              customerUrl: `${domains.walletHelper}/wallet-helper/everypay/#/response-handler`
            }
          }
        : undefined
      const confirmedOrder: SBOrderType = yield call(
        api.confirmSBOrder,
        order,
        attributes
      )
      yield put(actions.form.stopSubmit('sbCheckoutConfirm'))
      yield put(A.setStep({ step: '3DS_HANDLER', order: confirmedOrder }))
      yield put(A.fetchSBOrders())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm', { _error: error }))
    }
  }

  const fetchEverypay3DSDetails = function * () {
    try {
      yield put(actions.form.startSubmit('addCCForm'))
      yield put(A.fetchEverypay3DSDetailsLoading())
      const formValues: SBAddCardFormValuesType = yield select(
        selectors.form.getFormValues('addCCForm')
      )
      const providerDetailsR = S.getSBProviderDetails(yield select())
      const providerDetails = providerDetailsR.getOrFail('NO_PROVIDER_DETAILS')
      const [nonce] = yield call(api.generateUUIDs, 1)

      const response: { data: Everypay3DSResponseType } = yield call(
        api.submitSBCardDetailsToEverypay,
        {
          ccNumber: formValues['card-number'].replace(/[^\d]/g, ''),
          cvc: formValues['cvc'],
          expirationDate: moment(formValues['expiry-date'], 'MM/YY'),
          holderName: formValues['name-on-card'],
          accessToken: providerDetails.everypay.mobileToken,
          apiUserName: providerDetails.everypay.apiUsername,
          nonce: nonce
        }
      )
      yield put(actions.form.stopSubmit('addCCForm'))
      yield put(A.fetchEverypay3DSDetailsSuccess(response.data))
      yield put(
        A.setStep({
          step: '3DS_HANDLER'
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('addCCForm', { _error: error }))
      yield put(A.fetchEverypay3DSDetailsFailure(error))
    }
  }

  const fetchSBBalances = function * ({
    currency
  }: ReturnType<typeof A.fetchSBBalances>) {
    try {
      if (!(yield call(isTier2))) return

      // yield put(A.fetchSBBalancesLoading())
      const orders = yield call(api.getSBBalances, currency)
      yield put(A.fetchSBBalancesSuccess(orders))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBBalancesFailure(error))
    }
  }

  const fetchSBCard = function * ({ cardId }: ReturnType<typeof A.fetchSBCard>) {
    let card: SBCardType
    try {
      yield put(A.fetchSBCardLoading())
      const currency = S.getFiatCurrency(yield select())
      if (!currency) throw new Error(NO_FIAT_CURRENCY)

      if (!cardId) {
        const userDataR = selectors.modules.profile.getUserData(yield select())
        const userData = userDataR.getOrFail('NO_USER_ADDRESS')
        const address = userData.address
        if (!address) throw new Error('NO_USER_ADDRESS')

        card = yield call(api.createSBCard, currency, {
          ...address
        })
      } else {
        card = yield call(api.getSBCard, cardId)
      }
      yield put(A.fetchSBCardSuccess(card))
      yield put(A.activateSBCard(card))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBCardFailure(error))
    }
  }

  const fetchSBCards = function * () {
    try {
      yield call(waitForUserData)
      yield put(A.fetchSBCardsLoading())
      const cards = yield call(api.getSBCards)
      yield put(A.fetchSBCardsSuccess(cards))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBCardsFailure(error))
    }
  }

  const fetchSBFiatEligible = function * ({
    currency
  }: ReturnType<typeof A.fetchSBFiatEligible>) {
    try {
      let fiatEligible: FiatEligibleType
      yield put(A.fetchSBFiatEligibleLoading())
      // If user is not tier 2 fake eligible check to allow KYC
      if (!(yield call(isTier2))) {
        fiatEligible = {
          eligible: true,
          paymentAccountEligible: true,
          simpleBuyTradingEligible: true
        }
      } else {
        fiatEligible = yield call(api.getSBFiatEligible, currency)
      }
      yield put(A.fetchSBFiatEligibleSuccess(fiatEligible))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBFiatEligibleFailure(error))
    }
  }

  const fetchSBOrders = function * () {
    try {
      if (!(yield call(isTier2))) return

      yield put(A.fetchSBOrdersLoading())
      const orders = yield call(api.getSBOrders, {})
      yield put(A.fetchSBOrdersSuccess(orders))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBOrdersFailure(error))
    }
  }

  const fetchSBPairs = function * ({
    currency
  }: ReturnType<typeof A.fetchSBPairs>) {
    try {
      yield put(A.fetchSBPairsLoading())
      yield put(actions.preferences.setSBFiatCurrency(currency))
      const { pairs } = yield call(api.getSBPairs, currency)
      yield put(A.fetchSBPairsSuccess(pairs))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPairsFailure(error))
    }
  }

  const fetchSBPaymentAccount = function * () {
    try {
      yield put(A.fetchSBPaymentAccountLoading())
      const order = S.getSBOrder(yield select())
      const fiatCurrency: FiatType | false = order
        ? (order.pair.split('-')[1] as FiatType)
        : false
      if (!fiatCurrency) throw new Error(NO_FIAT_CURRENCY)
      const account: SBAccountType = yield call(
        api.getSBPaymentAccount,
        fiatCurrency
      )
      yield put(A.fetchSBPaymentAccountSuccess(account))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPaymentAccountFailure(error))
    }
  }

  const fetchSBPaymentMethods = function * ({
    currency
  }: ReturnType<typeof A.fetchSBPaymentMethods>) {
    try {
      yield call(waitForUserData)
      yield put(A.fetchSBPaymentMethodsLoading())
      const methods = yield call(api.getSBPaymentMethods, currency)
      yield put(A.fetchSBPaymentMethodsSuccess(methods))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPaymentMethodsFailure(error))
    }
  }

  const fetchSBQuote = function * () {
    try {
      yield put(A.fetchSBQuoteLoading())
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error('NO_ORDER')
      // TODO: Simple Buy - make dynamic
      const quote: SBQuoteType = yield call(
        api.getSBQuote,
        order.pair,
        'BUY',
        order.inputQuantity
      )
      yield put(A.fetchSBQuoteSuccess(quote))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBQuoteFailure(error))
    }
  }

  const fetchSBSuggestedAmounts = function * ({
    currency
  }: ReturnType<typeof A.fetchSBSuggestedAmounts>) {
    try {
      yield put(A.fetchSBSuggestedAmountsLoading())
      const amounts = yield call(api.getSBSuggestedAmounts, currency)
      yield put(A.fetchSBSuggestedAmountsSuccess(amounts))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBSuggestedAmountsFailure(error))
    }
  }

  const handleSBSuggestedAmountClick = function * ({
    payload
  }: ReturnType<typeof A.handleSBSuggestedAmountClick>) {
    const { amount } = payload
    const standardAmt = convertBaseToStandard('FIAT', amount)

    yield put(actions.form.change('simpleBuyCheckout', 'amount', standardAmt))
  }

  const initializeCheckout = function * ({
    pairs,
    paymentMethods,
    orderType
  }: ReturnType<typeof A.initializeCheckout>) {
    try {
      yield call(createUser)
      yield call(waitForUserData)

      const fiatCurrency = S.getFiatCurrency(yield select())
      const cryptoCurrency = S.getCryptoCurrency(yield select())
      if (!fiatCurrency) throw new Error(NO_FIAT_CURRENCY)

      yield put(A.fetchSBSuggestedAmounts(fiatCurrency))

      const pair = pairs.find(
        pair => getCoinFromPair(pair.pair) === cryptoCurrency
      )

      yield put(
        actions.form.initialize('simpleBuyCheckout', {
          method: paymentMethods.methods[0],
          orderType,
          pair: pair || pairs[0]
        } as SBCheckoutFormValuesType)
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(error))
    }
  }

  const pollErrorHandler = function * (state: SBCardStateType) {
    yield put(A.setStep({ step: 'ADD_CARD' }))
    yield take(AT.ACTIVATE_SB_CARD_SUCCESS)
    yield put(actions.form.startSubmit('addCCForm'))
    yield put(
      actions.form.stopSubmit('addCCForm', {
        _error: `Card state is: ${state}. Please try again or contact support if you believe this occured in error.`
      })
    )
  }

  const pollSBCard = function * ({ payload }: ReturnType<typeof A.pollSBCard>) {
    let retryAttempts = 0
    let maxRetryAttempts = 20

    const { cardId } = payload
    let card: ReturnType<typeof api.getSBCard> = yield call(
      api.getSBCard,
      cardId
    )

    while (
      (card.state === 'CREATED' || card.state === 'PENDING') &&
      retryAttempts < maxRetryAttempts
    ) {
      card = yield call(api.getSBCard, cardId)
      retryAttempts++
      yield delay(3000)
    }

    switch (card.state) {
      case 'BLOCKED':
        yield call(pollErrorHandler, card.state)
        return
      case 'ACTIVE':
        return yield put(A.createSBOrder())
      default:
        yield call(pollErrorHandler, card.state)
    }
  }

  const pollSBOrder = function * ({ payload }: ReturnType<typeof A.pollSBOrder>) {
    let retryAttempts = 0
    let maxRetryAttempts = 20

    const { orderId } = payload
    let order: ReturnType<typeof api.getSBOrder> = yield call(
      api.getSBOrder,
      orderId
    )

    while (
      order.state === 'PENDING_DEPOSIT' &&
      retryAttempts < maxRetryAttempts
    ) {
      order = yield call(api.getSBOrder, orderId)
      retryAttempts++
      yield delay(3000)
    }

    yield put(A.setStep({ step: 'ORDER_SUMMARY', order }))
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin, cryptoCurrency } = payload
    yield put(
      actions.modals.showModal('SIMPLE_BUY_MODAL', { origin, cryptoCurrency })
    )
    const fiatCurrency = selectors.preferences.getSBFiatCurrency(yield select())

    if (!fiatCurrency) {
      yield put(A.setStep({ step: 'CURRENCY_SELECTION' }))
    } else {
      yield put(
        A.setStep({ step: 'ENTER_AMOUNT', cryptoCurrency, fiatCurrency })
      )
    }
  }

  return {
    activateSBCard,
    cancelSBOrder,
    confirmSBBankTransferOrder,
    confirmSBCreditCardOrder,
    createSBOrder,
    fetchEverypay3DSDetails,
    fetchSBBalances,
    fetchSBCard,
    fetchSBCards,
    fetchSBFiatEligible,
    fetchSBOrders,
    fetchSBPairs,
    fetchSBPaymentAccount,
    fetchSBPaymentMethods,
    fetchSBQuote,
    fetchSBSuggestedAmounts,
    handleSBSuggestedAmountClick,
    initializeCheckout,
    pollSBCard,
    pollSBOrder,
    showModal
  }
}
