import BigNumber from 'bignumber.js'
import { getQuote } from 'blockchain-wallet-v4-frontend/src/modals/SimpleBuy/EnterAmount/Checkout/validation'
import moment from 'moment'
import { defaultTo, filter, prop } from 'ramda'
import {
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  retry,
  select,
  take
} from 'redux-saga/effects'

import { Remote } from 'blockchain-wallet-v4/src'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import {
  CoinTypeEnum,
  Everypay3DSResponseType,
  FiatEligibleType,
  OrderType,
  ProductTypes,
  SBAccountType,
  SBCardStateType,
  SBCardType,
  SBOrderType,
  SBProviderDetailsType,
  SBQuoteType,
  SupportedWalletCurrenciesType,
  SwapOrderType,
  WalletOptionsType
} from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { actions, selectors } from 'data'
import { generateProvisionalPaymentAmount } from 'data/coins/utils'
import { UserDataType } from 'data/modules/types'
import {
  AddBankStepType,
  BankPartners,
  BankTransferAccountType,
  BrokerageModalOriginType
} from 'data/types'

import profileSagas from '../../modules/profile/sagas'
import { FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS } from '../brokerage/actionTypes'
import brokerageSagas from '../brokerage/sagas'
import {
  convertBaseToStandard,
  convertStandardToBase
} from '../exchange/services'
import sendSagas from '../send/sagas'
import { FALLBACK_DELAY, getOutputFromPair } from '../swap/model'
import swapSagas from '../swap/sagas'
import { getRate, NO_QUOTE } from '../swap/utils'
import { selectReceiveAddress } from '../utils/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import {
  DEFAULT_SB_BALANCES,
  DEFAULT_SB_METHODS,
  getCoinFromPair,
  getFiatFromPair,
  getNextCardExists,
  NO_ACCOUNT,
  NO_CHECKOUT_VALS,
  NO_FIAT_CURRENCY,
  NO_ORDER_EXISTS,
  NO_PAIR_SELECTED,
  NO_PAYMENT_TYPE,
  POLLING,
  SDD_TIER
} from './model'
import * as S from './selectors'
import * as T from './types'
import { getDirection } from './utils'

