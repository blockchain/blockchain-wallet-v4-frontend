import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { actions, selectors } from 'data'
import { APIType } from 'core/network/api'
import { call, cancel, delay, put, select, take } from 'redux-saga/effects'
import {
  CoinTypeEnum,
  Everypay3DSResponseType,
  FiatEligibleType,
  SBAccountType,
  SBCardStateType,
  SBCardType,
  SBOrderType,
  SBProviderDetailsType,
  SBQuoteType,
  SupportedWalletCurrenciesType,
  WalletOptionsType
} from 'blockchain-wallet-v4/src/types'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import {
  DEFAULT_SB_BALANCES,
  DEFAULT_SB_METHODS,
  getCoinFromPair,
  getFiatFromPair,
  getNextCardExists,
  NO_CHECKOUT_VALS,
  NO_FIAT_CURRENCY,
  NO_ORDER_EXISTS,
  NO_PAIR_SELECTED
} from './model'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { Remote } from 'blockchain-wallet-v4/src'
import {
  SBAddCardErrorType,
  SBAddCardFormValuesType,
  SBBillingAddressFormValuesType,
  SBCheckoutFormValuesType
} from './types'
import { UserDataType } from 'data/modules/types'
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
  const { createUser, isTier2, waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })

  const activateSBCard = function * ({
    card
  }: ReturnType<typeof A.activateSBCard>) {
    let providerDetails: SBProviderDetailsType
    try {
      yield put(A.activateSBCardLoading())
      const domainsR = selectors.core.walletOptions.getDomains(yield select())
      const domains = domainsR.getOrElse({
        walletHelper: 'https://wallet-helper.blockchain.com'
      } as WalletOptionsType['domains'])
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

  const addCardDetails = function * () {
    try {
      const formValues: SBAddCardFormValuesType = yield select(
        selectors.form.getFormValues('addCCForm')
      )
      const existingCardsR = S.getSBCards(yield select())
      const existingCards = existingCardsR.getOrElse([] as Array<SBCardType>)
      const nextCardAlreadyExists = getNextCardExists(existingCards, formValues)

      if (nextCardAlreadyExists) throw new Error('CARD_ALREADY_SAVED')

      yield put(
        A.setStep({
          step: '3DS_HANDLER'
        })
      )
      yield put(A.addCardDetailsLoading())

      // Create card
      yield put(A.fetchSBCard())
      yield take([AT.FETCH_SB_CARD_SUCCESS, AT.FETCH_SB_CARD_FAILURE])
      const cardR = S.getSBCard(yield select())
      const card = cardR.getOrFail('CARD_CREATION_FAILED')

      // Activate card
      yield put(A.activateSBCard(card))
      yield take([AT.ACTIVATE_SB_CARD_SUCCESS, AT.ACTIVATE_SB_CARD_FAILURE])

      const providerDetailsR = S.getSBProviderDetails(yield select())
      const providerDetails = providerDetailsR.getOrFail(
        'CARD_ACTIVATION_FAILED'
      )
      const [nonce] = yield call(api.generateUUIDs, 1)

      const response: { data: Everypay3DSResponseType } = yield call(
        // @ts-ignore
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
      yield put(A.addCardDetailsSuccess(response.data))
    } catch (e) {
      const error = errorHandler(e)
      yield put(
        A.setStep({
          step: 'ADD_CARD'
        })
      )
      yield put(actions.form.startSubmit('addCCForm'))
      yield put(
        actions.form.stopSubmit('addCCForm', {
          _error: error as SBAddCardErrorType
        })
      )
      yield put(A.addCardDetailsFailure(error))
    }
  }

  const cancelSBOrder = function * ({
    order
  }: ReturnType<typeof A.cancelSBOrder>) {
    try {
      const { state } = order
      const fiatCurrency = S.getFiatCurrency(yield select())
      const cryptoCurrency = S.getCryptoCurrency(yield select())
      yield put(actions.form.startSubmit('cancelSBOrderForm'))
      yield call(api.cancelSBOrder, order)
      yield put(actions.form.stopSubmit('cancelSBOrderForm'))
      yield put(A.fetchSBOrders())
      if (state === 'PENDING_CONFIRMATION' && fiatCurrency && cryptoCurrency) {
        const pair = S.getSBPair(yield select())
        const method = S.getSBPaymentMethod(yield select())
        if (pair) {
          yield put(
            A.setStep({
              step: 'ENTER_AMOUNT',
              cryptoCurrency,
              orderType: 'BUY',
              fiatCurrency,
              pair,
              method
            })
          )
        } else {
          yield put(
            A.setStep({
              step: 'CRYPTO_SELECTION',
              fiatCurrency
            })
          )
        }
      } else {
        yield put(actions.modals.closeAllModals())
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('cancelSBOrderForm', { _error: error }))
    }
  }

  const createSBOrder = function * ({
    paymentMethodId,
    paymentType
  }: ReturnType<typeof A.createSBOrder>) {
    const values: SBCheckoutFormValuesType = yield select(
      selectors.form.getFormValues('simpleBuyCheckout')
    )
    try {
      const pair = S.getSBPair(yield select())
      if (!values) throw new Error(NO_CHECKOUT_VALS)
      if (!pair) throw new Error(NO_PAIR_SELECTED)

      const { orderType } = values
      const fiat = getFiatFromPair(pair.pair)
      const coin = getCoinFromPair(pair.pair)
      const inputCurrency = orderType === 'BUY' ? fiat : coin
      const outputCurrency = orderType === 'BUY' ? coin : fiat
      const amount =
        orderType === 'BUY'
          ? convertStandardToBase('FIAT', values.amount)
          : convertStandardToBase(coin, values.amount)

      yield put(actions.form.startSubmit('simpleBuyCheckout'))
      const order: SBOrderType = yield call(
        api.createSBOrder,
        pair.pair,
        orderType,
        true,
        { amount, symbol: inputCurrency },
        { symbol: outputCurrency },
        paymentMethodId,
        paymentType
      )
      yield put(actions.form.stopSubmit('simpleBuyCheckout'))
      yield put(A.setStep({ step: 'CHECKOUT_CONFIRM', order }))
      yield put(A.fetchSBOrders())
    } catch (e) {
      // After CC has been activated we try to create an order
      // If order creation fails go back to ENTER_AMOUNT step
      // Wait for the form to be INITIALIZED and display err
      const step = S.getStep(yield select())
      if (step !== 'ENTER_AMOUNT') {
        const pair = S.getSBPair(yield select())
        const method = S.getSBPaymentMethod(yield select())
        if (pair) {
          yield put(
            A.setStep({
              step: 'ENTER_AMOUNT',
              cryptoCurrency: getCoinFromPair(pair.pair),
              fiatCurrency: getFiatFromPair(pair.pair),
              pair,
              method
            })
          )
          yield take(AT.INITIALIZE_CHECKOUT)
          yield delay(3000)
          yield put(actions.form.startSubmit('simpleBuyCheckout'))
        }
      }

      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('simpleBuyCheckout', { _error: error }))
    }
  }

  const confirmSBCreditCardOrder = function * () {
    try {
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error(NO_ORDER_EXISTS)
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      const domainsR = selectors.core.walletOptions.getDomains(yield select())
      const domains = domainsR.getOrElse({
        walletHelper: 'https://wallet-helper.blockchain.com'
      } as WalletOptionsType['domains'])
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

  const confirmSBFundsOrder = function * () {
    try {
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error(NO_ORDER_EXISTS)
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      const confirmedOrder: SBOrderType = yield call(api.confirmSBOrder, order)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm'))
      yield put(A.fetchSBOrders())
      yield put(A.setStep({ step: 'ORDER_SUMMARY', order: confirmedOrder }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm', { _error: error }))
    }
  }

  const deleteSBCard = function * ({
    cardId
  }: ReturnType<typeof A.deleteSBCard>) {
    try {
      if (!cardId) return
      yield put(actions.form.startSubmit('linkedCards'))
      yield call(api.deleteSBCard, cardId)
      yield put(A.fetchSBCards(true))
      yield take([AT.FETCH_SB_CARDS_SUCCESS, AT.FETCH_SB_CARDS_FAILURE])
      yield put(actions.form.stopSubmit('linkedCards'))
      yield put(actions.alerts.displaySuccess('Card removed.'))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('linkedCards', { _error: error }))
      yield put(actions.alerts.displayError('Error removing card.'))
    }
  }

  const fetchSBBalances = function * ({
    currency,
    skipLoading
  }: ReturnType<typeof A.fetchSBBalances>) {
    try {
      if (!skipLoading) yield put(A.fetchSBBalancesLoading())
      if (!(yield call(isTier2)))
        return yield put(A.fetchSBBalancesSuccess(DEFAULT_SB_BALANCES))
      const balances: ReturnType<typeof api.getSBBalances> = yield call(
        api.getSBBalances,
        currency
      )
      // const locks: ReturnType<typeof api.getWithdrawalLocks> = yield call(
      //   api.getWithdrawalLocks
      // )
      // eslint-disable-next-line
      // console.log(locks)
      yield put(A.fetchSBBalancesSuccess(balances))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBBalancesFailure(error))
    }
  }

  const fetchSBCard = function * () {
    let card: SBCardType
    try {
      yield put(A.fetchSBCardLoading())
      const currency = S.getFiatCurrency(yield select())
      if (!currency) throw new Error(NO_FIAT_CURRENCY)

      const userDataR = selectors.modules.profile.getUserData(yield select())
      const billingAddressForm:
        | SBBillingAddressFormValuesType
        | undefined = yield select(
        selectors.form.getFormValues('ccBillingAddress')
      )

      const userData = userDataR.getOrFail('NO_USER_ADDRESS')
      const address = billingAddressForm || userData.address
      if (!address) throw new Error('NO_USER_ADDRESS')

      card = yield call(
        api.createSBCard,
        currency,
        {
          ...address
        },
        userData.email
      )
      yield put(A.fetchSBCardSuccess(card))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBCardFailure(error))
    }
  }

  const fetchSBCards = function * ({
    payload
  }: ReturnType<typeof A.fetchSBCards>) {
    try {
      yield call(createUser)
      yield call(waitForUserData)
      const { skipLoading } = payload
      if (!(yield call(isTier2))) return yield put(A.fetchSBCardsSuccess([]))
      if (!skipLoading) yield put(A.fetchSBCardsLoading())
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

  const fetchSBOrders = function * ({
    payload
  }: ReturnType<typeof A.fetchSBOrders>) {
    try {
      yield call(waitForUserData)
      const { skipLoading } = payload
      if (!skipLoading) yield put(A.fetchSBOrdersLoading())
      const orders = yield call(api.getSBOrders, {})
      yield put(A.fetchSBOrdersSuccess(orders))
    } catch (e) {
      const error = errorHandler(e)
      if (!(yield call(isTier2))) return yield put(A.fetchSBOrdersSuccess([]))
      yield put(A.fetchSBOrdersFailure(error))
    }
  }

  const fetchSBPairs = function * ({
    currency
  }: ReturnType<typeof A.fetchSBPairs>) {
    try {
      yield put(A.fetchSBPairsLoading())
      yield put(actions.preferences.setSBFiatCurrency(currency))
      const { pairs }: ReturnType<typeof api.getSBPairs> = yield call(
        api.getSBPairs,
        currency
      )
      const supportedCoins = selectors.core.walletOptions
        .getSupportedCoins(yield select())
        .getOrElse({} as SupportedWalletCurrenciesType)
      const filteredPairs = pairs.filter(pair => {
        return (
          getCoinFromPair(pair.pair) in CoinTypeEnum &&
          supportedCoins[getCoinFromPair(pair.pair)].invited
        )
      })
      yield put(A.fetchSBPairsSuccess(filteredPairs))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPairsFailure(error))
    }
  }

  const fetchSBPaymentAccount = function * () {
    try {
      yield put(A.fetchSBPaymentAccountLoading())
      const fiatCurrency = S.getFiatCurrency(yield select())
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
      const userData = selectors.modules.profile
        .getUserData(yield select())
        .getOrElse({
          state: 'NONE'
        } as UserDataType)
      if (userData.state === 'NONE' && !currency) {
        return yield put(A.fetchSBPaymentMethodsSuccess(DEFAULT_SB_METHODS))
      }
      yield call(createUser)
      const isUserTier2 = yield call(isTier2)

      // Only show Loading if not Success
      const sbMethodsR = S.getSBPaymentMethods(yield select())
      const sbMethods = sbMethodsR.getOrElse(DEFAULT_SB_METHODS)
      if (!Remote.Success.is(sbMethodsR) || !sbMethods.methods.length)
        yield put(A.fetchSBPaymentMethodsLoading())

      // If no currency fallback to sb fiat currency or wallet
      const fallbackFiatCurrency =
        S.getFiatCurrency(yield select()) ||
        (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')

      const methods = yield call(
        api.getSBPaymentMethods,
        currency || fallbackFiatCurrency,
        isUserTier2 ? true : undefined
      )
      yield put(A.fetchSBPaymentMethodsSuccess(methods))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPaymentMethodsFailure(error))
    }
  }

  const fetchSBQuote = function * (payload: ReturnType<typeof A.fetchSBQuote>) {
    try {
      const { pair, orderType, amount } = payload
      yield put(A.fetchSBQuoteLoading())
      const quote: SBQuoteType = yield call(
        api.getSBQuote,
        pair,
        orderType,
        amount
      )
      yield put(A.fetchSBQuoteSuccess(quote))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBQuoteFailure(error))
    }
  }

  const handleSBDepositFiatClick = function * ({
    payload
  }: ReturnType<typeof A.handleSBDepositFiatClick>) {
    const { coin } = payload

    yield call(waitForUserData)
    const isUserTier2 = yield call(isTier2)

    if (!isUserTier2) {
      yield put(A.showModal('EmptyFeed'))
      yield put(
        A.setStep({
          step: 'KYC_REQUIRED'
        })
      )
    } else {
      yield put(A.showModal('EmptyFeed'))

      // wait for modal
      yield delay(500)
      yield put(
        A.setStep({
          step: 'TRANSFER_DETAILS',
          displayBack: false,
          fiatCurrency: coin
        })
      )
    }
  }

  const handleSBSuggestedAmountClick = function * ({
    payload
  }: ReturnType<typeof A.handleSBSuggestedAmountClick>) {
    const { amount, coin } = payload
    const standardAmt = convertBaseToStandard(coin, amount)

    yield put(actions.form.change('simpleBuyCheckout', 'amount', standardAmt))
  }

  const handleSBMethodChange = function * (
    action: ReturnType<typeof A.handleSBMethodChange>
  ) {
    const values: SBCheckoutFormValuesType = yield select(
      selectors.form.getFormValues('simpleBuyCheckout')
    )

    const { method } = action
    const cryptoCurrency = S.getCryptoCurrency(yield select()) || 'BTC'
    const originalFiatCurrency = S.getFiatCurrency(yield select())
    const fiatCurrency = method.currency || S.getFiatCurrency(yield select())
    const pair = S.getSBPair(yield select())

    if (!pair) return NO_PAIR_SELECTED
    const isUserTier2 = yield call(isTier2)

    if (!isUserTier2) {
      switch (method.type) {
        // https://blockc.slack.com/archives/GT1JZ1ZN2/p1596546978351100?thread_ts=1596541628.345800&cid=GT1JZ1ZN2
        // REMOVE THIS WHEN BACKEND CAN HANDLE PENDING 'FUNDS' ORDERS
        // 👇--------------------------------------------------------
        case 'BANK_ACCOUNT':
          return yield put(
            A.setStep({
              step: 'KYC_REQUIRED'
            })
          )
        // REMOVE THIS WHEN BACKEND CAN HANDLE PENDING 'FUNDS' ORDERS
        // 👆--------------------------------------------------------
        case 'PAYMENT_CARD':
          // ADD THIS WHEN BACKEND CAN HANDLE PENDING 'FUNDS' ORDERS
          // 👇-----------------------------------------------------
          // const methodType =
          //   method.type === 'BANK_ACCOUNT' ? 'FUNDS' : method.type
          // return yield put(A.createSBOrder(undefined, methodType))
          // 👆------------------------------------------------------

          return yield put(A.createSBOrder(undefined, method.type))
        default:
          return
      }
    }

    // User is Tier 2
    switch (method.type) {
      case 'BANK_ACCOUNT':
        return yield put(
          A.setStep({
            step: 'TRANSFER_DETAILS',
            displayBack: true,
            fiatCurrency
          })
        )
      case 'PAYMENT_CARD':
        return yield put(
          A.setStep({
            step: 'ADD_CARD'
          })
        )
      default:
        yield put(
          A.setStep({
            step: 'ENTER_AMOUNT',
            orderType: values?.orderType,
            method,
            cryptoCurrency,
            fiatCurrency
          })
        )
    }

    // Change wallet/sb fiatCurrency if necessary
    // and fetch new pairs w/ new fiatCurrency
    if (originalFiatCurrency !== fiatCurrency) {
      yield put(actions.modules.settings.updateCurrency(method.currency, true))
      yield put(A.fetchSBPairs(method.currency))
    }
  }

  const initializeBillingAddress = function * () {
    yield call(waitForUserData)
    const userDataR = selectors.modules.profile.getUserData(yield select())
    const userData = userDataR.getOrElse({} as UserDataType)
    const address = userData
      ? userData.address
      : {
          country: 'GB',
          line1: '',
          line2: '',
          city: '',
          postCode: '',
          state: ''
        }

    yield put(
      actions.form.initialize('ccBillingAddress', {
        ...address
      })
    )
  }

  const initializeCheckout = function * ({
    orderType,
    amount
  }: ReturnType<typeof A.initializeCheckout>) {
    try {
      yield call(createUser)
      yield call(waitForUserData)

      const fiatCurrency = S.getFiatCurrency(yield select())
      if (!fiatCurrency) throw new Error(NO_FIAT_CURRENCY)
      const pair = S.getSBPair(yield select())
      if (!pair) throw new Error(NO_PAIR_SELECTED)

      // Fetch rates
      yield put(A.fetchSBQuote(pair.pair, orderType, '0'))

      yield put(
        actions.form.initialize('simpleBuyCheckout', {
          orderType,
          amount
        } as SBCheckoutFormValuesType)
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(error))
    }
  }

  const pollSBCardErrorHandler = function * (state: SBCardStateType) {
    yield put(A.setStep({ step: 'ADD_CARD' }))
    yield put(actions.form.startSubmit('addCCForm'))

    let error
    switch (state) {
      case 'PENDING':
        error = 'PENDING_CARD_AFTER_POLL'
        break
      default:
        error = 'LINK_CARD_FAILED'
    }

    yield put(
      actions.form.stopSubmit('addCCForm', {
        _error: error
      })
    )
  }

  const pollSBBalances = function * () {
    const skipLoading = true

    yield put(A.fetchSBBalances(undefined, skipLoading))
  }

  const pollSBCard = function * ({ payload }: ReturnType<typeof A.pollSBCard>) {
    let retryAttempts = 0
    let maxRetryAttempts = 20

    const { cardId } = payload

    let card: ReturnType<typeof api.getSBCard> = yield call(
      api.getSBCard,
      cardId
    )
    let step = S.getStep(yield select())

    while (
      (card.state === 'CREATED' || card.state === 'PENDING') &&
      retryAttempts < maxRetryAttempts
    ) {
      card = yield call(api.getSBCard, cardId)
      retryAttempts++
      step = S.getStep(yield select())
      if (step !== '3DS_HANDLER') {
        yield cancel()
      }
      yield delay(3000)
    }

    switch (card.state) {
      case 'BLOCKED':
        yield call(pollSBCardErrorHandler, card.state)
        return
      case 'ACTIVE':
        const skipLoading = true
        const order = S.getSBOrder(yield select())
        yield put(A.fetchSBCards(skipLoading))
        // If the order was already created
        if (order && order.state === 'PENDING_CONFIRMATION') {
          return yield put(A.confirmSBCreditCardOrder(card.id))
        } else {
          return yield put(A.createSBOrder(card.id))
        }
      default:
        yield call(pollSBCardErrorHandler, card.state)
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
    let step = S.getStep(yield select())

    while (
      order.state === 'PENDING_DEPOSIT' &&
      retryAttempts < maxRetryAttempts
    ) {
      order = yield call(api.getSBOrder, orderId)
      step = S.getStep(yield select())
      retryAttempts++
      if (step !== '3DS_HANDLER') {
        yield cancel()
      }
      yield delay(3000)
    }

    yield put(A.setStep({ step: 'ORDER_SUMMARY', order }))
  }

  const setStepChange = function * (action: ReturnType<typeof A.setStep>) {
    if (action.type === '@EVENT.SET_SB_STEP') {
      if (action.payload.step === 'ORDER_SUMMARY') {
        yield call(pollSBBalances)
      }
    }
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin, cryptoCurrency } = payload
    yield put(
      actions.modals.showModal('SIMPLE_BUY_MODAL', { origin, cryptoCurrency })
    )
    const fiatCurrency = selectors.preferences.getSBFiatCurrency(yield select())
    const latestPendingOrder = S.getSBLatestPendingOrder(yield select())

    if (!fiatCurrency) {
      yield put(A.setStep({ step: 'CURRENCY_SELECTION' }))
    } else if (latestPendingOrder) {
      const step =
        latestPendingOrder.state === 'PENDING_CONFIRMATION'
          ? 'CHECKOUT_CONFIRM'
          : 'ORDER_SUMMARY'
      yield put(
        A.setStep({
          step,
          order: latestPendingOrder
        })
      )
    } else if (cryptoCurrency) {
      yield put(
        A.setStep({ step: 'ENTER_AMOUNT', cryptoCurrency, fiatCurrency })
      )
    } else {
      yield put(
        A.setStep({ step: 'CRYPTO_SELECTION', cryptoCurrency, fiatCurrency })
      )
    }
  }

  return {
    activateSBCard,
    addCardDetails,
    cancelSBOrder,
    confirmSBCreditCardOrder,
    confirmSBFundsOrder,
    createSBOrder,
    deleteSBCard,
    fetchSBBalances,
    fetchSBCard,
    fetchSBCards,
    fetchSBFiatEligible,
    fetchSBOrders,
    fetchSBPairs,
    fetchSBPaymentAccount,
    fetchSBPaymentMethods,
    fetchSBQuote,
    handleSBDepositFiatClick,
    handleSBSuggestedAmountClick,
    handleSBMethodChange,
    initializeBillingAddress,
    initializeCheckout,
    pollSBBalances,
    pollSBCard,
    pollSBOrder,
    setStepChange,
    showModal
  }
}
