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
  CoinType,
  CrossBorderLimits,
  CrossBorderLimitsPayload,
  FiatEligibleType,
  FiatType,
  GooglePayInfoType,
  MobilePaymentType,
  PaymentValue,
  ProductTypes,
  ProviderDetailsType,
  SwapUserLimitsType,
  TradeAccumulatedItem
} from '@core/types'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import {
  BankDWStepType,
  BankTransferAccountType,
  BSCardStateEnum,
  BSFixType,
  BSShowModalOriginType,
  BuyQuoteStateType,
  InitializeCheckout,
  ModalOriginType,
  SellQuoteStateType,
  StepActionsPayload,
  SwapAccountType
} from 'data/types'
import { NabuError } from 'services/errors'

import { getCoinFromPair, getFiatFromPair } from './model'
import { BSCardSuccessRateType, BuySellState, PollOrder, SellQuotePrice } from './types'

const initialState: BuySellState = {
  account: Remote.NotAsked,
  accumulatedTrades: Remote.NotAsked,
  addBank: undefined,
  applePayInfo: undefined,
  balances: Remote.NotAsked,
  buyQuote: Remote.NotAsked,
  card: Remote.NotAsked,
  cardId: undefined,
  cardSuccessRate: undefined,
  cardTokenId: undefined,
  cards: Remote.NotAsked,
  checkoutDotComAccountCodes: [],
  checkoutDotComApiKey: undefined,
  crossBorderLimits: Remote.NotAsked,
  cryptoCurrency: undefined,
  cvvStatus: Remote.NotAsked,
  displayBack: false,
  fiatCurrency: undefined,
  fiatEligible: Remote.NotAsked,
  googlePayInfo: undefined,
  limits: Remote.NotAsked,
  method: undefined, // TODO: Deprecate this in favor of brokerage `account` instead
  methods: Remote.NotAsked,
  mobilePaymentMethod: undefined,
  order: Remote.NotAsked,
  orderType: undefined,
  orders: Remote.NotAsked,
  origin: undefined,
  originalFiatCurrency: undefined,
  pair: undefined,
  pairs: Remote.NotAsked,
  payment: Remote.NotAsked,
  providerDetails: Remote.NotAsked,
  quote: Remote.NotAsked,
  reason: undefined,

  sellOrder: undefined,
  sellQuote: Remote.NotAsked,
  sellQuotePrice: Remote.NotAsked,
  step: 'CRYPTO_SELECTION',
  swapAccount: undefined,
  vgsVaultId: undefined
}