export const logLocation = 'components/simpleBuy/sagas'

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
  const { buildAndPublishPayment, paymentGetOrElse } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const { calculateProvisionalPayment } = swapSagas({
    api,
    coreSagas,
    networks
  })
  const { fetchBankTransferAccounts } = brokerageSagas({
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
      const formValues: T.SBAddCardFormValuesType = yield select(
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

      let waitForAction: boolean = true
      // Create card
      if (formValues.billingaddress && !formValues.sameAsBillingAddress) {
        yield call(fetchSBCardSDD, formValues.billingaddress)
        waitForAction = false
      } else {
        yield put(A.fetchSBCard())
      }
      if (waitForAction) {
        yield take([AT.FETCH_SB_CARD_SUCCESS, AT.FETCH_SB_CARD_FAILURE])
      }
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
          _error: error as T.SBAddCardErrorType
        })
      )
      yield put(A.addCardDetailsFailure(error))
    }
  }

  const addCardFinished = function * () {
    // This is primarily used in general settings to short circuit
    // the SB flow when adding a new card but not buying crypto
    yield take(AT.FETCH_SB_CARDS_SUCCESS)
    yield put(actions.modals.closeAllModals())
  }

  const cancelSBOrder = function * ({
    order
  }: ReturnType<typeof A.cancelSBOrder>) {
    try {
      const { state } = order
      const fiatCurrency = getFiatFromPair(order.pair)
      const cryptoCurrency = getCoinFromPair(order.pair)
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
              orderType: order.side || OrderType.BUY,
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
    const values: T.SBCheckoutFormValuesType = yield select(
      selectors.form.getFormValues('simpleBuyCheckout')
    )
    try {
      const pair = S.getSBPair(yield select())
      if (!values) throw new Error(NO_CHECKOUT_VALS)
      if (!pair) throw new Error(NO_PAIR_SELECTED)
      const { fix, orderType } = values

      // since two screens use this order creation saga and they have different
      // forms, detect the order type and set correct form to submitting
      if (orderType === OrderType.SELL) {
        yield put(actions.form.startSubmit('previewSell'))
      } else {
        yield put(actions.form.startSubmit('simpleBuyCheckout'))
      }

      const fiat = getFiatFromPair(pair.pair)
      const coin = getCoinFromPair(pair.pair)
      const amount =
        fix === 'FIAT'
          ? convertStandardToBase('FIAT', values.amount)
          : convertStandardToBase(coin, values.amount)
      const inputCurrency = orderType === OrderType.BUY ? fiat : coin
      const outputCurrency = orderType === OrderType.BUY ? coin : fiat
      const input = { amount, symbol: inputCurrency }
      const output = { amount, symbol: outputCurrency }

      // used for sell only now, eventually buy as well
      // TODO: use swap2 quote for buy AND sell
      if (orderType === OrderType.SELL) {
        const from = S.getSwapAccount(yield select())
        const quote = S.getSellQuote(yield select()).getOrFail(NO_QUOTE)
        if (!from) throw new Error(NO_ACCOUNT)

        const direction = getDirection(from)
        const cryptoAmt =
          fix === 'CRYPTO'
            ? amount
            : convertStandardToBase(
                from.coin,
                getQuote(
                  pair.pair,
                  convertStandardToBase('FIAT', quote.rate),
                  fix,
                  amount
                )
              )
        const refundAddr =
          direction === 'FROM_USERKEY'
            ? yield call(selectReceiveAddress, from, networks)
            : undefined
        const sellOrder: SwapOrderType = yield call(
          api.createSwapOrder,
          direction,
          quote.quote.id,
          cryptoAmt,
          getFiatFromPair(pair.pair),
          undefined,
          refundAddr
        )
        // on chain
        if (direction === 'FROM_USERKEY') {
          const paymentR = S.getPayment(yield select())
          // @ts-ignore
          let payment = paymentGetOrElse(from.coin, paymentR)
          try {
            yield call(
              buildAndPublishPayment,
              payment.coin,
              payment,
              sellOrder.kind.depositAddress
            )
            yield call(api.updateSwapOrder, sellOrder.id, 'DEPOSIT_SENT')
          } catch (e) {
            yield call(api.updateSwapOrder, sellOrder.id, 'CANCEL')
            throw e
          }
        }
        yield put(
          A.setStep({
            step: 'SELL_ORDER_SUMMARY',
            sellOrder: sellOrder
          })
        )
        yield put(actions.form.stopSubmit('previewSell'))
        yield put(actions.components.refresh.refreshClicked())
        return yield put(actions.components.swap.fetchTrades())
      }

      if (!paymentType) throw new Error(NO_PAYMENT_TYPE)

      if (orderType === OrderType.BUY && fix === 'CRYPTO') {
        // @ts-ignore
        delete input.amount
      }
      if (orderType === OrderType.BUY && fix === 'FIAT') {
        // @ts-ignore
        delete output.amount
      }

      const buyOrder: SBOrderType = yield call(
        api.createSBOrder,
        pair.pair,
        orderType,
        true,
        input,
        output,
        paymentType,
        paymentMethodId
      )

      yield put(actions.form.stopSubmit('simpleBuyCheckout'))
      yield put(A.fetchSBOrders())
      yield put(A.setStep({ step: 'CHECKOUT_CONFIRM', order: buyOrder }))

      // log user tier
      const currentTier = selectors.modules.profile.getCurrentTier(
        yield select()
      )
      yield put(
        actions.analytics.logEvent([
          'SB_CREATE_ORDER_USER_TIER',
          'TIER',
          currentTier
        ])
      )
    } catch (e) {
      // After CC has been activated we try to create an order
      // If order creation fails go back to ENTER_AMOUNT step
      // Wait for the form to be INITIALIZED and display err
      const step = S.getStep(yield select())
      if (step !== 'ENTER_AMOUNT') {
        const pair = S.getSBPair(yield select())
        const method = S.getSBPaymentMethod(yield select())
        const from = S.getSwapAccount(yield select())
        // If user doesn't enter amount into checkout
        // they are redirected back to checkout screen
        // ensures newly linked bank account is fetched
        yield call(fetchBankTransferAccounts)
        if (pair) {
          yield put(
            A.setStep({
              step: 'ENTER_AMOUNT',
              cryptoCurrency: getCoinFromPair(pair.pair),
              fiatCurrency: getFiatFromPair(pair.pair),
              pair,
              method,
              orderType: values?.orderType,
              swapAccount: from
            })
          )
          yield take(AT.INITIALIZE_CHECKOUT)
          yield delay(3000)
          yield put(actions.form.startSubmit('simpleBuyCheckout'))
        }
      }

      const error = errorHandler(e)
      if (values?.orderType === OrderType.SELL) {
        yield put(actions.form.stopSubmit('previewSell', { _error: error }))
      }
      yield put(actions.form.stopSubmit('simpleBuyCheckout', { _error: error }))
    }
  }

  const AuthUrlCheck = function * (orderId) {
    let order: ReturnType<typeof api.getSBOrder> = yield call(
      api.getSBOrder,
      orderId
    )
    if (order.attributes?.authorisationUrl || order.state === 'FAILED') {
      return order
    } else {
      throw new Error('retrying to fetch for AuthUrl')
    }
  }

  const OrderConfirmCheck = function * (orderId) {
    let order: ReturnType<typeof api.getSBOrder> = yield call(
      api.getSBOrder,
      orderId
    )

    if (
      order.state === 'FINISHED' ||
      order.state === 'FAILED' ||
      order.state === 'CANCELED'
    ) {
      return order
    } else {
      throw new Error(
        'Order verification timed out. It will continue in the background.'
      )
    }
  }

  const confirmOrderPoll = function * (
    action: ReturnType<typeof A.confirmOrderPoll>
  ) {
    const { order } = action.payload
    const { RETRY_AMOUNT, SECONDS } = POLLING
    const confirmedOrder = yield retry(
      RETRY_AMOUNT,
      SECONDS * 1000,
      OrderConfirmCheck,
      order.id
    )
    yield put(actions.form.stopSubmit('sbCheckoutConfirm'))
    yield put(A.setStep({ step: 'ORDER_SUMMARY', order: confirmedOrder }))
    yield put(A.fetchSBOrders())
  }

  const confirmSBOrder = function * (
    payload: ReturnType<typeof A.confirmSBOrder>
  ) {
    const { order, paymentMethodId } = payload
    try {
      if (!order) throw new Error(NO_ORDER_EXISTS)
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      const account = selectors.components.brokerage.getAccount(yield select())
      const domainsR = selectors.core.walletOptions.getDomains(yield select())
      const domains = domainsR.getOrElse({
        walletHelper: 'https://wallet-helper.blockchain.com',
        yapilyCallbackUrl: 'https://www.blockchain.com/brokerage-link-success'
      } as WalletOptionsType['domains'])

      let attributes
      if (
        order.paymentType === 'PAYMENT_CARD' ||
        order.paymentType === 'USER_CARD'
      ) {
        attributes =
          order.paymentMethodId || paymentMethodId
            ? {
                everypay: {
                  customerUrl: `${domains.walletHelper}/wallet-helper/everypay/#/response-handler`
                }
              }
            : undefined
      } else if (account?.partner === BankPartners.YAPILY) {
        attributes = { callback: domains.yapilyCallbackUrl }
      }

      let confirmedOrder: SBOrderType = yield call(
        api.confirmSBOrder,
        order,
        attributes,
        paymentMethodId
      )

      const { RETRY_AMOUNT, SECONDS } = POLLING
      if (account?.partner === BankPartners.YAPILY) {
        // for OB the authorisationUrl isn't in the initial response to confirm
        // order. We need to poll the order for it.
        yield put(A.setStep({ step: 'LOADING' }))
        const order = yield retry(
          RETRY_AMOUNT,
          SECONDS * 1000,
          AuthUrlCheck,
          confirmedOrder.id
        )
        // Refresh the tx list in the modal background
        yield put(A.fetchSBOrders())

        yield put(A.setStep({ step: 'OPEN_BANKING_CONNECT', order }))
        // Now we need to poll for the order success
        return yield call(confirmOrderPoll, A.confirmOrderPoll(confirmedOrder))
      }
      yield put(actions.form.stopSubmit('sbCheckoutConfirm'))
      if (order.paymentType === 'BANK_TRANSFER') {
        yield put(A.setStep({ step: 'ORDER_SUMMARY', order: confirmedOrder }))
      } else {
        yield put(A.setStep({ step: '3DS_HANDLER', order: confirmedOrder }))
      }
      yield put(A.fetchSBOrders())
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.setStep({ step: 'CHECKOUT_CONFIRM', order }))
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      yield put(actions.form.stopSubmit('sbCheckoutConfirm', { _error: error }))
    }
  }

  const confirmSBFundsOrder = function * () {
    try {
      const order = S.getSBOrder(yield select())
      if (!order) throw new Error(NO_ORDER_EXISTS)
      yield put(actions.form.startSubmit('sbCheckoutConfirm'))
      const confirmedOrder: SBOrderType = yield call(
        api.confirmSBOrder,
        order as SBOrderType
      )
      yield put(actions.form.stopSubmit('sbCheckoutConfirm'))
      yield put(A.fetchSBOrders())
      yield put(A.setStep({ step: 'ORDER_SUMMARY', order: confirmedOrder }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit('sbCheckoutConfirm', { _error: error }))
    }
  }

  // TODO: move to BROKERAGE
  const deleteSBCard = function * ({
    cardId
  }: ReturnType<typeof A.deleteSBCard>) {
    try {
      if (!cardId) return
      yield put(actions.form.startSubmit('linkedCards'))
      yield call(api.deleteSavedAccount, cardId, 'cards')
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
      const balances: ReturnType<typeof api.getSBBalances> = yield call(
        api.getSBBalances,
        currency
      )
      yield put(A.fetchSBBalancesSuccess(balances))
    } catch (e) {
      yield put(A.fetchSBBalancesSuccess(DEFAULT_SB_BALANCES))
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
        | T.SBBillingAddressFormValuesType
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

  const fetchSBCardSDD = function * (
    billingAddress: T.SBBillingAddressFormValuesType
  ) {
    let card: SBCardType
    try {
      yield put(A.fetchSBCardLoading())
      const order = S.getSBLatestPendingOrder(yield select())
      if (!order) throw new Error(NO_ORDER_EXISTS)
      const currency = getFiatFromPair(order.pair)
      if (!currency) throw new Error(NO_FIAT_CURRENCY)

      const userDataR = selectors.modules.profile.getUserData(yield select())
      const userData = userDataR.getOrFail('NO_USER_ADDRESS')

      if (!billingAddress) throw new Error('NO_USER_ADDRESS')

      card = yield call(
        api.createSBCard,
        currency,
        {
          ...billingAddress
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
      yield call(waitForUserData)
      const { skipLoading } = payload

      yield call(fetchSDDVerified)
      const isUserTier2 = yield call(isTier2)
      const sddVerified = S.isUserSddVerified(yield select()).getOrElse(false)
      const loadCards = isUserTier2 || sddVerified

      if (!loadCards) return yield put(A.fetchSBCardsSuccess([]))
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

  const fetchSDDEligible = function * () {
    try {
      yield put(A.fetchSDDEligibleLoading())
      yield call(waitForUserData)
      // check if user is already tier 2
      if (!(yield call(isTier2))) {
        // user not tier 2, call for sdd eligibility
        const sddEligible = yield call(api.fetchSDDEligible)
        yield put(A.fetchSDDEligibleSuccess(sddEligible))
      } else {
        // user is already tier 2, manually set as ineligible
        yield put(
          A.fetchSDDEligibleSuccess({
            eligible: false,
            ineligibilityReason: 'KYC_TIER',
            tier: 2
          })
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSDDEligibleFailure(error))
    }
  }
  const fetchSDDVerified = function * () {
    try {
      const isSddVerified = S.getSddVerified(yield select()).getOrElse({
        verified: false
      })

      const userIdR = yield select(
        selectors.core.kvStore.userCredentials.getUserId
      )
      const userId = userIdR.getOrElse(null)
      if (!isSddVerified.verified && userId) {
        yield put(A.fetchSDDVerifiedLoading())
        const sddEligible = yield call(api.fetchSDDVerified)
        yield put(A.fetchSDDVerifiedSuccess(sddEligible))
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSDDVerifiedFailure(error))
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
      yield put(actions.components.brokerage.fetchBankTransferAccounts())
    } catch (e) {
      const error = errorHandler(e)
      if (!(yield call(isTier2))) return yield put(A.fetchSBOrdersSuccess([]))
      yield put(A.fetchSBOrdersFailure(error))
    }
  }

  const fetchSBPairs = function * ({
    coin,
    currency
  }: ReturnType<typeof A.fetchSBPairs>) {
    try {
      yield put(A.fetchSBPairsLoading())
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
      yield put(A.fetchSBPairsSuccess(filteredPairs, coin))
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
      // 🚨DO NOT create the user if no currency is passed
      if (userData.state === 'NONE' && !currency) {
        return yield put(A.fetchSBPaymentMethodsSuccess(DEFAULT_SB_METHODS))
      }

      // Only show Loading if not Success or 0 methods
      const sbMethodsR = S.getSBPaymentMethods(yield select())
      const sbMethods = sbMethodsR.getOrElse(DEFAULT_SB_METHODS)
      if (!Remote.Success.is(sbMethodsR) || !sbMethods.methods.length)
        yield put(A.fetchSBPaymentMethodsLoading())

      // 🚨Create the user if you have a currency
      yield call(createUser)

      // If no currency fallback to sb fiat currency or wallet
      const fallbackFiatCurrency =
        S.getFiatCurrency(yield select()) ||
        (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')

      const userSDDTierR = S.getUserSddEligibleTier(yield select())
      if (!Remote.Success.is(userSDDTierR)) {
        yield call(fetchSDDEligible)
      }
      const state = yield select()
      const currentUserTier = selectors.modules.profile.getCurrentTier(state)
      const userSDDEligibleTier = S.getUserSddEligibleTier(state).getOrElse(1)
      // only fetch non-eligible payment methods if user is not tier 2
      const includeNonEligibleMethods = currentUserTier === 2
      // if user is SDD tier 3 eligible, fetch limits for tier 3
      // else let endpoint return default current tier limits for current tier of user
      const includeTierLimits =
        userSDDEligibleTier === SDD_TIER ? SDD_TIER : undefined

      let paymentMethods = yield call(
        api.getSBPaymentMethods,
        currency || fallbackFiatCurrency,
        includeNonEligibleMethods,
        includeTierLimits
      )

      // 🚨👋 temporarily remove ACH from user payment methods if they are not t2
      // t2 users who are invited to ACH beta will still get method since the API will
      // return that method if they are actually eligible
      if (currentUserTier !== 2) {
        paymentMethods = paymentMethods.filter(
          method => method.type !== 'BANK_TRANSFER'
        )
      }
      yield put(
        A.fetchSBPaymentMethodsSuccess({
          currency: currency || fallbackFiatCurrency,
          methods: paymentMethods
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchSBPaymentMethodsFailure(error))
    }
  }

  const fetchSBQuote = function * (payload: ReturnType<typeof A.fetchSBQuote>) {
    try {
      const { amount, orderType, pair } = payload
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

  // new sell quote fetch
  // Copied from swap and hopefully eventually
  // shared between the 2 UIs and 3 methods (buy, sell, swap)

  // used for sell only now, eventually buy as well
  // TODO: use swap2 quote for buy AND sell
  const fetchSellQuote = function * (
    payload: ReturnType<typeof A.fetchSellQuote>
  ) {
    while (true) {
      try {
        yield put(A.fetchSellQuoteLoading())

        const pair = payload.pair
        const direction = getDirection(payload.account)
        const quote: ReturnType<typeof api.getSwapQuote> = yield call(
          api.getSwapQuote,
          pair,
          direction
        )
        const rate = getRate(
          quote.quote.priceTiers,
          getOutputFromPair(pair),
          new BigNumber(convertStandardToBase(payload.account.coin, 1)),
          true
        )

        yield put(A.fetchSellQuoteSuccess(quote, rate))
        const refresh = -moment().diff(quote.expiresAt)
        yield delay(refresh)
      } catch (e) {
        const error = errorHandler(e)
        yield put(A.fetchSellQuoteFailure(error))
        yield delay(FALLBACK_DELAY)
        yield put(A.startPollSellQuote(payload.pair, payload.account))
      } finally {
      }
    }
  }

  const formChanged = function * (action) {
    try {
      if (action.meta.form !== 'simpleBuyCheckout') return
      if (action.meta.field !== 'amount') return
      const formValues = selectors.form.getFormValues('simpleBuyCheckout')(
        yield select()
      ) as T.SBCheckoutFormValuesType
      const account = S.getSwapAccount(yield select())
      const pair = S.getSBPair(yield select())

      if (!formValues) return
      if (!account) return
      if (!pair) return

      const paymentR = S.getPayment(yield select())
      const quoteR = S.getSellQuote(yield select())
      const quote = quoteR.getOrFail(NO_QUOTE)

      const amt = getQuote(
        pair.pair,
        quote.rate,
        formValues.fix,
        formValues.amount
      )

      const cryptoAmt = formValues.fix === 'CRYPTO' ? formValues.amount : amt
      yield put(
        actions.form.change('simpleBuyCheckout', 'cryptoAmount', cryptoAmt)
      )
      if (account.type === 'CUSTODIAL') return
      // @ts-ignore
      let payment = paymentGetOrElse(account.coin, paymentR)
      const paymentAmount = generateProvisionalPaymentAmount(
        account.coin,
        Number(cryptoAmt)
      )
      payment = yield payment.amount(paymentAmount)
      payment = yield payment.build()
      yield put(A.updatePaymentSuccess(payment.value()))
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
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
          step: 'BANK_WIRE_DETAILS',
          displayBack: false,
          fiatCurrency: coin
        })
      )
    }
  }

  const handleSBMaxAmountClick = function * ({
    payload
  }: ReturnType<typeof A.handleSBMaxAmountClick>) {
    const { amount, coin } = payload
    const standardAmt = convertBaseToStandard(coin, amount)

    yield put(actions.form.change('simpleBuyCheckout', 'amount', standardAmt))
  }

  const handleSBMinAmountClick = function * ({
    payload
  }: ReturnType<typeof A.handleSBMinAmountClick>) {
    const { amount, coin } = payload
    const standardAmt = convertBaseToStandard(coin, amount)

    yield put(actions.form.change('simpleBuyCheckout', 'amount', standardAmt))
  }

  const handleSBMethodChange = function * (
    action: ReturnType<typeof A.handleSBMethodChange>
  ) {
    const values: T.SBCheckoutFormValuesType = yield select(
      selectors.form.getFormValues('simpleBuyCheckout')
    )

    const { method } = action
    const cryptoCurrency = S.getCryptoCurrency(yield select()) || 'BTC'
    const originalFiatCurrency = S.getFiatCurrency(yield select())
    const fiatCurrency = method.currency || S.getFiatCurrency(yield select())
    const pair = S.getSBPair(yield select())
    const swapAccount = S.getSwapAccount(yield select())
    if (!pair) return NO_PAIR_SELECTED
    const isUserTier2 = yield call(isTier2)

    if (!isUserTier2) {
      switch (method.type) {
        // https://blockc.slack.com/archives/GT1JZ1ZN2/p1596546978351100?thread_ts=1596541628.345800&cid=GT1JZ1ZN2
        // REMOVE THIS WHEN BACKEND CAN HANDLE PENDING 'FUNDS' ORDERS
        // 👇--------------------------------------------------------
        case 'BANK_ACCOUNT':
        case 'USER_CARD':
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

          return yield put(A.createSBOrder(method.type))
        default:
          return
      }
    }

    // User is Tier 2
    switch (method.type) {
      case 'BANK_ACCOUNT':
        return yield put(
          A.setStep({
            step: 'BANK_WIRE_DETAILS',
            displayBack: true,
            fiatCurrency
          })
        )
      case 'LINK_BANK':
        yield put(
          actions.components.brokerage.showModal(
            BrokerageModalOriginType.ADD_BANK,
            fiatCurrency === 'USD'
              ? 'ADD_BANK_YODLEE_MODAL'
              : 'ADD_BANK_YAPILY_MODAL'
          )
        )
        return yield put(
          actions.components.brokerage.setAddBankStep({
            addBankStep: AddBankStepType.ADD_BANK
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
            cryptoCurrency,
            fiatCurrency,
            method,
            orderType: values?.orderType,
            pair,
            swapAccount
          })
        )
    }

    // Change wallet/sb fiatCurrency if necessary
    // and fetch new pairs w/ new fiatCurrency
    // and pass along cryptoCurrency for pair swap
    if (originalFiatCurrency !== fiatCurrency) {
      yield put(actions.modules.settings.updateCurrency(method.currency, true))
      yield put(A.fetchSBPairs(method.currency, cryptoCurrency))
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
    account,
    amount,
    cryptoAmount,
    fix,
    orderType
  }: ReturnType<typeof A.initializeCheckout>) {
    try {
      yield call(waitForUserData)
      const fiatCurrency = S.getFiatCurrency(yield select())
      if (!fiatCurrency) throw new Error(NO_FIAT_CURRENCY)
      const pair = S.getSBPair(yield select())
      if (!pair) throw new Error(NO_PAIR_SELECTED)
      // Fetch rates
      if (orderType === OrderType.BUY) {
        yield put(A.fetchSBQuote(pair.pair, orderType, '0'))
        // used for sell only now, eventually buy as well
        // TODO: use swap2 quote for buy AND sell
      } else {
        if (!account) throw NO_ACCOUNT

        yield put(A.fetchSellQuote(pair.pair, account))
        yield put(A.startPollSellQuote(pair.pair, account))
        yield race({
          success: take(AT.FETCH_SELL_QUOTE_SUCCESS),
          failure: take(AT.FETCH_SELL_QUOTE_FAILURE)
        })
        const quote = S.getSellQuote(yield select()).getOrFail(NO_QUOTE)

        if (account.type === 'ACCOUNT') {
          const formValues = selectors.form.getFormValues('simpleBuyCheckout')(
            yield select()
          ) as T.SBCheckoutFormValuesType
          let payment = yield call(
            calculateProvisionalPayment,
            account,
            quote.quote,
            formValues ? formValues.cryptoAmount : 0
          )
          yield put(A.updatePaymentSuccess(payment))
        } else {
          yield put(A.updatePaymentSuccess(undefined))
        }
      }

      yield put(
        actions.form.initialize('simpleBuyCheckout', {
          fix,
          orderType,
          amount,
          cryptoAmount
        } as T.SBCheckoutFormValuesType)
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
        const order = S.getSBLatestPendingOrder(yield select())
        yield put(A.fetchSBCards(skipLoading))
        // If the order was already created
        if (order && order.state === 'PENDING_CONFIRMATION') {
          return yield put(A.confirmSBOrder(card.id, order))
        } else {
          return yield put(A.createSBOrder('PAYMENT_CARD', card.id))
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

  // Util function to help match payment method ID
  // to more details about the bank
  const getBankInformation = function * (order: SBOrderType) {
    yield put(actions.components.brokerage.fetchBankTransferAccounts())
    yield take(FETCH_BANK_TRANSFER_ACCOUNTS_SUCCESS)
    const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(
      yield select()
    )
    const bankAccounts = bankAccountsR.getOrElse([])
    const [bankAccount] = filter(
      (b: BankTransferAccountType) =>
        // @ts-ignore
        b.id === prop('paymentMethodId', order),
      defaultTo([])(bankAccounts)
    )

    return bankAccount
  }

  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { cryptoCurrency, orderType, origin } = payload
    const latestPendingOrder = S.getSBLatestPendingOrder(yield select())

    yield put(
      actions.modals.showModal('SIMPLE_BUY_MODAL', { origin, cryptoCurrency })
    )
    const fiatCurrencyR = selectors.core.settings.getCurrency(yield select())
    const fiatCurrency = fiatCurrencyR.getOrElse('USD')
    if (latestPendingOrder) {
      const bankAccount = yield call(
        getBankInformation,
        latestPendingOrder as SBOrderType
      )
      let step: T.StepActionsPayload['step'] =
        latestPendingOrder.state === 'PENDING_CONFIRMATION'
          ? 'CHECKOUT_CONFIRM'
          : 'ORDER_SUMMARY'

      // When user closes the QR code modal and opens it via one of the pending
      // buy buttons in the app. We need to take them to the qrcode screen and
      // poll for the order status
      if (
        latestPendingOrder.state === 'PENDING_DEPOSIT' &&
        prop('partner', bankAccount) === BankPartners.YAPILY
      ) {
        step = 'OPEN_BANKING_CONNECT'
        yield fork(confirmOrderPoll, A.confirmOrderPoll(latestPendingOrder))
      }

      yield put(
        A.setStep({
          step,
          order: latestPendingOrder
        })
      )
    } else if (cryptoCurrency) {
      orderType === OrderType.BUY &&
        (yield put(
          // 🚨 SPECIAL TS-IGNORE
          // Usually ENTER_AMOUNT should require a pair but
          // here we do not require a pair. Instead we have
          // cryptoCurrency and fiatCurrency and
          // INITIALIZE_CHECKOUT will set the pair on state.
          // 🚨 SPECIAL TS-IGNORE
          // @ts-ignore
          A.setStep({
            step: 'ENTER_AMOUNT',
            cryptoCurrency,
            fiatCurrency,
            orderType
          })
        ))
      orderType === OrderType.SELL &&
        (yield put(
          A.setStep({
            step: 'CRYPTO_SELECTION',
            cryptoCurrency,
            fiatCurrency,
            orderType
          })
        ))
    } else {
      yield put(
        A.setStep({ step: 'CRYPTO_SELECTION', cryptoCurrency, fiatCurrency })
      )
    }
  }

  const switchFix = function * ({ payload }: ReturnType<typeof A.switchFix>) {
    yield put(actions.form.change('simpleBuyCheckout', 'fix', payload.fix))
    yield put(
      actions.preferences.setSBCheckoutFix(payload.orderType, payload.fix)
    )
    const newAmount = new BigNumber(payload.amount).isGreaterThan(0)
      ? payload.amount
      : undefined
    yield put(actions.form.change('simpleBuyCheckout', 'amount', newAmount))
    yield put(actions.form.focus('simpleBuyCheckout', 'amount'))
  }

  const fetchLimits = function * ({
    cryptoCurrency,
    currency,
    side
  }: ReturnType<typeof A.fetchLimits>) {
    try {
      yield put(A.fetchLimitsLoading())
      let limits
      if (cryptoCurrency && side) {
        limits = yield call(
          api.getSBLimits,
          currency,
          ProductTypes.SIMPLEBUY,
          cryptoCurrency,
          side
        )
      } else {
        limits = yield call(api.getSwapLimits, currency)
      }
      yield put(A.fetchLimitsSuccess(limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchLimitsFailure(error))
    }
  }

  return {
    activateSBCard,
    addCardDetails,
    addCardFinished,
    cancelSBOrder,
    confirmOrderPoll,
    confirmSBOrder,
    confirmSBFundsOrder,
    createSBOrder,
    deleteSBCard,
    fetchLimits,
    fetchSBBalances,
    fetchSBCard,
    fetchSBCardSDD,
    fetchSBCards,
    fetchSBFiatEligible,
    fetchSDDEligible,
    fetchSDDVerified,
    fetchSBOrders,
    fetchSBPairs,
    fetchSBPaymentAccount,
    fetchSBPaymentMethods,
    fetchSBQuote,
    fetchSellQuote,
    formChanged,
    handleSBDepositFiatClick,
    handleSBMaxAmountClick,
    handleSBMinAmountClick,
    handleSBMethodChange,
    initializeBillingAddress,
    initializeCheckout,
    pollSBBalances,
    pollSBCard,
    pollSBOrder,
    setStepChange,
    showModal,
    switchFix
  }
}
