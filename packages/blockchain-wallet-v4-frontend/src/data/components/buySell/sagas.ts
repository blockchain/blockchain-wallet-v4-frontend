import BigNumber from 'bignumber.js'
import { getQuote } from 'blockchain-wallet-v4-frontend/src/modals/BuySell/EnterAmount/Checkout/validation'
import { addSeconds, differenceInMilliseconds } from 'date-fns'
import { defaultTo, filter, prop } from 'ramda'
import { call, cancel, delay, fork, put, race, retry, select, take } from 'redux-saga/effects'

import { Remote } from '@core'
import { UnitType } from '@core/exchange'
import Currencies from '@core/exchange/currencies'
import { APIType } from '@core/network/api'
import {
  ApplePayInfoType,
  BSAccountType,
  BSOrderType,
  BSPaymentMethodType,
  BSPaymentTypes,
  BSQuoteType,
  BuyQuoteStateType,
  CardAcquirer,
  CardSuccessRateResponse,
  ExtraKYCContext,
  FiatEligibleType,
  FiatType,
  GooglePayInfoType,
  MobilePaymentType,
  OrderType,
  ProductTypes,
  SwapOrderType,
  WalletOptionsType
} from '@core/types'
import { Coin, errorCodeAndMessage, errorHandler, errorHandlerCode } from '@core/utils'
import { actions, selectors } from 'data'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import { generateProvisionalPaymentAmount } from 'data/coins/utils'
import {
  AddBankStepType,
  BankDWStepType,
  BankPartners,
  BankTransferAccountType,
  BrokerageModalOriginType,
  CustodialSanctionsEnum,
  ModalName,
  ProductEligibilityForUser,
  UserDataType,
  VerifyIdentityOriginType
} from 'data/types'
import { isNabuError } from 'services/errors'
import { getExtraKYCCompletedStatus } from 'services/sagas/extraKYC'

import { actions as cacheActions } from '../../cache/slice'
import { actions as custodialActions } from '../../custodial/slice'
import profileSagas from '../../modules/profile/sagas'
import brokerageSagas from '../brokerage/sagas'
import { convertBaseToStandard, convertStandardToBase } from '../exchange/services'
import sendSagas from '../send/sagas'
import { FALLBACK_DELAY, getOutputFromPair } from '../swap/model'
import swapSagas from '../swap/sagas'
import { SwapBaseCounterTypes } from '../swap/types'
import { getRate } from '../swap/utils'
import { selectReceiveAddress } from '../utils/sagas'
import {
  BS_ERROR,
  CARD_ERROR_CODE,
  CARD_ORDER_POLLING,
  DEFAULT_BS_BALANCES,
  DEFAULT_BS_METHODS,
  FORM_BS_CANCEL_ORDER,
  FORM_BS_CHECKOUT,
  FORM_BS_CHECKOUT_CONFIRM,
  FORM_BS_PREVIEW_SELL,
  FORMS_BS_BILLING_ADDRESS,
  getCoinFromPair,
  getFiatFromPair,
  GOOGLE_PAY_MERCHANT_ID,
  isFiatCurrencySupported,
  ORDER_ERROR_CODE,
  ORDER_POLLING,
  SDD_TIER
} from './model'
import * as S from './selectors'
import { actions as A } from './slice'
import * as T from './types'
import { getDirection, reversePair } from './utils'

export const logLocation = 'components/buySell/sagas'