const buySellSlice = createSlice({
  initialState,
  name: 'buySell',
  reducers: {
    activateCard: (state, action: PayloadAction<{ card: BSCardType; cvv: string }>) => {},
    activateCardFailure: (state, action: PayloadAction<string | Error>) => {
      state.providerDetails = Remote.Failure(action.payload)
    },
    activateCardLoading: (state) => {
      state.providerDetails = Remote.Loading
    },
    activateCardSuccess: (state, action: PayloadAction<ProviderDetailsType>) => {
      state.providerDetails = Remote.Success(action.payload)
    },
    cachePendingOrder: (state, action: PayloadAction<BSOrderType>) => {
      state.pendingOrder = action.payload
    },
    cancelOrder: (state, action: PayloadAction<BSOrderType>) => {
      state.pendingOrder = undefined
    },
    checkCardSuccessRate: (state, action: PayloadAction<{ bin: string; scheme?: string }>) => {},
    confirmFundsOrder: (
      state,
      action: PayloadAction<{
        quoteState: BuyQuoteStateType
      }>
    ) => {},
    confirmOrder: (
      state,
      action: PayloadAction<{
        mobilePaymentMethod?: MobilePaymentType
        paymentMethodId: BSCardType['id']
        quoteState: BuyQuoteStateType
      }>
    ) => {},
    confirmOrderFailure: (state, action: PayloadAction<string | number | Error>) => {
      state.order = Remote.Failure(action.payload)
    },
    confirmOrderLoading: (state) => {
      state.order = Remote.Loading
    },
    confirmOrderPoll: (state, action: PayloadAction<BSOrderType>) => {},
    confirmOrderSuccess: (state, action: PayloadAction<BSOrderType>) => {
      state.order = Remote.Success(action.payload)
      state.pendingOrder = undefined
    },
    createCard: (state, action: PayloadAction<{ [key: string]: string }>) => {},
    createCardFailure: (state, action: PayloadAction<string | number | Error>) => {
      state.card = Remote.Failure(action.payload)
    },
    createCardLoading: (state) => {
      state.card = Remote.Loading
    },
    createCardNotAsked: (state, action: PayloadAction<void>) => {
      state.card = Remote.NotAsked
    },
    createCardSuccess: (state, action: PayloadAction<BSCardType>) => {
      state.card = Remote.Success(action.payload)
    },
    createOrderFailure: (state, action: PayloadAction<string | number | Error>) => {
      state.order = Remote.Failure(action.payload)
    },
    createOrderLoading: (state) => {
      state.order = Remote.Loading
    },
    createSellOrder: () => {},
    cvvStatusFailure: (state, action: PayloadAction<string | NabuError>) => {
      state.cvvStatus = Remote.Failure(action.payload)
    },
    cvvStatusLoading: (state) => {
      state.cvvStatus = Remote.Loading
    },
    cvvStatusReset: (state) => {
      state.cvvStatus = Remote.NotAsked
    },
    cvvStatusSuccess: (state) => {
      state.cvvStatus = Remote.Success(true)
    },
    defaultMethodEvent: (state, action: PayloadAction<BSPaymentMethodType>) => {},
    deleteCard: (state, action: PayloadAction<BSCardType['id']>) => {},
    destroyCheckout: (state) => {
      state.account = Remote.NotAsked
      state.providerDetails = Remote.NotAsked
      state.cardId = undefined
      state.order = Remote.NotAsked
      state.pendingOrder = undefined
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
    fetchBalanceFailure: (state, action: PayloadAction<PartialClientErrorProperties>) => {
      state.balances = Remote.Failure(action.payload)
    },
    fetchBalanceLoading: (state) => {
      state.balances = Remote.Loading
    },
    fetchBalanceSuccess: (state, action: PayloadAction<BSBalancesType>) => {
      state.balances = Remote.Success(action.payload)
    },
    fetchBuyQuoteFailure: (state, action: PayloadAction<string | Error>) => {
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
    fetchCardsFailure: (state, action: PayloadAction<PartialClientErrorProperties>) => {
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
    fetchFiatEligibleFailure: (
      state,
      action: PayloadAction<PartialClientErrorProperties | Error>
    ) => {
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
    fetchOrdersFailure: (state, action: PayloadAction<PartialClientErrorProperties>) => {
      state.orders = Remote.Failure(action.payload)
    },
    fetchOrdersLoading: (state) => {
      state.orders = Remote.Loading
    },
    fetchOrdersSuccess: (state, action: PayloadAction<BSOrderType[]>) => {
      state.orders = Remote.Success(action.payload)
    },
    fetchPairs: (state, action: PayloadAction<{ coin?: CoinType; currency?: FiatType }>) => {},
    fetchPairsFailure: (state, action: PayloadAction<PartialClientErrorProperties>) => {
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
    fetchPaymentAccountFailure: (state, action: PayloadAction<string | Error>) => {
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
    fetchSellQuote: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        amount: string
        pair: BSPairsType
      }>
    ) => {},
    fetchSellQuoteFailure: (state, action: PayloadAction<string>) => {
      state.sellQuote = Remote.Failure(action.payload)
    },
    fetchSellQuotePrice: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        amount: string
        pair: BSPairsType
      }>
    ) => {},
    fetchSellQuotePriceFailure: (state, action: PayloadAction<string | Error>) => {
      state.sellQuotePrice = Remote.Success.is(state.sellQuotePrice)
        ? Remote.Success({
            ...state.sellQuotePrice.data,
            isFailed: true
          })
        : Remote.Failure(action.payload)
    },
    fetchSellQuotePriceLoading: (state) => {
      state.sellQuotePrice = Remote.Success.is(state.sellQuotePrice)
        ? Remote.Success({
            ...state.sellQuotePrice.data,
            isRefreshing: true
          })
        : Remote.Loading
    },
    fetchSellQuotePriceSuccess: (
      state,
      action: PayloadAction<{
        data: SellQuotePrice['data']
        isPlaceholder: boolean
        rate: number
      }>
    ) => {
      state.sellQuotePrice = Remote.Success({
        data: action.payload.data,
        isFailed: false,
        isPlaceholder: action.payload.isPlaceholder,
        isRefreshing: false,
        rate: action.payload.rate
      })
    },
    fetchSellQuoteSuccess: (state, action: PayloadAction<SellQuoteStateType>) => {
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
    pollOrder: (state, action: PayloadAction<PollOrder>) => {},
    proceedToBuyConfirmation: (
      state,
      action: PayloadAction<{
        mobilePaymentMethod?: MobilePaymentType
        paymentMethodId?: BSCardType['id'] | BankTransferAccountType['id']
        paymentType: Exclude<
          BSPaymentMethodType['type'],
          BSPaymentTypes.USER_CARD | BSPaymentTypes.BANK_ACCOUNT
        >
      }>
    ) => {},
    proceedToSellConfirmation: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
      }>
    ) => {},
    proceedToSellEnterAmount: (
      state,
      action: PayloadAction<{ account: SwapAccountType; pair: BSPairType }>
    ) => {},
    registerCard: (
      state,
      action: PayloadAction<{ cvv: string; paymentMethodTokens: { [key: string]: string } }>
    ) => {},
    returnToBuyEnterAmount: (state, action: PayloadAction<{ pair: BSPairType }>) => {},
    returnToCryptoSelection: () => {},
    returnToSellEnterAmount: (state, action: PayloadAction<{ pair: BSPairType }>) => {},
    setApplePayInfo: (state, action: PayloadAction<ApplePayInfoType>) => {
      state.applePayInfo = action.payload
    },
    setBuyCrypto: (state, action: PayloadAction<string>) => {},
    setCardSuccessRate: (state, action: PayloadAction<BSCardSuccessRateType>) => {
      state.cardSuccessRate = action.payload
    },
    setFiatCurrency: (state, action: PayloadAction<FiatType>) => {
      state.fiatCurrency = action.payload
    },
    setGooglePayInfo: (state, action: PayloadAction<GooglePayInfoType>) => {
      state.googlePayInfo = action.payload
    },
    setMethod: (state, action: PayloadAction<BSPaymentMethodType | undefined>) => {
      state.method = action.payload
    },
    setSellCrypto: (state, action: PayloadAction<string>) => {},
    setStep: (state, action: PayloadAction<StepActionsPayload>) => {
      switch (action.payload.step) {
        case BankDWStepType.PAYMENT_ACCOUNT_ERROR:
          state.reason = action.payload.reason
          state.step = action.payload.step
          break
        case 'ENTER_AMOUNT':
        case 'SELL_ENTER_AMOUNT':
        case 'VERIFY_EMAIL':
          state.addBank = undefined
          state.cryptoCurrency = action.payload.cryptoCurrency
          state.fiatCurrency = action.payload.fiatCurrency
          state.method = action.payload.method
          state.mobilePaymentMethod = action.payload.mobilePaymentMethod
          state.order = action.payload.step === 'ENTER_AMOUNT' ? Remote.NotAsked : state.order
          state.orderType = action.payload.orderType || 'BUY'
          state.pair = action.payload.pair
          state.step = action.payload.step
          state.swapAccount = action.payload.swapAccount
          break
        case 'CRYPTO_SELECTION':
          state.addBank = undefined
          state.cryptoCurrency = action.payload.cryptoCurrency
          state.fiatCurrency = action.payload.fiatCurrency
          state.originalFiatCurrency = action.payload.originalFiatCurrency
          state.orderType = action.payload.orderType
          state.order = Remote.NotAsked
          state.step = action.payload.step
          state.swapAccount = undefined
          break
        case 'LINKED_PAYMENT_ACCOUNTS':
        case 'PAYMENT_METHODS':
          state.addBank = undefined
          state.cryptoCurrency = action.payload.cryptoCurrency
          state.fiatCurrency = action.payload.fiatCurrency
          state.step = action.payload.step
          break
        case 'CHECKOUT_CONFIRM':
          state.addBank = undefined
          state.order = Remote.NotAsked
          state.step = action.payload.step
          break
        case '3DS_HANDLER_EVERYPAY':
        case '3DS_HANDLER_STRIPE':
        case '3DS_HANDLER_CHECKOUTDOTCOM':
        case '3DS_HANDLER_FAKE_CARD_ACQUIRER':
        case 'OPEN_BANKING_CONNECT':
        case 'ORDER_SUMMARY':
          state.addBank = undefined
          state.step = action.payload.step
          break
        case 'BANK_WIRE_DETAILS':
          state.addBank = action.payload.addBank
          state.displayBack = action.payload.displayBack || false
          state.fiatCurrency = action.payload.fiatCurrency
          state.step = action.payload.step
          break
        case 'SELL_ORDER_SUMMARY':
          state.sellOrder = action.payload.sellOrder
          state.step = action.payload.step
          break
        case 'ADD_CARD_CHECKOUTDOTCOM':
          state.checkoutDotComAccountCodes = action.payload.checkoutDotComAccountCodes
          state.checkoutDotComApiKey = action.payload.checkoutDotComApiKey
          state.step = action.payload.step
          break
        case 'ADD_CARD_VGS':
          state.step = action.payload.step
          state.vgsVaultId = action.payload.vgsVaultId
          state.cardTokenId = action.payload.cardTokenId
          break
        default:
          state.step = action.payload.step
          break
      }
    },
    showModal: (
      state: BuySellState,
      action: PayloadAction<{
        cryptoCurrency?: CoinType
        method?: BSPaymentMethodType
        mobilePaymentMethod?: MobilePaymentType
        orderType?: BSOrderActionType
        origin: BSShowModalOriginType
        step?: 'DETERMINE_CARD_PROVIDER'
      }>
    ) => {
      state.origin = action.payload.origin
      state.cryptoCurrency = action.payload.cryptoCurrency
      state.orderType = action.payload.orderType
      state.mobilePaymentMethod = action.payload.mobilePaymentMethod
      state.method = action.payload.method
    },
    startPollBuyQuote: (
      state,
      action: PayloadAction<{
        amount: string
        pairObject: BSPairType
        paymentMethod: Exclude<
          BSPaymentMethodType['type'],
          BSPaymentTypes.USER_CARD | BSPaymentTypes.BANK_ACCOUNT
        >
        paymentMethodId?: BSCardType['id']
      }>
    ) => {},
    startPollSellQuote: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        amount: string
        pair: BSPairsType
      }>
    ) => {},
    startPollSellQuotePrice: (
      state,
      action: PayloadAction<{
        account: SwapAccountType
        amount: string
        pair: BSPairsType
      }>
    ) => {},
    stopPollBuyQuote: () => {},
    stopPollSellQuote: () => {},
    stopPollSellQuotePrice: (state, action: PayloadAction<{ shouldNotResetState?: boolean }>) => {
      if (!action.payload.shouldNotResetState) {
        state.sellQuotePrice = Remote.NotAsked
      }
    },
    switchFix: (
      state,
      action: PayloadAction<{
        amount: string
        fix: BSFixType
        orderType: BSOrderActionType
      }>
    ) => {},
    updateCardCvv: (state, action: PayloadAction<{ cvv: string; paymentId: string }>) => {},
    updateCardCvvAndPollOrder: (
      state,
      action: PayloadAction<{ cvv: string; paymentId: string }>
    ) => {},
    updatePaymentFailure: (state, action: PayloadAction<string>) => {
      state.payment = Remote.Failure(action.payload)
    },
    updatePaymentLoading: (state) => {
      state.payment = Remote.Loading
    },
    updatePaymentSuccess: (state, action: PayloadAction<PaymentValue | undefined>) => {
      state.payment = Remote.Success(action.payload)
    }
  }
})

const { actions } = buySellSlice
const buySellReducer = buySellSlice.reducer
export { actions, buySellReducer }
