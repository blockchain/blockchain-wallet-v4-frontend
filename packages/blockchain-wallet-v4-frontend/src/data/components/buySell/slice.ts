/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import {
  ApplePayInfoType,
  BSAccountType,
  BSBalancesType,
  BSCardType,
  BSOrderActionType,
  BSOrderType,
  BSPairsType,
  BSPairType,
  BSPaymentMethodsType,
  BSPaymentMethodType,
  BSPaymentTypes,
  BSQuoteType,
  BuyQuoteStateType,
  CoinType,
  CrossBorderLimits,
  CrossBorderLimitsPayload,
  Everypay3DSResponseType,
  FiatEligibleType,
  FiatType,
  MobilePaymentType,
  PaymentValue,
  ProductTypes,
  ProviderDetailsType,
  SDDEligibleType,
  SDDVerifiedType,
  SwapQuoteStateType,
  SwapUserLimitsType,
  TradeAccumulatedItem
} from '@core/types'
import {
  BankTransferAccountType,
  BSCardStateEnum,
  BSFixType,
  BSShowModalOriginType,
  InitializeCheckout,
  ModalOriginType,
  StepActionsPayload,
  SwapAccountType
} from 'data/types'

import { getCoinFromPair, getFiatFromPair } from './model'
import { BSAddCardErrorType, BuySellState } from './types'

const initialState: BuySellState = {
  account: Remote.NotAsked,
  accumulatedTrades: Remote.NotAsked,
  addBank: undefined,
  addCardError: undefined,
  applePayInfo: undefined,
  balances: Remote.NotAsked,
  buyQuote: Remote.NotAsked,
  card: Remote.NotAsked,
  cardId: undefined,
  cards: Remote.NotAsked,
  checkoutDotComAccountCodes: [],
  checkoutDotComApiKey: undefined,
  crossBorderLimits: Remote.NotAsked,
  cryptoCurrency: undefined,
  displayBack: false,
  everypay3DS: Remote.NotAsked,
  fiatCurrency: undefined,
  fiatEligible: Remote.NotAsked,
  limits: Remote.NotAsked,
  method: undefined,
  methods: Remote.NotAsked,
  mobilePaymentMethod: undefined,
  order: undefined,
  orderType: undefined,
  orders: Remote.NotAsked,
  origin: undefined,
  originalFiatCurrency: undefined,
  pair: undefined,
  pairs: Remote.NotAsked,
  payment: Remote.NotAsked,
  providerDetails: Remote.NotAsked,
  quote: Remote.NotAsked,
  sddEligible: Remote.NotAsked,
  sddTransactionFinished: false,
  sddVerified: Remote.NotAsked,
  sellOrder: undefined,
  sellQuote: Remote.NotAsked,
  step: 'CRYPTO_SELECTION',
  swapAccount: undefined
}

const getPayloadObjectForStep = (payload: StepActionsPayload) => {
  switch (payload.step) {
    case 'LINKED_PAYMENT_ACCOUNTS':
    case 'PAYMENT_METHODS':
      return {
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        order: payload.order,
        pair: payload.pair,
        step: payload.step
      }
    case 'VERIFY_EMAIL':
    case 'ENTER_AMOUNT':
      return {
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        method: payload.method,
        mobilePaymentMethod: payload.mobilePaymentMethod,
        orderType: payload.orderType || 'BUY',
        pair: payload.pair,
        step: payload.step,
        swapAccount: payload.swapAccount
      }
    case 'CRYPTO_SELECTION':
      return {
        cryptoCurrency: payload.cryptoCurrency,
        fiatCurrency: payload.fiatCurrency,
        orderType: payload.orderType,
        originalFiatCurrency: payload.originalFiatCurrency,
        step: payload.step
      }
    case 'BANK_WIRE_DETAILS':
      return {
        addBank: payload.addBank,
        displayBack: payload.displayBack,
        fiatCurrency: payload.fiatCurrency,
        step: payload.step
      }
    case 'PREVIEW_SELL': {
      return { sellOrderType: payload.sellOrderType, step: payload.step }
    }
    case 'AUTHORIZE_PAYMENT':
    case 'CHECKOUT_CONFIRM':
    case 'ORDER_SUMMARY':
    case 'OPEN_BANKING_CONNECT':
    case '3DS_HANDLER_EVERYPAY':
    case '3DS_HANDLER_STRIPE':
    case '3DS_HANDLER_CHECKOUTDOTCOM':
      return { order: payload.order, step: payload.step }
    case 'SELL_ORDER_SUMMARY':
      return { sellOrder: payload.sellOrder, step: payload.step }
    case 'ADD_CARD_CHECKOUTDOTCOM':
      return {
        checkoutDotComAccountCodes: payload.checkoutDotComAccountCodes,
        checkoutDotComApiKey: payload.checkoutDotComApiKey,
        step: payload.step
      }
    default:
      return { step: payload.step }
  }
}