let googlePaymentsClient: google.payments.api.PaymentsClient | null = null

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
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
  const { fetchBankTransferAccounts, setupBankTransferProvider } = brokerageSagas({
    api,
    coreSagas,
    networks
  })

  const generateApplePayResponse = async ({
    applePayInfo,
    paymentRequest
  }: {
    applePayInfo: ApplePayInfoType
    paymentRequest: ApplePayJS.ApplePayPaymentRequest
  }): Promise<{
    address: ApplePayJS.ApplePayPaymentContact | null
    token: string
  }> => {
    if (!ApplePaySession) {
      throw new Error(BS_ERROR.APPLE_PAY_INFO_NOT_FOUND)
    }

    const token: {
      address: ApplePayJS.ApplePayPaymentContact | null
      token: string
    } = await new Promise((resolve, reject) => {
      const session = new ApplePaySession(3, paymentRequest)

      session.onvalidatemerchant = async (event) => {
        try {
          const { applePayPayload } = await api.validateApplePayMerchant({
            beneficiaryID: applePayInfo.beneficiaryID,
            domain: window.location.host,
            validationURL: event.validationURL
          })

          session.completeMerchantValidation(JSON.parse(applePayPayload))
        } catch (e) {
          session.abort()

          reject(new Error(BS_ERROR.FAILED_TO_VALIDATE_APPLE_PAY_MERCHANT))
        }
      }

      session.onpaymentauthorized = (event) => {
        const result = {
          status: ApplePaySession.STATUS_SUCCESS
        }

        session.completePayment(result)

        resolve({
          address: event.payment.billingContact || null,
          token: JSON.stringify(event.payment.token)
        })
      }

      session.oncancel = () => {
        reject(new Error(BS_ERROR.USER_CANCELLED_APPLE_PAY))
      }

      session.begin()
    })

    return token
  }

  const generateGooglePayResponse = async (
    paymentRequest: google.payments.api.PaymentDataRequest
  ): Promise<{
    address: google.payments.api.Address | null
    token: string
  }> => {
    const environment = window.location.host === 'login.blockchain.com' ? 'PRODUCTION' : 'TEST'

    if (!googlePaymentsClient) {
      googlePaymentsClient = new google.payments.api.PaymentsClient({ environment })
    }

    try {
      const paymentData = await googlePaymentsClient.loadPaymentData(paymentRequest)

      return {
        address: paymentData.paymentMethodData.info?.billingAddress || null,
        token: paymentData.paymentMethodData.tokenizationData.token
      }
    } catch (e) {
      throw new Error(BS_ERROR.USER_CANCELLED_GOOGLE_PAY)
    }
  }

  const registerCard = function* ({ payload }: ReturnType<typeof A.registerCard>) {
    try {
      const { cvv, paymentMethodTokens } = payload
      const userDataR = selectors.modules.profile.getUserData(yield select())
      const billingAddressForm: T.BSBillingAddressFormValuesType | undefined = yield select(
        selectors.form.getFormValues(FORMS_BS_BILLING_ADDRESS)
      )
      const userData = userDataR.getOrFail(BS_ERROR.NO_USER_DATA)
      const address = billingAddressForm || userData.address

      if (!address) throw new Error(BS_ERROR.NO_ADDRESS)

      // We always use CHECKOUTDOTCOM for now
      // and we need 3DS to create a card
      yield put(A.setStep({ step: '3DS_HANDLER_CHECKOUTDOTCOM' }))

      // This creates the card on the backend
      yield put(A.createCard(paymentMethodTokens))
      yield take([A.createCardSuccess.type, A.createCardFailure.type])

      // Check if the card was created
      const cardR = S.getBSCard(yield select())
      const card = cardR.getOrFail(BS_ERROR.CARD_CREATION_FAILED)

      // This is for the 0 dollar payment
      yield put(A.activateCard({ card, cvv }))
      yield take([A.activateCardSuccess.type, A.activateCardFailure.type])
    } catch (e) {
      // TODO: improve error message here, adding translations and more context

      yield put(
        A.setStep({
          step: 'DETERMINE_CARD_PROVIDER'
        })
      )
    }
  }

  const checkCardSuccessRate = function* ({ payload }: ReturnType<typeof A.checkCardSuccessRate>) {
    try {
      const data: CardSuccessRateResponse = yield call(api.checkCardSuccessRate, payload.bin)

      yield put(A.setCardSuccessRate({ isBlocked: !!data.block }))
    } catch (e) {
      if (isNabuError(e)) {
        yield put(
          A.setCardSuccessRate({
            details: {
              actions: e.actions
                ? e.actions.map((action) => ({
                    title: action.title,
                    url: action.url || ''
                  }))
                : [],
              message: e.message,
              title: e.title
            },
            isBlocked: !!e.dataFields?.block
          })
        )
      }
    }
  }

  const activateBSCard = function* ({ payload }: ReturnType<typeof A.activateCard>) {
    try {
      const { card, cvv } = payload

      yield put(A.activateCardLoading())
      const domainsR = selectors.core.walletOptions.getDomains(yield select())
      const domains = domainsR.getOrElse({
        walletHelper: 'https://wallet-helper.blockchain.com'
      } as WalletOptionsType['domains'])

      const redirectUrl = `${domains.walletHelper}/wallet-helper/3ds-payment-success/#/`

      const providerDetails = yield call(api.activateBSCard, {
        cardBeneficiaryId: card.id,
        cvv,
        redirectUrl
      })

      yield put(A.activateCardSuccess(providerDetails))

      yield put(A.fetchCards(true))
    } catch (e) {
      if (isNabuError(e)) {
        yield put(A.activateCardFailure(e))
      } else {
        const error = errorHandlerCode(e)

        yield put(A.activateCardFailure(error))
      }
    }
  }

  const cancelBSOrder = function* ({ payload }: ReturnType<typeof A.cancelOrder>) {
    try {
      const { state } = payload
      const fiatCurrency = getFiatFromPair(payload.pair)
      const cryptoCurrency = getCoinFromPair(payload.pair)
      yield put(actions.form.startSubmit(FORM_BS_CANCEL_ORDER))
      yield call(api.cancelBSOrder, payload)
      yield put(actions.form.stopSubmit(FORM_BS_CANCEL_ORDER))
      yield put(A.fetchOrders())
      if (state === 'PENDING_CONFIRMATION' && fiatCurrency && cryptoCurrency) {
        const pair = S.getBSPair(yield select())
        const method = S.getBSPaymentMethod(yield select())
        if (pair) {
          yield put(
            A.setStep({
              cryptoCurrency,
              fiatCurrency,
              method,
              orderType: payload.side || OrderType.BUY,
              pair,
              step: 'ENTER_AMOUNT'
            })
          )
        } else {
          yield put(
            A.setStep({
              fiatCurrency,
              step: 'CRYPTO_SELECTION'
            })
          )
        }
      } else {
        yield put(actions.modals.closeModal(ModalName.SIMPLE_BUY_MODAL))
      }
    } catch (e) {
      // TODO: adding error handling with different error types and messages
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(FORM_BS_CANCEL_ORDER, { _error: error }))
    }
  }

  const createBSOrder = function* ({
    payload: { mobilePaymentMethod, paymentMethodId, paymentType }
  }: ReturnType<typeof A.createOrder>) {
    const values: T.BSCheckoutFormValuesType = yield select(
      selectors.form.getFormValues(FORM_BS_CHECKOUT)
    )
    try {
      const pair = S.getBSPair(yield select())

      if (!pair) throw new Error(BS_ERROR.NO_PAIR_SELECTED)
      if (!values?.amount) throw new Error(BS_ERROR.NO_AMOUNT)
      if (parseFloat(values.amount) <= 0) throw new Error(BS_ERROR.NO_AMOUNT)

      const { fix, orderType, period } = values

      // since two screens use this order creation saga and they have different
      // forms, detect the order type and set correct form to submitting
      let buyQuote: BuyQuoteStateType | undefined
      if (orderType === OrderType.SELL) {
        yield put(actions.form.startSubmit(FORM_BS_PREVIEW_SELL))
      } else {
        buyQuote = S.getBuyQuote(yield select()).getOrFail(BS_ERROR.NO_QUOTE)
        yield put(actions.form.startSubmit(FORM_BS_CHECKOUT))
      }

      const fiat = getFiatFromPair(pair.pair)
      const coin = getCoinFromPair(pair.pair)
      const amount =
        fix === Coin.FIAT
          ? convertStandardToBase(Coin.FIAT, values.amount)
          : convertStandardToBase(coin, values.amount)
      const inputCurrency = orderType === OrderType.BUY ? fiat : coin
      const outputCurrency = orderType === OrderType.BUY ? coin : fiat
      const input = { amount, symbol: inputCurrency }
      const output = { amount, symbol: outputCurrency }

      // used for sell only now, eventually buy as well
      // TODO: use swap2 quote for buy AND sell
      if (orderType === OrderType.SELL) {
        const from = S.getSwapAccount(yield select())
        const quote = S.getSellQuote(yield select()).getOrFail(BS_ERROR.NO_QUOTE)
        if (!from) throw new Error(BS_ERROR.NO_ACCOUNT)

        const direction = getDirection(from)
        const cryptoAmt =
          fix === 'CRYPTO'
            ? amount
            : convertStandardToBase(
                from.coin,
                getQuote(pair.pair, convertStandardToBase(Coin.FIAT, quote.rate), fix, amount)
              )
        const refundAddr =
          direction === 'FROM_USERKEY'
            ? yield call(selectReceiveAddress, from, networks, api, coreSagas)
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
          const payment = paymentGetOrElse(from.coin, paymentR)
          try {
            yield call(buildAndPublishPayment, payment.coin, payment, sellOrder.kind.depositAddress)
            yield call(api.updateSwapOrder, sellOrder.id, 'DEPOSIT_SENT')
          } catch (e) {
            yield call(api.updateSwapOrder, sellOrder.id, 'CANCEL')
            throw e
          }
        }
        yield put(
          A.setStep({
            sellOrder,
            step: 'SELL_ORDER_SUMMARY'
          })
        )
        yield put(actions.form.stopSubmit(FORM_BS_PREVIEW_SELL))
        yield put(actions.components.refresh.refreshClicked())
        return yield put(actions.components.swap.fetchTrades())
      }

      if (!paymentType) throw new Error(BS_ERROR.NO_PAYMENT_TYPE)

      if (buyQuote) {
        const { availability, reason } = buyQuote.quote.settlementDetails
        if (availability === 'UNAVAILABLE' || reason === 'REQUIRES_UPDATE') {
          yield put(
            actions.components.buySell.setStep({
              reason,
              step: BankDWStepType.PAYMENT_ACCOUNT_ERROR
            })
          )
          return
        }
      }
      // FIXME: this temporarily enables users to purchase min amounts of crypto with the enter amount fix set to CRYPTO
      // remove this section when backend updates the flexiblePricing APIs to handle crypto amounts
      const decimals = Currencies[fiat].units[fiat as UnitType].decimal_digits
      const standardRate = convertBaseToStandard(coin, buyQuote && buyQuote.rate)
      const standardInputAmount = convertBaseToStandard(coin, input.amount)
      const inputAmount = new BigNumber(standardInputAmount || '0')
        .dividedBy(standardRate)
        .toFixed(decimals)
      if (orderType === OrderType.BUY && fix === 'CRYPTO') {
        // @ts-ignore
        delete output.amount
        input.amount = convertStandardToBase(Coin.FIAT, inputAmount) // ex. 5 -> 500
      }
      if (orderType === OrderType.BUY && fix === Coin.FIAT) {
        // @ts-ignore
        delete output.amount
      }

      if (mobilePaymentMethod === MobilePaymentType.APPLE_PAY) {
        const applePayInfo: ApplePayInfoType = yield call(api.getApplePayInfo, fiat)

        yield put(A.setApplePayInfo(applePayInfo))
      }

      if (mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY) {
        const googlePayInfo: GooglePayInfoType = yield call(api.getGooglePayInfo, fiat)

        yield put(A.setGooglePayInfo(googlePayInfo))
      }

      yield put(A.createOrderLoading())

      yield put(
        cacheActions.setLastUnusedAmount({
          amount: convertBaseToStandard(Coin.FIAT, input.amount),
          pair: pair.pair
        })
      )
      let buyOrder: BSOrderType

      let oldBuyOrder: BSOrderType | undefined

      // This code is handles refreshing the buy order when the user sits on
      // the order confirmation screen.
      while (true) {
        // get the current order, if any
        const currentBuyQuote = S.getBuyQuote(yield select()).getOrFail(BS_ERROR.NO_QUOTE)

        // non gold users can only make one order at a time so we need to cancel the old one
        if (oldBuyOrder && !Remote.Loading.is(S.getBSOrder(yield select()))) {
          yield call(api.cancelBSOrder, oldBuyOrder)
        }

        buyOrder = yield call(
          api.createBSOrder,
          pair.pair,
          orderType,
          true,
          input,
          output,
          paymentType,
          period,
          paymentMethodId,
          currentBuyQuote.quote.quoteId
        )

        // first time creating the order when the user submits the enter amount form
        if (!oldBuyOrder) {
          yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT))
        }

        yield put(A.fetchOrders())
        yield put(A.createOrderSuccess(buyOrder))

        yield put(A.setStep({ step: 'CHECKOUT_CONFIRM' }))

        oldBuyOrder = buyOrder

        // pause the while loop here until if/when the quote expires again, then refresh the order
        yield take(A.fetchBuyQuoteSuccess)

        const currentStep = S.getStep(yield select())

        // need to break if not checkout confirm
        // usually happens when the user goes back to the enter amount form
        if (currentStep !== 'CHECKOUT_CONFIRM') {
          break
        }
      }
    } catch (e) {
      if (isNabuError(e)) {
        yield put(A.createOrderFailure(e))

        yield put(
          actions.form.stopSubmit(
            values?.orderType === OrderType.SELL ? FORM_BS_PREVIEW_SELL : FORM_BS_CHECKOUT,
            {
              _error: e
            }
          )
        )

        return
      }

      const error: number | string = errorHandlerCode(e)

      const skipErrorDisplayList = [BS_ERROR.NO_AMOUNT]

      if (skipErrorDisplayList.includes(error as BS_ERROR)) {
        const pair = S.getBSPair(yield select())
        const method = S.getBSPaymentMethod(yield select())
        const from = S.getSwapAccount(yield select())

        // If user doesn't enter amount into checkout
        // they are redirected back to checkout screen
        // ensures newly linked bank account is fetched
        yield call(fetchBankTransferAccounts)

        if (pair) {
          yield put(
            A.setStep({
              cryptoCurrency: getCoinFromPair(pair.pair),
              fiatCurrency: getFiatFromPair(pair.pair),
              method,
              orderType: values?.orderType,
              pair,
              step: 'ENTER_AMOUNT',
              swapAccount: from
            })
          )
        }

        yield put(actions.form.focus(FORM_BS_CHECKOUT, 'amount'))

        return
      }

      yield call(fetchBankTransferAccounts)

      yield put(A.createOrderFailure(e))

      if (values?.orderType === OrderType.SELL) {
        yield put(actions.form.stopSubmit(FORM_BS_PREVIEW_SELL, { _error: error }))
      }

      // Check if we want to display the error to the user or not.
      yield put(
        actions.form.stopSubmit(FORM_BS_CHECKOUT, {
          _error: skipErrorDisplayList.includes(error as BS_ERROR) ? undefined : error
        })
      )
    }
  }

  const checkOrderAuthUrl = function* (orderId) {
    const order: ReturnType<typeof api.getBSOrder> = yield call(api.getBSOrder, orderId)
    if (order.attributes?.authorisationUrl || order.state === 'FAILED') {
      return order
    }

    throw new Error(BS_ERROR.RETRYING_TO_GET_AUTH_URL)
  }

  const orderConfirmCheck = function* (orderId) {
    const order: ReturnType<typeof api.getBSOrder> = yield call(api.getBSOrder, orderId)

    if (order.state === 'FINISHED' || order.state === 'FAILED' || order.state === 'CANCELED') {
      return order
    }

    throw new Error(BS_ERROR.ORDER_VERIFICATION_TIMED_OUT)
  }

  const confirmOrderPoll = function* (
    { payload }: ReturnType<typeof A.confirmOrderPoll>,
    { RETRY_AMOUNT, SECONDS }: { RETRY_AMOUNT: number; SECONDS: number } = {
      RETRY_AMOUNT: ORDER_POLLING.RETRY_AMOUNT,
      SECONDS: ORDER_POLLING.SECONDS
    }
  ) {
    const confirmedOrder = yield retry(RETRY_AMOUNT, SECONDS, orderConfirmCheck, payload.id)
    yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM))

    if (confirmedOrder.paymentError) {
      throw new Error(confirmedOrder.paymentError)
    }

    yield put(A.confirmOrderSuccess(confirmedOrder))

    yield put(cacheActions.removeLastUsedAmount({ pair: confirmedOrder.pair }))

    yield put(A.setStep({ step: 'ORDER_SUMMARY' }))
  }

  const confirmOrder = function* ({ payload }: ReturnType<typeof A.confirmOrder>) {
    const { mobilePaymentMethod, paymentMethodId } = payload

    const { order } = payload

    try {
      if (!order) throw new Error(BS_ERROR.NO_ORDER_EXISTS)

      yield put(actions.form.startSubmit(FORM_BS_CHECKOUT_CONFIRM))

      const account = selectors.components.brokerage.getAccount(yield select())

      const domainsR = selectors.core.walletOptions.getDomains(yield select())

      const domains = domainsR.getOrElse({
        comRoot: 'https://www.blockchain.com',
        walletHelper: 'https://wallet-helper.blockchain.com'
      } as WalletOptionsType['domains'])

      let attributes

      const paymentSuccessLink = `${domains.walletHelper}/wallet-helper/3ds-payment-success/#/`

      if (
        order.paymentType === BSPaymentTypes.PAYMENT_CARD ||
        order.paymentType === BSPaymentTypes.USER_CARD
      ) {
        attributes = {
          everypay: {
            customerUrl: paymentSuccessLink
          },
          redirectURL: paymentSuccessLink
        }
      } else if (account?.partner === BankPartners.YAPILY) {
        attributes = { callback: `${domains.comRoot}/brokerage-link-success` }
      }

      if (mobilePaymentMethod) {
        if (mobilePaymentMethod === MobilePaymentType.APPLE_PAY) {
          const applePayInfo = selectors.components.buySell.getApplePayInfo(yield select())

          if (!applePayInfo) {
            throw new Error(BS_ERROR.APPLE_PAY_INFO_NOT_FOUND)
          }

          const merchantCapabilities: ApplePayJS.ApplePayMerchantCapability[] = [
            'supports3DS',
            'supportsDebit'
          ]

          if (applePayInfo.allowCreditCards) {
            merchantCapabilities.push('supportsCredit')
          }

          let requiredBillingContactFields: ApplePayJS.ApplePayPaymentRequest['requiredBillingContactFields']

          if (applePayInfo.requiredBillingContactFields) {
            // had to remap the post field to be postalCode, as it was required on the iOS side
            requiredBillingContactFields = applePayInfo.requiredBillingContactFields.map(
              (requiredBillingContactField) =>
                requiredBillingContactField.replace(
                  'post',
                  'postalAddress'
                ) as ApplePayJS.ApplePayContactField
            )
          }

          let supportedCountries

          if (applePayInfo.supportedCountries) {
            supportedCountries = applePayInfo.supportedCountries
          }

          let supportedNetworks = ['visa', 'masterCard']

          if (applePayInfo.supportedNetworks) {
            supportedNetworks = applePayInfo.supportedNetworks
          }

          // inputAmount is in cents, but amount has to be in decimals
          const amount = parseInt(order.inputQuantity, 10) / 100

          const paymentRequest: ApplePayJS.ApplePayPaymentRequest = {
            countryCode: applePayInfo.merchantBankCountryCode,
            currencyCode: order.inputCurrency,
            merchantCapabilities,
            requiredBillingContactFields,
            supportedCountries,
            supportedNetworks,
            total: { amount: `${amount}`, label: 'Blockchain.com' }
          }

          const {
            address,
            token
          }: {
            address: ApplePayJS.ApplePayPaymentContact | null
            token: string
          } = yield call(generateApplePayResponse, {
            applePayInfo,
            paymentRequest
          })

          attributes = {
            applePayPaymentToken: token,
            everypay: {
              customerUrl: paymentSuccessLink
            },
            paymentContact: address
              ? {
                  city: address.locality,
                  country: address.country,
                  email: address.emailAddress,
                  firstname: address.givenName,
                  lastname: address.familyName,
                  line1: address.addressLines ? address.addressLines[0] : undefined,
                  line2: address.addressLines ? address.addressLines[1] : undefined,
                  phone: address.phoneNumber,
                  postCode: address.postalCode,
                  state: address.administrativeArea
                }
              : null,
            redirectURL: paymentSuccessLink
          }
        }

        if (mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY) {
          const googlePayInfo = selectors.components.buySell.getGooglePayInfo(yield select())

          if (!googlePayInfo) {
            throw new Error(BS_ERROR.GOOGLE_PAY_INFO_NOT_FOUND)
          }

          const { allowCreditCards, allowPrepaidCards } = googlePayInfo

          let allowedAuthMethods: google.payments.api.CardAuthMethod[] = [
            'PAN_ONLY',
            'CRYPTOGRAM_3DS'
          ]

          if (googlePayInfo.allowedAuthMethods) {
            allowedAuthMethods = googlePayInfo.allowedAuthMethods
          }

          let allowedCardNetworks: google.payments.api.CardNetwork[] = ['MASTERCARD', 'VISA']

          if (googlePayInfo.allowedCardNetworks) {
            allowedCardNetworks = googlePayInfo.allowedCardNetworks
          }

          let billingAddressRequired = false

          if (googlePayInfo.billingAddressRequired) {
            billingAddressRequired = googlePayInfo.billingAddressRequired
          }

          let billingAddressParameters: google.payments.api.BillingAddressParameters = {
            format: 'MIN',
            phoneNumberRequired: false
          }

          if (googlePayInfo.billingAddressParameters) {
            billingAddressParameters = googlePayInfo.billingAddressParameters
          }

          // inputAmount is in cents, but amount has to be in decimals
          const amount = parseInt(order.inputQuantity, 10) / 100

          let parameters: google.payments.api.PaymentGatewayTokenizationParameters | null = null

          try {
            parameters = JSON.parse(googlePayInfo.googlePayParameters)
          } catch (e) {
            throw new Error(BS_ERROR.GOOGLE_PAY_PARAMETERS_MALFORMED)
          }

          if (!parameters) {
            throw new Error(BS_ERROR.GOOGLE_PAY_PARAMETERS_NOT_FOUND)
          }

          const paymentDataRequest = {
            allowedPaymentMethods: [
              {
                parameters: {
                  allowCreditCards,
                  allowPrepaidCards,
                  allowedAuthMethods,
                  allowedCardNetworks,
                  billingAddressParameters,
                  billingAddressRequired
                },
                tokenizationSpecification: {
                  parameters,
                  type: 'PAYMENT_GATEWAY' as const
                },
                type: 'CARD' as const
              }
            ],
            apiVersion: 2,
            apiVersionMinor: 0,
            merchantInfo: {
              merchantId: GOOGLE_PAY_MERCHANT_ID,
              merchantName: 'Blockchain.com'
            },
            shippingAddressRequired: false,
            transactionInfo: {
              countryCode: googlePayInfo.merchantBankCountry,
              currencyCode: order.inputCurrency,
              totalPrice: `${amount}`,
              totalPriceStatus: 'FINAL' as const
            }
          }

          const {
            address,
            token
          }: {
            address: google.payments.api.Address | null
            token: string
          } = yield call(generateGooglePayResponse, paymentDataRequest)

          attributes = {
            everypay: {
              customerUrl: paymentSuccessLink
            },
            googlePayPayload: token,
            paymentContact: address
              ? {
                  city: address.locality,
                  country: address.countryCode,
                  firstname: address.name,
                  lastname: address.name,
                  line1: address.address1,
                  line2: address.address2,
                  middleName: address.name,
                  phoneNumber: address.phoneNumber,
                  postCode: address.postalCode,
                  state: address.administrativeArea
                }
              : null,
            redirectURL: paymentSuccessLink
          }
        }
      }

      const freshOrder = S.getBSOrder(yield select()).getOrFail(BS_ERROR.ORDER_NOT_FOUND)

      if (freshOrder.inputQuantity !== order.inputQuantity) {
        throw new Error(BS_ERROR.ORDER_VALUE_CHANGED)
      }

      yield put(A.confirmOrderLoading())

      const confirmedOrder: BSOrderType = yield call(api.confirmBSOrder, {
        attributes,
        order: freshOrder,
        paymentMethodId
      })

      if (confirmedOrder.paymentError) {
        throw new Error(confirmedOrder.paymentError)
      }

      if (
        freshOrder.paymentType === BSPaymentTypes.BANK_TRANSFER &&
        account?.partner === BankPartners.YAPILY
      ) {
        const { RETRY_AMOUNT, SECONDS } = ORDER_POLLING
        // For OB the authorizationUrl isn't in the initial response to confirm
        // order. We need to poll the order for it.
        yield put(A.setStep({ step: 'LOADING' }))
        const order = yield retry(RETRY_AMOUNT, SECONDS, checkOrderAuthUrl, confirmedOrder.id)
        // Refresh the tx list in the modal background
        yield put(A.fetchOrders())

        yield put(A.confirmOrderSuccess(order))

        yield put(A.setStep({ step: 'OPEN_BANKING_CONNECT' }))
        // Now we need to poll for the order success

        yield call(confirmOrderPoll, A.confirmOrderPoll(confirmedOrder))
      }

      // Refresh recurring buy list to check for new pending RBs for next step
      yield put(actions.components.recurringBuy.fetchRegisteredList())

      yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM))

      if (confirmedOrder.paymentType === BSPaymentTypes.BANK_TRANSFER) {
        yield put(A.confirmOrderSuccess(confirmedOrder))

        yield put(cacheActions.removeLastUsedAmount({ pair: confirmedOrder.pair }))

        yield put(A.setStep({ step: 'ORDER_SUMMARY' }))
      } else if (
        confirmedOrder.attributes?.everypay?.paymentState === 'SETTLED' ||
        confirmedOrder.attributes?.cardProvider?.paymentState === 'SETTLED'
      ) {
        // Have to check if the state is "FINISHED", otherwise poll for 1 minute until it is
        if (confirmedOrder.state === 'FINISHED') {
          yield put(A.confirmOrderSuccess(confirmedOrder))

          yield put(cacheActions.removeLastUsedAmount({ pair: confirmedOrder.pair }))

          yield put(A.setStep({ step: 'ORDER_SUMMARY' }))
        }

        try {
          // Inside the polling, if the order is finished, we set the order success and set the step to ORDER_SUMMARY
          yield call(confirmOrderPoll, A.confirmOrderPoll(confirmedOrder), CARD_ORDER_POLLING)
        } catch (e) {
          // Exhausted the retry attempts, so just show the order summary with the order we have
          yield put(A.confirmOrderSuccess(confirmedOrder))

          yield put(cacheActions.removeLastUsedAmount({ pair: confirmedOrder.pair }))

          yield put(A.setStep({ step: 'ORDER_SUMMARY' }))
        }
      } else if (
        confirmedOrder.attributes?.everypay ||
        (confirmedOrder.attributes?.cardProvider?.cardAcquirerName === 'EVERYPAY' &&
          confirmedOrder.attributes?.cardProvider?.paymentState === 'WAITING_FOR_3DS_RESPONSE')
      ) {
        yield put(A.confirmOrderSuccess(confirmedOrder))

        yield put(A.setStep({ step: '3DS_HANDLER_EVERYPAY' }))
      } else if (
        confirmedOrder.attributes?.cardProvider?.cardAcquirerName === 'STRIPE' &&
        confirmedOrder.attributes?.cardProvider?.paymentState === 'WAITING_FOR_3DS_RESPONSE'
      ) {
        yield put(A.confirmOrderSuccess(confirmedOrder))

        yield put(A.setStep({ step: '3DS_HANDLER_STRIPE' }))
      } else if (
        confirmedOrder.attributes?.cardProvider?.cardAcquirerName === 'CHECKOUTDOTCOM' &&
        confirmedOrder.attributes?.cardProvider?.paymentState === 'WAITING_FOR_3DS_RESPONSE'
      ) {
        yield put(A.confirmOrderSuccess(confirmedOrder))

        yield put(A.setStep({ step: '3DS_HANDLER_CHECKOUTDOTCOM' }))
      } else {
        throw new Error(BS_ERROR.UNHANDLED_PAYMENT_STATE)
      }

      yield put(A.fetchOrders())
    } catch (e) {
      const error: number | string = errorHandlerCode(e)

      const skipErrorDisplayList = [
        BS_ERROR.USER_CANCELLED_APPLE_PAY,
        BS_ERROR.USER_CANCELLED_GOOGLE_PAY
      ]

      yield put(A.setStep({ step: 'CHECKOUT_CONFIRM' }))

      if (skipErrorDisplayList.includes(error as BS_ERROR)) {
        yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM))

        return
      }

      if (isNabuError(e)) {
        yield put(A.confirmOrderFailure(e))
      } else {
        yield put(A.confirmOrderFailure(errorHandlerCode(e)))
      }
    }
  }

  const confirmBSFundsOrder = function* () {
    try {
      const order = S.getBSOrder(yield select()).getOrFail(BS_ERROR.ORDER_NOT_FOUND)
      if (!order) throw new Error(BS_ERROR.NO_ORDER_EXISTS)
      yield put(actions.form.startSubmit(FORM_BS_CHECKOUT_CONFIRM))
      // TODO fix this type
      const confirmedOrder: BSOrderType = yield call(api.confirmBSOrder, {
        order
      })
      yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM))
      yield put(A.fetchOrders())
      yield put(A.confirmOrderSuccess(confirmedOrder))

      yield put(cacheActions.removeLastUsedAmount({ pair: confirmedOrder.pair }))

      yield put(A.setStep({ step: 'ORDER_SUMMARY' }))
    } catch (e) {
      if (isNabuError(e)) {
        yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM, { _error: e }))
      } else {
        const error = errorHandler(e)
        yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM, { _error: error }))
      }
    }
  }

  const deleteBSCard = function* ({ payload }: ReturnType<typeof A.deleteCard>) {
    try {
      if (!payload) return
      yield put(actions.form.startSubmit(FORM_BS_CHECKOUT_CONFIRM))
      yield call(api.deleteSavedAccount, payload, 'cards')
      yield put(A.fetchCards(true))
      yield take([A.fetchCardsSuccess.type, A.fetchCardsFailure.type])
      yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM))
      yield put(actions.alerts.displaySuccess('Card removed.'))
    } catch (e) {
      // TODO: adding error handling with different error types and messages
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(FORM_BS_CHECKOUT_CONFIRM, { _error: error }))
      yield put(actions.alerts.displayError('Error removing card.'))
    }
  }

  const fetchBSBalances = function* ({ payload }: ReturnType<typeof A.fetchBalance>) {
    const { currency, skipLoading } = payload
    try {
      if (!skipLoading) yield put(A.fetchBalanceLoading())
      const balances: ReturnType<typeof api.getBSBalances> = yield call(api.getBSBalances, currency)
      yield put(A.fetchBalanceSuccess(balances))
    } catch (e) {
      yield put(A.fetchBalanceSuccess(DEFAULT_BS_BALANCES))
    }
  }

  const createCard = function* ({ payload }: ReturnType<typeof A.createCard>) {
    try {
      yield put(A.createCardLoading())
      const currency = S.getFiatCurrency(yield select())
      if (!currency) throw new Error(BS_ERROR.NO_FIAT_CURRENCY)

      const userDataR = selectors.modules.profile.getUserData(yield select())
      const billingAddressForm: T.BSBillingAddressFormValuesType | undefined = yield select(
        selectors.form.getFormValues(FORMS_BS_BILLING_ADDRESS)
      )

      const userData = userDataR.getOrFail(BS_ERROR.NO_USER_DATA)
      const address = billingAddressForm || userData.address

      if (!address) throw new Error(BS_ERROR.NO_ADDRESS)

      const card = yield call(api.createCard, {
        address,
        currency,
        email: userData.email,
        paymentMethodTokens: payload
      })

      yield put(A.createCardSuccess(card))
    } catch (e) {
      if (isNabuError(e)) {
        yield put(A.createCardFailure(e))
      } else {
        const error = errorHandlerCode(e)

        yield put(A.createCardFailure(error))
      }
    }
  }

  const fetchSDDVerified = function* () {
    try {
      const isSddVerified = S.getSddVerified(yield select()).getOrElse({
        verified: false
      })
      const { nabuUserId } = (yield select(
        selectors.core.kvStore.unifiedCredentials.getUnifiedOrLegacyNabuEntry
      )).getOrElse({ nabuUserId: null })

      if (!isSddVerified.verified && nabuUserId) {
        yield put(A.fetchSDDVerifiedLoading())
        const sddEligible = yield call(api.fetchSDDVerified)
        yield put(A.fetchSDDVerifiedSuccess(sddEligible))
      }
    } catch (e) {
      const { code: network_error_code, message: network_error_description } =
        errorCodeAndMessage(e)
      const error: PartialClientErrorProperties = {
        network_endpoint: '/sdd/verified',
        network_error_code,
        network_error_description,
        source: 'NABU'
      }
      yield put(A.fetchSDDVerifiedFailure(error))
    }
  }

  const fetchBSCards = function* ({ payload }: ReturnType<typeof A.fetchCards>) {
    let useNewPaymentProviders = false
    try {
      yield call(waitForUserData)

      yield call(fetchSDDVerified)
      const isUserTier2 = yield call(isTier2)
      const sddVerified = S.isUserSddVerified(yield select()).getOrElse(false)
      const loadCards = isUserTier2 || sddVerified

      if (!loadCards) return yield put(A.fetchCardsSuccess([]))
      if (!payload) yield put(A.fetchCardsLoading())

      useNewPaymentProviders = (yield select(
        selectors.core.walletOptions.getUseNewPaymentProviders
      )).getOrElse(false)

      const cards = yield call(api.getBSCards, useNewPaymentProviders)
      yield put(A.fetchCardsSuccess(cards))
    } catch (e) {
      const { code: network_error_code, message: network_error_description } =
        errorCodeAndMessage(e)
      const error: PartialClientErrorProperties = {
        network_endpoint: `/payments/cards?cardProvider=${useNewPaymentProviders}`,
        network_error_code,
        network_error_description,
        source: 'NABU'
      }
      yield put(A.fetchCardsFailure(error))
    }
  }

  const fetchFiatEligible = function* ({ payload }: ReturnType<typeof A.fetchFiatEligible>) {
    try {
      let fiatEligible: FiatEligibleType
      yield put(A.fetchFiatEligibleLoading())
      // If user is not tier 2 fake eligible check to allow KYC
      if (!(yield call(isTier2))) {
        fiatEligible = {
          buySellTradingEligible: true,
          eligible: true,
          maxPendingConfirmationSimpleBuyTrades: 1,
          maxPendingDepositSimpleBuyTrades: 1,
          paymentAccountEligible: true,
          pendingConfirmationSimpleBuyTrades: 0,
          pendingDepositSimpleBuyTrades: 0,
          simpleBuyPendingTradesEligible: true,
          simpleBuyTradingEligible: true
        }
      } else {
        fiatEligible = yield call(api.getBSFiatEligible, payload)
      }
      yield put(A.fetchFiatEligibleSuccess(fiatEligible))
    } catch (e) {
      if (isNabuError(e)) {
        yield put(A.fetchFiatEligibleFailure(e))
      }

      const { code: network_error_code, message: network_error_description } =
        errorCodeAndMessage(e)
      const error: PartialClientErrorProperties = {
        network_endpoint: '/simple-buy/eligible',
        network_error_code,
        network_error_description,
        source: 'NABU'
      }

      yield put(A.fetchFiatEligibleFailure(error))
    }
  }

  const fetchSDDEligible = function* () {
    try {
      yield put(A.fetchSDDEligibleLoading())
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
      const { code: network_error_code, message: network_error_description } =
        errorCodeAndMessage(e)
      const error: PartialClientErrorProperties = {
        network_endpoint: '/sdd/eligible',
        network_error_code,
        network_error_description,
        source: 'NABU'
      }
      yield put(A.fetchSDDEligibleFailure(error))
    }
  }

  const fetchBSOrders = function* ({ payload }: ReturnType<typeof A.fetchOrders>) {
    try {
      yield call(waitForUserData)
      if (!payload) yield put(A.fetchOrdersLoading())
      const orders = yield call(api.getBSOrders, {})
      yield put(A.fetchOrdersSuccess(orders))
      yield put(actions.components.brokerage.fetchBankTransferAccounts())
    } catch (e) {
      if (!(yield call(isTier2))) return yield put(A.fetchOrdersSuccess([]))

      const { code: network_error_code, message: network_error_description } =
        errorCodeAndMessage(e)
      const error: PartialClientErrorProperties = {
        network_endpoint: '/simple-buy/trades',
        network_error_code,
        network_error_description,
        source: 'NABU'
      }
      yield put(A.fetchOrdersFailure(error))
    }
  }

  const fetchPairs = function* ({ payload }: ReturnType<typeof A.fetchPairs>) {
    const { coin, currency } = payload
    try {
      yield put(A.fetchPairsLoading())
      const { pairs }: ReturnType<typeof api.getBSPairs> = yield call(api.getBSPairs, currency)
      const filteredPairs = pairs.filter((pair) => {
        return (
          window.coins[getCoinFromPair(pair.pair)] &&
          window.coins[getCoinFromPair(pair.pair)].coinfig.type.name !== Coin.FIAT
        )
      })
      yield put(A.fetchPairsSuccess({ coin, pairs: filteredPairs }))
    } catch (e) {
      const { code: network_error_code, message: network_error_description } =
        errorCodeAndMessage(e)
      const error: PartialClientErrorProperties = {
        network_endpoint: '/simple-buy/pairs',
        network_error_code,
        network_error_description,
        source: 'NABU'
      }
      yield put(A.fetchPairsFailure(error))
    }
  }

  const fetchPaymentAccount = function* () {
    try {
      yield put(A.fetchPaymentAccountLoading())
      const fiatCurrency = S.getFiatCurrency(yield select())
      if (!fiatCurrency) throw new Error(BS_ERROR.NO_FIAT_CURRENCY)
      const account: BSAccountType = yield call(api.getBSPaymentAccount, fiatCurrency)
      yield put(A.fetchPaymentAccountSuccess(account))
    } catch (e) {
      // TODO: adding error handling with different error types and messages
      const error = errorHandler(e)
      yield put(A.fetchPaymentAccountFailure(error))
    }
  }

  const fetchPaymentMethods = function* ({ payload }: ReturnType<typeof A.fetchPaymentMethods>) {
    try {
      yield call(waitForUserData)
      const userData = selectors.modules.profile.getUserData(yield select()).getOrElse({
        state: 'NONE'
      } as UserDataType)

      // 🚨DO NOT create the user if no currency is passed
      if (userData.state === 'NONE' && !payload) {
        return yield put(A.fetchPaymentMethodsSuccess(DEFAULT_BS_METHODS))
      }

      // Only show Loading if not Success or 0 methods
      const sbMethodsR = S.getBSPaymentMethods(yield select())
      const sbMethods = sbMethodsR.getOrElse(DEFAULT_BS_METHODS)
      if (!Remote.Success.is(sbMethodsR) || !sbMethods.methods.length)
        yield put(A.fetchPaymentMethodsLoading())

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
      const currentUserTier = selectors.modules.profile
        .getCurrentTier(state)
        .getOrFail('User has no tier')
      const userSDDEligibleTier = S.getUserSddEligibleTier(state).getOrElse(1)
      // only fetch non-eligible payment methods if user is not tier 2
      const includeNonEligibleMethods = currentUserTier === 2
      // if user is SDD tier 3 eligible, fetch limits for tier 3
      // else let endpoint return default current tier limits for current tier of user
      // double check if user is tier 2 and in case user is ignore this property
      const includeTierLimits =
        userSDDEligibleTier === SDD_TIER && currentUserTier !== 2 ? SDD_TIER : undefined

      let paymentMethods = yield call(
        api.getBSPaymentMethods,
        payload || fallbackFiatCurrency,
        includeNonEligibleMethods,
        includeTierLimits
      )

      // 🚨👋 temporarily remove ACH from user payment methods if they are not t2
      // t2 users who are invited to ACH beta will still get method since the API will
      // return that method if they are actually eligible
      if (currentUserTier !== 2) {
        paymentMethods = paymentMethods.filter(
          (method) => method.type !== BSPaymentTypes.BANK_TRANSFER
        )
      }
      yield put(
        A.fetchPaymentMethodsSuccess({
          currency: payload || fallbackFiatCurrency,
          methods: paymentMethods
        })
      )
    } catch (e) {
      // TODO: adding error handling with different error types and messages
      const error = errorHandler(e)
      yield put(A.fetchPaymentMethodsFailure(error))
    }
  }

  const fetchBSQuote = function* ({ payload }: ReturnType<typeof A.fetchQuote>) {
    // this is actually fetchQuote() action
    try {
      const { amount, orderType, pair } = payload
      yield put(A.fetchQuoteLoading())
      const quote: BSQuoteType = yield call(api.getBSQuote, pair, orderType, amount)
      yield put(A.fetchQuoteSuccess(quote))
    } catch (e) {
      // TODO: adding error handling with different error types and messages
      const error = errorHandler(e)
      yield put(A.fetchQuoteFailure(error))
    }
  }

  const fetchBuyQuote = function* ({ payload }: ReturnType<typeof A.fetchBuyQuote>) {
    while (true) {
      try {
        const { amount, pair, paymentMethod, paymentMethodId } = payload
        const pairReversed = reversePair(pair)

        // paymentMethodId is required when profile=SIMPLEBUY and paymentMethod=BANK_TRANSFER
        const buyQuotePaymentMethodId =
          paymentMethod === BSPaymentTypes.BANK_TRANSFER ? paymentMethodId : undefined

        const effectivePaymentMethod =
          paymentMethod === BSPaymentTypes.USER_CARD ? BSPaymentTypes.PAYMENT_CARD : paymentMethod

        const quote: ReturnType<typeof api.getBuyQuote> = yield call(
          api.getBuyQuote,
          pairReversed,
          'SIMPLEBUY',
          amount,
          effectivePaymentMethod,
          buyQuotePaymentMethodId
        )

        yield put(
          A.fetchBuyQuoteSuccess({
            fee: quote.feeDetails.fee.toString(),
            pair,
            quote,
            rate: parseInt(quote.price)
          })
        )
        const refresh = Math.abs(
          differenceInMilliseconds(new Date(quote.quoteExpiresAt), addSeconds(new Date(), 10))
        )
        yield delay(refresh)
      } catch (e) {
        if (isNabuError(e)) {
          yield put(A.fetchBuyQuoteFailure(e))

          yield put(A.stopPollBuyQuote())

          return
        }

        const { code: network_error_code, message: network_error_description } =
          errorCodeAndMessage(e)
        const error: PartialClientErrorProperties = {
          network_endpoint: '/brokerage/quote',
          network_error_code,
          network_error_description,
          source: 'NABU'
        }
        yield put(A.fetchBuyQuoteFailure(error))
        // stop fetching new quote until user does retry action
        yield put(A.stopPollBuyQuote())
      }
    }
  }

  // new sell quote fetch
  // Copied from swap and hopefully eventually
  // shared between the 2 UIs and 3 methods (buy, sell, swap)

  // used for sell only now, eventually buy as well
  // TODO: use swap2 quote for buy AND sell
  const fetchSellQuote = function* ({ payload }: ReturnType<typeof A.fetchSellQuote>) {
    while (true) {
      try {
        yield put(A.fetchSellQuoteLoading())

        const { pair } = payload
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

        yield put(A.fetchSellQuoteSuccess({ quote, rate }))
        const refresh = Math.abs(
          differenceInMilliseconds(new Date(quote.expiresAt), addSeconds(new Date(), 10))
        )
        yield delay(refresh)
      } catch (e) {
        const error = errorHandler(e)
        yield put(A.fetchSellQuoteFailure(error))
        yield delay(FALLBACK_DELAY)
        yield put(A.startPollSellQuote(payload))
      }
    }
  }

  const formChanged = function* (action) {
    try {
      if (action.meta.form !== FORM_BS_CHECKOUT) return
      if (action.meta.field !== 'amount') return
      const formValues = selectors.form.getFormValues(FORM_BS_CHECKOUT)(
        yield select()
      ) as T.BSCheckoutFormValuesType
      const account = S.getSwapAccount(yield select())
      const pair = S.getBSPair(yield select())

      if (!formValues) return
      if (!account) return
      if (!pair) return

      const paymentR = S.getPayment(yield select())
      const quoteR = S.getSellQuote(yield select())
      const quote = quoteR.getOrFail(BS_ERROR.NO_QUOTE)

      const amt = getQuote(pair.pair, quote.rate, formValues.fix, formValues.amount)

      const cryptoAmt = formValues.fix === 'CRYPTO' ? formValues.amount : amt
      yield put(actions.form.change(FORM_BS_CHECKOUT, 'cryptoAmount', cryptoAmt))
      if (account.type === SwapBaseCounterTypes.CUSTODIAL) return
      // @ts-ignore
      let payment = paymentGetOrElse(account.coin, paymentR)
      const paymentAmount = generateProvisionalPaymentAmount(account.coin, Number(cryptoAmt))
      payment = yield payment.amount(paymentAmount)
      payment = yield payment.build()
      yield put(A.updatePaymentSuccess(payment.value()))
    } catch (e) {
      console.error(e)
    }
  }

  const handleBSDepositFiatClick = function* ({
    payload
  }: ReturnType<typeof A.handleDepositFiatClick>) {
    const { coin } = payload

    yield call(waitForUserData)
    const isUserTier2 = yield call(isTier2)

    if (!isUserTier2) {
      yield put(A.showModal({ origin: 'EmptyFeed' }))
      yield put(
        A.setStep({
          step: 'KYC_REQUIRED'
        })
      )
    } else {
      yield put(A.showModal({ origin: 'EmptyFeed' }))

      // wait for modal
      yield delay(500)
      yield put(
        A.setStep({
          displayBack: false,
          fiatCurrency: coin as FiatType,
          step: 'BANK_WIRE_DETAILS'
        })
      )
    }
  }

  const handleBuyMaxAmountClick = function* ({
    payload
  }: ReturnType<typeof A.handleBuyMaxAmountClick>) {
    const { amount, coin } = payload
    const standardAmt = convertBaseToStandard(coin, amount)

    yield put(actions.form.change(FORM_BS_CHECKOUT, 'amount', standardAmt))
  }

  const handleBuyMinAmountClick = function* ({
    payload
  }: ReturnType<typeof A.handleBuyMinAmountClick>) {
    const { amount, coin } = payload
    const standardAmt = convertBaseToStandard(coin, amount)

    yield put(actions.form.change(FORM_BS_CHECKOUT, 'amount', standardAmt))
  }

  const handleSellMaxAmountClick = function* ({
    payload
  }: ReturnType<typeof A.handleSellMaxAmountClick>) {
    const { amount, coin } = payload
    const standardAmt = convertBaseToStandard(coin, amount)

    yield put(actions.form.change(FORM_BS_CHECKOUT, 'amount', standardAmt))
  }

  const handleSellMinAmountClick = function* ({
    payload
  }: ReturnType<typeof A.handleSellMinAmountClick>) {
    const { amount, coin } = payload
    const standardAmt = convertBaseToStandard(coin, amount)

    yield put(actions.form.change(FORM_BS_CHECKOUT, 'amount', standardAmt))
  }

  const handleMethodChange = function* ({
    payload: { isFlow, method, mobilePaymentMethod }
  }: ReturnType<typeof A.handleMethodChange>) {
    const values: T.BSCheckoutFormValuesType = yield select(
      selectors.form.getFormValues(FORM_BS_CHECKOUT)
    )

    const cryptoCurrency = S.getCryptoCurrency(yield select()) || 'BTC'
    const originalFiatCurrency = S.getFiatCurrency(yield select())
    // At this point fiatCurrency should be set inside buy/sell flow - fallback to USD
    let fiatCurrency = S.getFiatCurrency(yield select()) || 'USD'
    // keep using buy/sell flow currency unless if funds has been selected
    if (method.type === BSPaymentTypes.FUNDS && fiatCurrency !== method.currency) {
      fiatCurrency = method.currency
    }
    const pair = S.getBSPair(yield select())
    const swapAccount = S.getSwapAccount(yield select())
    if (!pair) throw new Error(BS_ERROR.NO_PAIR_SELECTED)
    const isUserTier2 = yield call(isTier2)

    if (!isUserTier2) {
      switch (method.type) {
        // https://blockc.slack.com/archives/GT1JZ1ZN2/p1596546978351100?thread_ts=1596541628.345800&cid=GT1JZ1ZN2
        // REMOVE THIS WHEN BACKEND CAN HANDLE PENDING 'FUNDS' ORDERS
        // 👇--------------------------------------------------------
        case BSPaymentTypes.BANK_ACCOUNT:
        case BSPaymentTypes.USER_CARD:
          return yield put(
            A.setStep({
              step: 'KYC_REQUIRED'
            })
          )
        // REMOVE THIS WHEN BACKEND CAN HANDLE PENDING 'FUNDS' ORDERS
        // 👆--------------------------------------------------------
        case BSPaymentTypes.PAYMENT_CARD:
          // ADD THIS WHEN BACKEND CAN HANDLE PENDING 'FUNDS' ORDERS
          // 👇-----------------------------------------------------
          // const methodType =
          //   method.type === BSPaymentTypes.BANK_ACCOUNT ? BSPaymentTypes.FUNDS : method.type
          // return yield put(A.createBSOrder(undefined, methodType))
          // 👆------------------------------------------------------

          return yield put(A.createOrder({ paymentType: method.type }))
        default:
          return
      }
    }

    // User is Tier 2
    switch (method.type) {
      case BSPaymentTypes.BANK_ACCOUNT:
        return yield put(
          A.setStep({
            displayBack: true,
            fiatCurrency,
            step: 'BANK_WIRE_DETAILS'
          })
        )
      case BSPaymentTypes.LINK_BANK: // Yapily, Yodlee, Plaid, ...
        yield put(actions.components.buySell.setStep({ step: 'LOADING' }))
        const { bankCredentials } = yield call(setupBankTransferProvider)

        let modalType: ModalName
        switch (true) {
          case bankCredentials && bankCredentials.payload.partner === 'YAPILY':
            modalType = ModalName.ADD_BANK_YAPILY_MODAL
            break
          case bankCredentials && bankCredentials.payload.partner === 'PLAID':
            modalType = ModalName.ADD_BANK_PLAID_MODAL
            break
          default:
            // YODLEE
            modalType = ModalName.ADD_BANK_YODLEE_MODAL
            break
        }

        // Open the add bank (brokerage) modal on top of the buySell modal
        yield put(
          actions.components.brokerage.showModal({
            isFlow,
            modalType,
            origin: BrokerageModalOriginType.ADD_BANK_BUY
          })
        )
        yield put(
          actions.components.brokerage.setAddBankStep({
            addBankStep: AddBankStepType.ADD_BANK
          })
        )

        // wait for the add bank modal to open and then change the step to payment method
        yield take(actions.modals.showModal.type)
        yield put(A.setStep({ cryptoCurrency, fiatCurrency, pair, step: 'PAYMENT_METHODS' }))
        return
      case BSPaymentTypes.PAYMENT_CARD:
        if (mobilePaymentMethod) {
          return yield put(
            A.setStep({
              cryptoCurrency,
              fiatCurrency,
              method,
              mobilePaymentMethod,
              orderType: values?.orderType,
              pair,
              step: 'ENTER_AMOUNT',
              swapAccount
            })
          )
        }

        return yield put(
          A.setStep({
            step: 'DETERMINE_CARD_PROVIDER'
          })
        )
      default:
        yield put(
          A.setStep({
            cryptoCurrency,
            fiatCurrency,
            method,
            orderType: values?.orderType,
            pair,
            step: 'ENTER_AMOUNT',
            swapAccount
          })
        )
    }

    // Change wallet/sb fiatCurrency if necessary
    // and fetch new pairs w/ new fiatCurrency
    // and pass along cryptoCurrency for pair swap
    if (originalFiatCurrency !== fiatCurrency) {
      yield put(actions.modules.settings.updateCurrency(method.currency, true))
      yield put(A.fetchPairs({ coin: cryptoCurrency, currency: method.currency }))
    }
  }

  const initializeBillingAddress = function* () {
    yield call(waitForUserData)
    const userDataR = selectors.modules.profile.getUserData(yield select())
    const userData = userDataR.getOrElse({} as UserDataType)
    const address = userData
      ? userData.address
      : {
          city: '',
          country: 'GB',
          line1: '',
          line2: '',
          postCode: '',
          state: ''
        }

    yield put(
      actions.form.initialize(FORMS_BS_BILLING_ADDRESS, {
        ...address
      })
    )
  }

  const initializeCheckout = function* ({
    payload: {
      account,
      amount,
      cryptoAmount,
      fix,
      orderType,
      paymentMethodId,
      paymentMethodType,
      period
    }
  }: ReturnType<typeof A.initializeCheckout>) {
    try {
      yield call(waitForUserData)
      const fiatCurrency = S.getFiatCurrency(yield select())
      if (!fiatCurrency) throw new Error(BS_ERROR.NO_FIAT_CURRENCY)
      const pair = S.getBSPair(yield select())
      if (!pair) throw new Error(BS_ERROR.NO_PAIR_SELECTED)
      // Fetch rates
      if (orderType === OrderType.BUY) {
        const fakeQuoteAmount = '1000'

        yield put(
          A.startPollBuyQuote({
            amount: fakeQuoteAmount,
            pair: pair.pair,
            paymentMethod: paymentMethodType,
            paymentMethodId
          })
        )
        yield race({
          failure: take(A.fetchBuyQuoteFailure.type),
          success: take(A.fetchBuyQuoteSuccess.type)
        })
      } else if (orderType === OrderType.SELL) {
        if (!account) throw new Error(BS_ERROR.NO_ACCOUNT)
        yield put(A.fetchSellQuote({ account, pair: pair.pair }))
        yield put(A.startPollSellQuote({ account, pair: pair.pair }))
        yield race({
          failure: take(A.fetchSellQuoteFailure.type),
          success: take(A.fetchSellQuoteSuccess.type)
        })
        const quote = S.getSellQuote(yield select()).getOrFail(BS_ERROR.NO_QUOTE)

        if (account.type === SwapBaseCounterTypes.ACCOUNT) {
          const formValues = selectors.form.getFormValues(FORM_BS_CHECKOUT)(
            yield select()
          ) as T.BSCheckoutFormValuesType
          const payment = yield call(
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

      // Recurring Buy Feature Flag
      const isRecurringBuy = selectors.core.walletOptions
        .getFeatureFlagRecurringBuys(yield select())
        .getOrElse(false) as boolean

      const lastUnusedAmounts = selectors.cache.getLastUnusedAmounts(yield select())

      const lastUnusedAmount = lastUnusedAmounts ? lastUnusedAmounts[pair.pair] : null

      yield put(
        actions.form.initialize(FORM_BS_CHECKOUT, {
          amount: amount || (fix === Coin.FIAT && lastUnusedAmount) ? lastUnusedAmount : '0',
          cryptoAmount,
          fix,
          orderType,
          period: isRecurringBuy ? period : undefined
        })
      )
    } catch (e) {
      // TODO: adding error handling with different error types and messages
      const error = errorHandler(e)
      yield put(actions.logs.logErrorMessage(error))
    }
  }

  const pollBSBalances = function* () {
    const skipLoading = true

    yield put(A.fetchBalance({ skipLoading }))
  }

  const pollBSCard = function* ({ payload }: ReturnType<typeof A.pollCard>) {
    let retryAttempts = 0
    const maxRetryAttempts = 10

    try {
      let card: ReturnType<typeof api.getBSCard> = yield call(api.getBSCard, payload)
      let step = S.getStep(yield select())

      while (
        (card.state === 'CREATED' || card.state === 'PENDING') &&
        retryAttempts < maxRetryAttempts
      ) {
        card = yield call(api.getBSCard, payload)
        retryAttempts += 1
        step = S.getStep(yield select())
        if (
          step !== '3DS_HANDLER_EVERYPAY' &&
          step !== '3DS_HANDLER_STRIPE' &&
          step !== '3DS_HANDLER_CHECKOUTDOTCOM'
        ) {
          yield cancel()
        }
        yield delay(2000)
      }

      if (card.state === 'ACTIVE') {
        const skipLoading = true
        const order = S.getBSLatestPendingOrder(yield select())
        yield put(A.fetchCards(skipLoading))
        const cardMethodR = S.getMethodByType(yield select(), BSPaymentTypes.PAYMENT_CARD)

        // If the order was already created
        if (order && order.state === 'PENDING_CONFIRMATION') {
          return yield put(A.confirmOrder({ order, paymentMethodId: card.id }))
        }

        const origin = S.getOrigin(yield select())

        if (origin === 'SettingsGeneral') {
          yield put(actions.modals.closeModal(ModalName.SIMPLE_BUY_MODAL))

          yield put(actions.alerts.displaySuccess('Card Added.'))
        }

        // Sets the payment method to the newly created card in the enter amount form
        if (Remote.Success.is(cardMethodR)) {
          const method = cardMethodR.getOrFail(BS_ERROR.NO_PAYMENT_METHODS)
          const newCardMethod = {
            ...card,
            ...method,
            type: BSPaymentTypes.USER_CARD
          } as BSPaymentMethodType
          yield put(A.setMethod(newCardMethod))
        }

        return yield put(
          A.createOrder({ paymentMethodId: card.id, paymentType: BSPaymentTypes.PAYMENT_CARD })
        )
      }

      if (card.state === 'PENDING') {
        yield put(A.createCardFailure(CARD_ERROR_CODE.PENDING_CARD_AFTER_POLL))
        return
      }

      yield put(A.createCardFailure(CARD_ERROR_CODE.LINK_CARD_FAILED))
    } catch (e) {
      if (isNabuError(e)) {
        yield put(A.createCardFailure(e))
      } else {
        const error = errorHandlerCode(e)
        yield put(A.createCardFailure(error))
      }
    }
  }

  const pollBSOrder = function* ({ payload }: ReturnType<typeof A.pollOrder>) {
    let retryAttempts = 0
    const maxRetryAttempts = 10

    try {
      let order: ReturnType<typeof api.getBSOrder> = yield call(api.getBSOrder, payload)
      let step = S.getStep(yield select())

      while (order.state === 'PENDING_DEPOSIT' && retryAttempts < maxRetryAttempts) {
        order = yield call(api.getBSOrder, payload)
        step = S.getStep(yield select())
        retryAttempts += 1
        if (
          step !== '3DS_HANDLER_EVERYPAY' &&
          step !== '3DS_HANDLER_STRIPE' &&
          step !== '3DS_HANDLER_CHECKOUTDOTCOM'
        ) {
          yield cancel()
        }
        yield delay(2000)
      }

      yield put(A.confirmOrderSuccess(order))
      yield put(A.setStep({ step: 'ORDER_SUMMARY' }))
      yield put(cacheActions.removeLastUsedAmount({ pair: order.pair }))
    } catch (e) {
      if (isNabuError(e)) {
        yield put(A.createOrderFailure(e))
      } else {
        yield put(A.createOrderFailure(ORDER_ERROR_CODE.ORDER_FAILED_AFTER_POLL))
      }
    }
  }

  const setStepChange = function* (action: ReturnType<typeof A.setStep>) {
    if (action.type === '@EVENT.SET_BS_STEP') {
      if (action.payload.step === 'ORDER_SUMMARY') {
        yield call(pollBSBalances)
      }
    }
    const useVgsProvider = selectors.core.walletOptions
      .getFeatureFlagUseVgsProvider(yield select())
      .getOrElse(false) as boolean

    // If VGS feature flag is on we should go the VGS flow, otherwise go down our
    // normal checkout.com card add flow
    if (action.payload.step === 'DETERMINE_CARD_PROVIDER' && !useVgsProvider) {
      const cardAcquirers: CardAcquirer[] = yield call(api.getCardAcquirers)

      const checkoutAcquirers: CardAcquirer[] = cardAcquirers.filter(
        (cardAcquirer: CardAcquirer) => cardAcquirer.cardAcquirerName === 'CHECKOUTDOTCOM'
      )

      if (checkoutAcquirers.length === 0) {
        throw new Error(BS_ERROR.CHECKOUTDOTCOM_NOT_FOUND)
      }

      const checkoutDotComAccountCodes = checkoutAcquirers.reduce((prev, curr) => {
        return [...new Set([...prev, ...curr.cardAcquirerAccountCodes])]
      }, [] as string[])

      const checkoutDotComApiKey = checkoutAcquirers[0].apiKey

      yield put(
        A.setStep({
          checkoutDotComAccountCodes,
          checkoutDotComApiKey,
          step: 'ADD_CARD_CHECKOUTDOTCOM'
        })
      )
    } else if (action.payload.step === 'DETERMINE_CARD_PROVIDER' && useVgsProvider) {
      const vgsDetails: ReturnType<typeof api.createAddCardToken> = yield call(
        api.createAddCardToken
      )
      yield put(
        A.setStep({
          cardTokenId: vgsDetails.card_token_id,
          step: 'ADD_CARD_VGS',
          vgsVaultId: vgsDetails.vgs_vault_id
        })
      )
    }
  }

  // Util function to help match payment method ID
  // to more details about the bank
  const getBankInformation = function* (order: BSOrderType) {
    yield put(actions.components.brokerage.fetchBankTransferAccounts())
    yield take(actions.components.brokerage.fetchBankTransferAccountsSuccess.type)
    const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(yield select())
    const bankAccounts = bankAccountsR.getOrElse([])
    const [bankAccount] = filter(
      (b: BankTransferAccountType) =>
        // @ts-ignore
        b.id === prop('paymentMethodId', order),
      defaultTo([])(bankAccounts)
    )

    return bankAccount
  }

  const cleanupCancellableOrders = function* () {
    const order = S.getCancelableOrder(yield select())
    if (order) {
      try {
        yield call(api.cancelBSOrder, order)
      } catch (error) {
        if (error.status !== 409) {
          throw error
        }
      }

      yield put(A.fetchOrders())
      yield take(A.fetchOrdersSuccess.type)
    }
  }

  const showModal = function* ({ payload }: ReturnType<typeof A.showModal>) {
    // When opening the buy modal if there are any existing orders that are cancellable, cancel them
    yield call(cleanupCancellableOrders)

    const { cryptoCurrency, method, mobilePaymentMethod, orderType, origin, step } = payload

    let hasPendingOBOrder = false
    const latestPendingOrder = S.getBSLatestPendingOrder(yield select())

    // get current user tier
    const isUserTier2 = yield call(isTier2)

    // FIXME: This call is causing the modal to be very slow, abstract this to somewhere other than here
    yield put(actions.custodial.fetchProductEligibilityForUser())
    yield take([
      custodialActions.fetchProductEligibilityForUserSuccess.type,
      custodialActions.fetchProductEligibilityForUserFailure.type
    ])

    const products = selectors.custodial.getProductEligibilityForUser(yield select()).getOrElse({
      buy: { enabled: false, maxOrdersLeft: 0, reasonNotEligible: undefined },
      sell: { reasonNotEligible: undefined }
    } as ProductEligibilityForUser)

    // check is user eligible to do sell/buy
    // we skip this for gold users
    if (!isUserTier2 && !latestPendingOrder) {
      const userCanBuyMore = products.buy?.maxOrdersLeft > 0
      // prompt upgrade modal in case that user can't buy more
      // users with diff tier than 2 can't sell
      if (!userCanBuyMore || orderType === OrderType.SELL) {
        yield put(
          actions.modals.showModal(ModalName.UPGRADE_NOW_SILVER_MODAL, {
            origin: 'BuySellInit'
          })
        )
        return
      }
    }

    // FIXME: This call is causing the modal to be very slow, abstract this to somewhere other than here
    const completedKYC = yield call(getExtraKYCCompletedStatus, {
      api,
      context: ExtraKYCContext.TRADING,
      origin: 'BuySell' as VerifyIdentityOriginType
    })

    // If KYC was closed before answering, return
    if (!completedKYC) {
      return
    }

    // show sanctions for buy
    if (products?.buy?.reasonNotEligible) {
      const message =
        products.buy.reasonNotEligible.reason !== CustodialSanctionsEnum.EU_5_SANCTION
          ? products.buy.reasonNotEligible.message
          : undefined
      yield put(
        actions.modals.showModal(ModalName.SANCTIONS_INFO_MODAL, {
          message,
          origin: 'BuySellInit'
        })
      )
      return
    }
    // show sanctions for sell
    if (products?.sell?.reasonNotEligible && orderType === OrderType.SELL) {
      const message =
        products.sell.reasonNotEligible.reason !== CustodialSanctionsEnum.EU_5_SANCTION
          ? products.sell.reasonNotEligible.message
          : undefined
      yield put(
        actions.modals.showModal(ModalName.SANCTIONS_INFO_MODAL, {
          message,
          origin: 'BuySellInit'
        })
      )
      return
    }

    // Check if there is a pending_deposit Open Banking order
    if (latestPendingOrder) {
      const bankAccount = yield call(getBankInformation, latestPendingOrder as BSOrderType)
      hasPendingOBOrder = prop('partner', bankAccount) === BankPartners.YAPILY
    }

    yield put(actions.modals.showModal(ModalName.SIMPLE_BUY_MODAL, { cryptoCurrency, origin }))

    // Use the user's trading currency setting whenever opening the buy flow
    const fiatCurrency = selectors.modules.profile
      .getTradingCurrency(yield select())
      .getOrElse('USD')

    // When user closes the QR code modal and opens it via one of the pending
    // buy buttons in the app. We need to take them to the qrcode screen and
    // poll for the order status
    if (hasPendingOBOrder && latestPendingOrder) {
      const step: T.StepActionsPayload['step'] = 'OPEN_BANKING_CONNECT'

      yield fork(confirmOrderPoll, A.confirmOrderPoll(latestPendingOrder))
      yield put(
        A.setStep({
          step
        })
      )
      // For all silver/silver+ users if they have pending transaction and they are from silver revamp
      // we want to let users to be able to approve/cancel transaction otherwise they will be blocked
    } else if (!isUserTier2 && latestPendingOrder) {
      const step: T.StepActionsPayload['step'] =
        latestPendingOrder.state === 'PENDING_CONFIRMATION' ? 'CHECKOUT_CONFIRM' : 'ORDER_SUMMARY'
      yield fork(confirmOrderPoll, A.confirmOrderPoll(latestPendingOrder))

      yield put(
        A.setStep({
          step
        })
      )
    } else if (cryptoCurrency) {
      switch (orderType) {
        case OrderType.BUY:
          yield put(
            // 🚨 SPECIAL TS-IGNORE
            // Usually ENTER_AMOUNT should require a pair but
            // here we do not require a pair. Instead we have
            // cryptoCurrency and fiatCurrency and
            // INITIALIZE_CHECKOUT will set the pair on state.
            // 🚨 SPECIAL TS-IGNORE
            // @ts-ignore
            A.setStep({
              cryptoCurrency,
              fiatCurrency,
              method,
              mobilePaymentMethod,
              orderType,
              step: 'ENTER_AMOUNT'
            })
          )
          break
        case OrderType.SELL:
          yield put(
            A.setStep({
              cryptoCurrency,
              fiatCurrency,
              orderType,
              step: 'CRYPTO_SELECTION'
            })
          )
          break
        default:
          // do nothing
          break
      }
    } else {
      const originalFiatCurrency = isFiatCurrencySupported(fiatCurrency) ? undefined : fiatCurrency
      yield put(
        A.setStep({
          cryptoCurrency,
          fiatCurrency,
          originalFiatCurrency,
          step: step || 'CRYPTO_SELECTION'
        })
      )
    }
  }

  const switchFix = function* ({ payload }: ReturnType<typeof A.switchFix>) {
    yield put(actions.form.change(FORM_BS_CHECKOUT, 'fix', payload.fix))
    yield put(actions.preferences.setBSCheckoutFix(payload.orderType, payload.fix))
    const newAmount = new BigNumber(payload.amount).isGreaterThan(0) ? payload.amount : undefined
    yield put(actions.form.change(FORM_BS_CHECKOUT, 'amount', newAmount))
    yield put(actions.form.focus(FORM_BS_CHECKOUT, 'amount'))
  }

  const fetchLimits = function* ({ payload }: ReturnType<typeof A.fetchLimits>) {
    const { cryptoCurrency, currency, side } = payload
    try {
      yield put(A.fetchLimitsLoading())
      let limits
      if (cryptoCurrency && side) {
        limits = yield call(api.getBSLimits, currency, ProductTypes.SIMPLEBUY, cryptoCurrency, side)
      } else {
        limits = yield call(api.getSwapLimits, currency)
      }
      yield put(A.fetchLimitsSuccess(limits))
    } catch (e) {
      // TODO: adding error handling with different error types and messages
      const error = errorHandler(e)
      yield put(A.fetchLimitsFailure(error))
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
  const fetchAccumulatedTrades = function* ({
    payload
  }: ReturnType<typeof A.fetchAccumulatedTrades>) {
    const { product } = payload
    try {
      yield put(A.fetchAccumulatedTradesLoading())
      yield call(waitForUserData)
      const accumulatedTradesResponse: ReturnType<typeof api.getAccumulatedTrades> = yield call(
        api.getAccumulatedTrades,
        product
      )
      yield put(A.fetchAccumulatedTradesSuccess(accumulatedTradesResponse.tradesAccumulated))
    } catch (e) {
      // This is a workaround while I don't find a solution for the fetchAccumulatedTradesFailure type
      const error = e as string

      yield put(A.fetchAccumulatedTradesFailure(error))
    }
  }

  return {
    activateBSCard,
    cancelBSOrder,
    checkCardSuccessRate,
    confirmBSFundsOrder,
    confirmOrder,
    confirmOrderPoll,
    createBSOrder,
    createCard,
    deleteBSCard,
    fetchAccumulatedTrades,
    fetchBSBalances,
    fetchBSCards,
    fetchBSOrders,
    fetchBSQuote,
    fetchBuyQuote,
    fetchCrossBorderLimits,
    fetchFiatEligible,
    fetchLimits,
    fetchPairs,
    fetchPaymentAccount,
    fetchPaymentMethods,
    fetchSDDEligible,
    fetchSDDVerified,
    fetchSellQuote,
    formChanged,
    handleBSDepositFiatClick,
    handleBuyMaxAmountClick,
    handleBuyMinAmountClick,
    handleMethodChange,
    handleSellMaxAmountClick,
    handleSellMinAmountClick,
    initializeBillingAddress,
    initializeCheckout,
    pollBSBalances,
    pollBSCard,
    pollBSOrder,
    registerCard,
    setStepChange,
    showModal,
    switchFix
  }
}