const buySellSlice = createSlice({
  initialState,
  name: 'buySell',
  reducers: {
    activateCard: (state, action: PayloadAction<BSCardType>) => {},
    activateCardFailure: (state, action: PayloadAction<string>) => {
      state.providerDetails = Remote.Failure(action.payload)
    },
    activateCardLoading: (state) => {
      state.providerDetails = Remote.Loading
    },
    activateCardSuccess: (state, action: PayloadAction<ProviderDetailsType>) => {
      state.providerDetails = Remote.Success(action.payload)
    },
    addCard: () => {},
    addCardFailure: (state, action: PayloadAction<string>) => {
      state.everypay3DS = Remote.Failure(action.payload)
    },
    addCardFinished: () => {},
    addCardLoading: (state) => {
      state.everypay3DS = Remote.Loading
    },
    addCardSuccess: (state, action: PayloadAction<Everypay3DSResponseType>) => {
      state.everypay3DS = Remote.Success(action.payload)
    },
    cancelOrder: (state, action: PayloadAction<BSOrderType>) => {},
    confirmFundsOrder: () => {},
    confirmOrder: (
      state,
      action: PayloadAction<{
        mobilePaymentMethod?: MobilePaymentType
        order: BSOrderType
        paymentMethodId: BSCardType['id']
      }>
    ) => {},
    confirmOrderPoll: (state, action: PayloadAction<BSOrderType>) => {},
    createCard: (state, action: PayloadAction<{ [key: string]: string }>) => {},
    createCardFailure: (state, action: PayloadAction<string>) => {
      state.card = Remote.Failure(action.payload)
    },
    createCardLoading: (state) => {
      state.card = Remote.Loading
    },
    createCardSuccess: (state, action: PayloadAction<BSCardType>) => {
      state.card = Remote.Success(action.payload)
    },
    createOrder: (
      state,
      action: PayloadAction<{
        mobilePaymentMethod?: MobilePaymentType
        paymentMethodId?: BSCardType['id'] | BankTransferAccountType['id']
        paymentType?: Exclude<
          BSPaymentMethodType['type'],
          BSPaymentTypes.USER_CARD | BSPaymentTypes.BANK_ACCOUNT
        >
      }>
    ) => {},
    defaultMethodEvent: (state, action: PayloadAction<BSPaymentMethodType>) => {},
    deleteCard: (state, action: PayloadAction<BSCardType['id']>) => {},
    destroyCheckout: (state) => {
      state.account = Remote.NotAsked
      state.cardId = undefined
      state.order = undefined
      state.pairs = Remote.NotAsked
      state.quote = Remote.NotAsked
      state.step = 'CRYPTO_SELECTION'
    },
    fetchAccumulatedTrades: (state, action: PayloadAction<{ product: ProductTypes }>) => {},
    fetchAccumulatedTradesFailure: (state, action: PayloadAction<string>) => {
      state.accumulatedTrades = Remote.Failure(action.payload)
    },
    fetchAccumulatedTradesLoading: (state) => {
      state.accumulatedTrades = Remote.Loading
    },
    fetchAccumulatedTradesSuccess: (state, action: PayloadAction<Array<TradeAccumulatedItem>>) => {
      state.accumulatedTrades = Remote.Success(action.payload)
    },
    fetchBSOrders: () => {},
    fetchBalance: (
      state,
      action: PayloadAction<{ currency?: CoinType; skipLoading?: boolean }>
    ) => {},
    fetchBalanceFailure: (state, action: PayloadAction<string>) => {
      state.balances = Remote.Failure(action.payload)
    },
    fetchBalanceLoading: (state) => {
      state.balances = Remote.Loading
    },
    fetchBalanceSuccess: (state, action: PayloadAction<BSBalancesType>) => {
      state.balances = Remote.Success(action.payload)
    },
    fetchBuyQuote: (
      state,
      action: PayloadAction<{
        amount: string
        pair: BSPairsType
        paymentMethod: BSPaymentTypes
        paymentMethodId?: BSCardType['id']
      }>
    ) => {},
    fetchBuyQuoteFailure: (state, action: PayloadAction<string>) => {
      state.buyQuote = Remote.Failure(action.payload)
    },
    fetchBuyQuoteLoading: (state) => {
      state.buyQuote = Remote.Loading
    },
    fetchBuyQuoteSuccess: (state, action: PayloadAction<BuyQuoteStateType>) => {
      state.buyQuote = Remote.Success(action.payload)
    },
    fetchCards: (state, action: PayloadAction<boolean>) => {},
    // cards fetch fails so often in staging that this is a temp fix
    fetchCardsFailure: (state, action: PayloadAction<string>) => {
      state.cards = Remote.Success([])
    },

    fetchCardsLoading: (state) => {
      state.cards = Remote.Loading
    },
    fetchCardsSuccess: (state, action: PayloadAction<BSCardType[]>) => {
      state.cards = Remote.Success(
        action.payload.filter((card) => card.state !== BSCardStateEnum.BLOCKED)
      )
    },
    fetchCrossBorderLimits: (state, action: PayloadAction<CrossBorderLimitsPayload>) => {},
    fetchCrossBorderLimitsFailure: (state, action: PayloadAction<unknown>) => {
      state.crossBorderLimits = Remote.Failure(action.payload)
    },
    fetchCrossBorderLimitsLoading: (state) => {
      state.crossBorderLimits = Remote.Loading
    },
    fetchCrossBorderLimitsSuccess: (state, action: PayloadAction<CrossBorderLimits>) => {
      state.crossBorderLimits = Remote.Success(action.payload)
    },
    fetchFiatEligible: (state, action: PayloadAction<FiatType>) => {},
    fetchFiatEligibleFailure: (state, action: PayloadAction<string>) => {
      state.fiatEligible = Remote.Failure(action.payload)
    },

    fetchFiatEligibleLoading: (state) => {
      state.fiatEligible = Remote.Loading
    },
    fetchFiatEligibleSuccess: (state, action: PayloadAction<FiatEligibleType>) => {
      state.fiatEligible = Remote.Success(action.payload)
    },
    fetchLimits: (
      state,
      action: PayloadAction<{
        cryptoCurrency?: CoinType
        currency: FiatType
        side?: BSOrderActionType
      }>
    ) => {},
    fetchLimitsFailure: (state, action: PayloadAction<string>) => {
      state.limits = Remote.Failure(action.payload)
    },
    fetchLimitsLoading: (state) => {
      state.limits = Remote.Loading
    },
    fetchLimitsSuccess: (state, action: PayloadAction<SwapUserLimitsType>) => {
      state.limits = Remote.Success(action.payload)
    },
    fetchOrders: () => {},
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.orders = Remote.Failure(action.payload)
    },
    fetchOrdersLoading: (state) => {
      state.orders = Remote.Loading
    },
    fetchOrdersSuccess: (state, action: PayloadAction<BSOrderType[]>) => {
      state.orders = Remote.Success(action.payload)
    },
    fetchPairs: (state, action: PayloadAction<{ coin?: CoinType; currency?: FiatType }>) => {},
    fetchPairsFailure: (state, action: PayloadAction<string>) => {
      state.pairs = Remote.Failure(action.payload)
    },
    fetchPairsLoading: (state) => {
      state.pairs = Remote.Loading
    },
    fetchPairsSuccess: (state, action: PayloadAction<{ coin?: CoinType; pairs: BSPairType[] }>) => {
      if (action.payload.coin) {
        state.pair = action.payload.pairs.find(
          (pair) =>
            getCoinFromPair(pair.pair) === action.payload.coin &&
            getFiatFromPair(pair.pair) === state.fiatCurrency
        )
      }

      state.pairs = Remote.Success(action.payload.pairs)
    },
    fetchPaymentAccount: () => {},
    fetchPaymentAccountFailure: (state, action: PayloadAction<string>) => {
      state.account = Remote.Failure(action.payload)
    },
    fetchPaymentAccountLoading: (state) => {
      state.account = Remote.Loading
    },
    fetchPaymentAccountSuccess: (state, action: PayloadAction<BSAccountType>) => {
      state.account = Remote.Success(action.payload)
    },
    fetchPaymentMethods: (state, action: PayloadAction<FiatType | undefined>) => {},
    fetchPaymentMethodsFailure: (state, action: PayloadAction<string>) => {
      state.methods = Remote.Failure(action.payload)
    },
    fetchPaymentMethodsLoading: (state) => {
      state.methods = Remote.Loading
    },
    fetchPaymentMethodsSuccess: (state, action: PayloadAction<BSPaymentMethodsType>) => {
      state.methods = Remote.Success(action.payload)
    },
    fetchQuote: (
      state,
      action: PayloadAction<{
        amount: string
        orderType: BSOrderActionType
        pair: BSPairsType
      }>
    ) => {},
    fetchQuoteFailure: (state, action: PayloadAction<string>) => {
      state.quote = Remote.Failure(action.payload)
    },
    fetchQuoteLoading: (state) => {
      state.quote = Remote.Loading
    },
    fetchQuoteSuccess: (state, action: PayloadAction<BSQuoteType>) => {
      state.quote = Remote.Success(action.payload)
    },
    fetchSDDEligibility: () => {},
    fetchSDDEligibleFailure: (state, action: PayloadAction<string>) => {
      state.sddEligible = Remote.Failure(action.payload)
    },
    fetchSDDEligibleLoading: (state) => {
      state.sddEligible = Remote.Loading
    },
    fetchSDDEligibleSuccess: (state, action: PayloadAction<SDDEligibleType>) => {
      state.sddEligible = Remote.Success(action.payload)
    },
    fetchSDDVerified: () => {},
    fetchSDDVerifiedFailure: (state, action: PayloadAction<string>) => {
      state.sddVerified = Remote.Failure(action.payload)
    },
    fetchSDDVerifiedLoading: (state) => {
      state.sddVerified = Remote.Loading
    },
    fetchSDDVerifiedSuccess: (state, action: PayloadAction<SDDVerifiedType>) => {
      state.sddVerified = Remote.Success(action.payload)
    },
    fetchSellQuote: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        pair: BSPairsType
      }>
    ) => {},
    fetchSellQuoteFailure: (state, action: PayloadAction<string>) => {
      state.sellQuote = Remote.Failure(action.payload)
    },
    fetchSellQuoteLoading: (state) => {
      state.sellQuote = Remote.Loading
    },
    fetchSellQuoteSuccess: (state, action: PayloadAction<SwapQuoteStateType>) => {
      state.sellQuote = Remote.Success(action.payload)
    },
    handleBuyMaxAmountClick: (
      state,
      action: PayloadAction<{ amount: string; coin: 'FIAT' | CoinType }>
    ) => {},
    handleBuyMinAmountClick: (
      state,
      action: PayloadAction<{ amount: string; coin: 'FIAT' | CoinType }>
    ) => {},
    handleDepositFiatClick: (
      state,
      action: PayloadAction<{ coin: string; origin: ModalOriginType }>
    ) => {},
    handleMethodChange: (
      state,
      action: PayloadAction<{
        isFlow?: boolean
        method: BSPaymentMethodType
        mobilePaymentMethod?: MobilePaymentType
      }>
    ) => {},
    handleSellMaxAmountClick: (
      state,
      action: PayloadAction<{ amount: string; coin: 'FIAT' | CoinType }>
    ) => {},
    handleSellMinAmountClick: (
      state,
      action: PayloadAction<{ amount: string; coin: 'FIAT' | CoinType }>
    ) => {},
    initializeBillingAddress: () => {},
    initializeCheckout: (state, action: PayloadAction<InitializeCheckout>) => {
      state.pair =
        action.payload.pair ||
        action.payload.pairs.find(
          (pair) =>
            getCoinFromPair(pair.pair) === state.cryptoCurrency &&
            getFiatFromPair(pair.pair) === state.fiatCurrency
        )
    },
    pollBalances: () => {},
    pollCard: (state, action: PayloadAction<BSCardType['id']>) => {},
    pollOrder: (state, action: PayloadAction<string>) => {},
    registerCard: (
      state,
      action: PayloadAction<{ paymentMethodTokens: { [key: string]: string } }>
    ) => {},
    setAddCardError: (state, action: PayloadAction<undefined | BSAddCardErrorType>) => {
      state.addCardError = action.payload
    },
    setApplePayInfo: (state, action: PayloadAction<ApplePayInfoType>) => {
      state.applePayInfo = action.payload
    },
    setBuyCrypto: (state, action: PayloadAction<string>) => {},
    setFiatCurrency: (state, action: PayloadAction<FiatType>) => {
      state.fiatCurrency = action.payload
    },
    setFiatTradingCurrency: (state, action: PayloadAction<FiatType>) => {
      state.fiatCurrency = action.payload
    },
    setMethod: (state, action: PayloadAction<BSPaymentMethodType>) => {
      state.method = action.payload
    },
    setSellCrypto: (state, action: PayloadAction<string>) => {},
    setStep: (state, action: PayloadAction<StepActionsPayload>) => {
      const stepPayload = getPayloadObjectForStep(action.payload)
      switch (action.payload.step) {
        case 'ENTER_AMOUNT':
        case 'VERIFY_EMAIL':
          state.addBank = undefined
          state.cryptoCurrency = stepPayload.cryptoCurrency
          state.fiatCurrency = stepPayload.fiatCurrency
          state.method = stepPayload.method
          state.mobilePaymentMethod = stepPayload.mobilePaymentMethod
          state.order = undefined
          state.orderType = stepPayload.orderType
          state.pair = stepPayload.pair
          state.step = stepPayload.step
          state.swapAccount = stepPayload.swapAccount
          break
        case 'CRYPTO_SELECTION':
          state.addBank = undefined
          state.cryptoCurrency = stepPayload.cryptoCurrency
          state.fiatCurrency = stepPayload.fiatCurrency
          state.originalFiatCurrency = stepPayload.originalFiatCurrency
          state.orderType = stepPayload.orderType
          state.step = stepPayload.step
          state.swapAccount = undefined
          break
        case 'LINKED_PAYMENT_ACCOUNTS':
        case 'PAYMENT_METHODS':
          state.addBank = undefined
          state.cryptoCurrency = stepPayload.cryptoCurrency
          state.fiatCurrency = stepPayload.fiatCurrency
          state.order = stepPayload.order
          state.step = stepPayload.step
          break
        case '3DS_HANDLER_EVERYPAY':
        case '3DS_HANDLER_STRIPE':
        case '3DS_HANDLER_CHECKOUTDOTCOM':
        case 'CHECKOUT_CONFIRM':
        case 'OPEN_BANKING_CONNECT':
        case 'ORDER_SUMMARY':
          state.addBank = undefined
          state.order = stepPayload.order
          state.step = stepPayload.step
          break
        case 'BANK_WIRE_DETAILS':
          state.addBank = stepPayload.addBank
          state.displayBack = stepPayload.displayBack || false
          state.fiatCurrency = stepPayload.fiatCurrency
          state.step = stepPayload.step
          break
        case 'SELL_ORDER_SUMMARY':
          state.sellOrder = stepPayload.sellOrder
          state.step = stepPayload.step
          break
        case 'ADD_CARD_CHECKOUTDOTCOM':
          state.checkoutDotComAccountCodes = stepPayload.checkoutDotComAccountCodes
          state.checkoutDotComApiKey = stepPayload.checkoutDotComApiKey
          state.step = stepPayload.step
          break
        default:
          state.step = stepPayload.step
          break
      }
    },
    showModal: (
      state,
      action: PayloadAction<{
        cryptoCurrency?: CoinType
        orderType?: BSOrderActionType
        origin: BSShowModalOriginType
      }>
    ) => {
      state.origin = action.payload.origin
      state.cryptoCurrency = action.payload.cryptoCurrency
      state.orderType = action.payload.orderType
    },
    startPollBuyQuote: (
      state,
      action: PayloadAction<{
        amount: string
        pair: BSPairsType
        paymentMethod: BSPaymentTypes
        paymentMethodId?: BSCardType['id']
      }>
    ) => {},
    startPollSellQuote: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        pair: BSPairsType
      }>
    ) => {},
    stopPollBuyQuote: () => {},
    stopPollSellQuote: () => {},
    switchFix: (
      state,
      action: PayloadAction<{
        amount: string
        fix: BSFixType
        orderType: BSOrderActionType
      }>
    ) => {},
    updatePaymentFailure: (state, action: PayloadAction<string>) => {
      state.payment = Remote.Failure(action.payload)
    },
    updatePaymentLoading: (state) => {
      state.payment = Remote.Loading
    },
    updatePaymentSuccess: (state, action: PayloadAction<PaymentValue | undefined>) => {
      state.payment = Remote.Success(action.payload)
    },
    updateSddTransactionFinished: (state) => {
      state.sddTransactionFinished = true
    }
  }
})

const { actions } = buySellSlice
const buySellReducer = buySellSlice.reducer
export { actions, buySellReducer }
