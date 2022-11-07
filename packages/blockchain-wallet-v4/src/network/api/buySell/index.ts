import { v4 as uuidv4 } from 'uuid'

import {
  BankCredentialsType,
  BankTransferAccountType,
  RecurringBuyNextPayment,
  RecurringBuyPeriods,
  RecurringBuyRegisteredList,
  UserDataType
} from 'data/types'

import { CoinType, FiatCurrenciesType, FiatType, WalletCurrencyType } from '../../../types'
import { NabuCustodialProductType, ProductTypes, WithdrawResponseType } from '../custodial/types'
import { SwapOrderStateType, SwapOrderType, SwapUserLimitsType } from '../swap/types'
import {
  ApplePayInfoType,
  BSAccountType,
  BSBalancesType,
  BSCardType,
  BSMoneyType,
  BSOrderActionType,
  BSOrderType,
  BSPairsType,
  BSPairType,
  BSPaymentMethodsType,
  BSPaymentMethodType,
  BSPaymentTypes,
  BSProviderAttributesType,
  BSQuoteType,
  BSTransactionStateType,
  BSTransactionsType,
  BSTransactionType,
  BuyQuoteType,
  CardAcquirer,
  CardSuccessRateResponse,
  FiatEligibleType,
  GooglePayInfoType,
  NabuAddressType,
  TradesAccumulatedResponse,
  ValidateApplePayMerchantRequest,
  ValidateApplePayMerchantResponse
} from './types'

export default ({
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
  get,
  nabuUrl
}) => {
  const activateBSCard = ({
    cardBeneficiaryId,
    cvv,
    redirectUrl
  }: {
    cardBeneficiaryId: BSCardType['id']
    cvv: string
    redirectUrl: string
  }): BSCardType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        cvv,
        everypay: {
          customerUrl: redirectUrl
        },
        redirectURL: redirectUrl,
        useOnlyAlreadyValidatedCardRef: true
      },
      endPoint: `/payments/cards/${cardBeneficiaryId}/activate`,
      url: nabuUrl
    })

  const cancelBSOrder = (order: BSOrderType) =>
    authorizedDelete({
      endPoint: `/simple-buy/trades/${order.id}`,
      url: nabuUrl
    })

  const createCard = ({
    address,
    currency,
    email,
    paymentMethodTokens
  }: {
    address: NabuAddressType
    currency: FiatType
    email: UserDataType['email']
    paymentMethodTokens?: { [key: string]: string }
  }): BSCardType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        address,
        currency,
        email,
        paymentMethodTokens
      },
      endPoint: '/payments/cards',
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const createAddCardToken = (): {
    card_token_id: string
    vgs_public_key: string
    vgs_vault_id: string
  } =>
    authorizedPost({
      contentType: 'application/json',
      endPoint: '/payments/cassy/tokenize',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getCardAcquirers = (): CardAcquirer[] =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/payments/card-acquirers',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const createFiatDeposit = (
    amount: number,
    bankId: string,
    currency: FiatType,
    attributes: { callback: string | undefined }
  ) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        amount,
        attributes,
        currency,
        orderId: uuidv4(),
        product: 'SIMPLEBUY'
      },
      endPoint: `/payments/banktransfer/${bankId}/payment`,
      url: nabuUrl
    })

  const createBSOrder = (
    pair: BSPairsType,
    action: BSOrderActionType,
    pending: boolean,
    input: BSMoneyType,
    output: BSMoneyType,
    paymentType: BSPaymentMethodType['type'],
    period?: RecurringBuyPeriods,
    paymentMethodId?: BSCardType['id'],
    quoteId?: string
  ): BSOrderType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        action,
        input,
        output,
        pair,
        paymentMethodId,
        paymentType,
        period,
        quoteId
      },
      endPoint: `/simple-buy/trades${pending ? '?action=pending' : ''}`,
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const getBankTransferAccounts = () =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/payments/banktransfer`,
      url: nabuUrl
    })

  const getBankTransferAccountDetails = (bankId: string) =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/payments/banktransfer/${bankId}`,
      url: nabuUrl
    })

  const createBankAccountLink = (data: {
    attributes?: {
      supportedPartners: string[]
    }
    currency: WalletCurrencyType
  }) =>
    authorizedPost({
      contentType: 'application/json',
      data,
      endPoint: `/payments/banktransfer`,
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const updateBankAccountLink = (bankId: string, attributes) => {
    return authorizedPost({
      contentType: 'application/json',
      data: { attributes },
      endPoint: `/payments/banktransfer/${bankId}/update`,
      removeDefaultPostData: true,
      url: nabuUrl
    })
  }

  const refreshBankAccountLink = (bankId: string, attributes): BankCredentialsType =>
    authorizedPost({
      contentType: 'application/json',
      data: { attributes },
      endPoint: `/payments/banktransfer/${bankId}/refresh`,
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const confirmBSOrder = ({
    attributes,
    order,
    paymentMethodId
  }: {
    attributes?: BSProviderAttributesType
    order: BSOrderType
    paymentMethodId?: string
  }): BSOrderType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        action: 'confirm',
        attributes,
        paymentMethodId
      },
      endPoint: `/simple-buy/trades/${order.id}`,
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const getPaymentById = (pId: string): BSTransactionType =>
    authorizedGet({
      endPoint: `/payments/payment/${pId}`,
      url: nabuUrl
    })

  // TODO: move this BROKERAGE component
  const deleteSavedAccount = (
    accountId: BSCardType['id'] | BankTransferAccountType['id'],
    accountType: 'cards' | 'banktransfer'
  ): BSCardType | BankTransferAccountType =>
    authorizedDelete({
      endPoint: `/payments/${accountType}/${accountId}`,
      url: nabuUrl
    })

  const getBSBalances = (currency?: CoinType): BSBalancesType =>
    authorizedGet({
      data: {
        ccy: currency,
        includeAllEligible: false
      },
      endPoint: '/accounts/simplebuy',
      url: nabuUrl
    })

  const getBSCard = (cardId: BSCardType['id']): BSCardType =>
    authorizedGet({
      endPoint: `/payments/cards/${cardId}`,
      url: nabuUrl
    })

  const getBSCards = (useNewPaymentProviders: boolean): Array<BSCardType> =>
    authorizedGet({
      endPoint: `/payments/cards?cardProvider=${useNewPaymentProviders}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getBSFiatEligible = (currency: keyof FiatCurrenciesType): FiatEligibleType =>
    authorizedGet({
      data: {
        fiatCurrency: currency,
        methods: `${BSPaymentTypes.PAYMENT_CARD},${BSPaymentTypes.BANK_ACCOUNT},${BSPaymentTypes.BANK_TRANSFER}`
      },
      endPoint: '/simple-buy/eligible',
      url: nabuUrl
    })

  const getBSOrder = (orderId: string): BSOrderType =>
    authorizedGet({
      endPoint: `/simple-buy/trades/${orderId}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getBSOrders = ({
    after,
    before,
    pendingOnly = false
  }: {
    after?: string
    before?: string
    pendingOnly?: boolean
  }): Array<BSOrderType> =>
    authorizedGet({
      data: {
        after,
        before,
        pendingOnly
      },
      endPoint: '/simple-buy/trades',
      url: nabuUrl
    })

  const getBSPairs = (currency?: keyof FiatCurrenciesType): { pairs: Array<BSPairType> } =>
    authorizedGet({
      data: {
        fiatCurrency: currency
      },
      endPoint: '/simple-buy/pairs',
      url: nabuUrl
    })

  const getBSPaymentAccount = (currency: keyof FiatCurrenciesType): BSAccountType =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        currency
      },
      endPoint: '/payments/accounts/simplebuy',
      url: nabuUrl
    })

  const getBSPaymentMethods = (
    currency: FiatType | undefined,
    includeNonEligibleMethods?: boolean,
    includeTierLimits?: number
  ): BSPaymentMethodsType =>
    authorizedGet({
      contentType: 'application/json',
      data: {
        currency,
        eligibleOnly: includeNonEligibleMethods,
        tier: includeTierLimits
      },
      endPoint: '/eligible/payment-methods',
      url: nabuUrl
    })

  const getRBRegisteredList = (): RecurringBuyRegisteredList[] =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/recurring-buy/list',
      url: nabuUrl
    })

  const getRBPaymentInfo = (): { nextPayments: RecurringBuyNextPayment[] } =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/recurring-buy/next-payment',
      url: nabuUrl
    })

  const createRecurringBuy = (data): RecurringBuyRegisteredList =>
    authorizedPost({
      contentType: 'application/json',
      data,
      endPoint: '/recurring-buy/create',
      url: nabuUrl
    })

  const deleteRecurringBuy = (id): RecurringBuyRegisteredList =>
    authorizedDelete({
      contentType: 'application/json',
      endPoint: `/recurring-buy/${id}/cancel`,
      url: nabuUrl
    })

  const getBSQuote = (
    currencyPair: BSPairsType,
    action: BSOrderActionType,
    amount: string
  ): BSQuoteType =>
    authorizedGet({
      data: {
        action,
        amount,
        currencyPair
      },
      endPoint: '/simple-buy/quote',
      url: nabuUrl
    })

  const getBuyQuote = (
    pair: string,
    profile: 'SIMPLEBUY' | 'SIMPLETRADE' | 'SWAP_FROM_USERKEY' | 'SWAP_INTERNAL' | 'SWAP_ON_CHAIN',
    inputValue: string,
    paymentMethod: BSPaymentTypes,
    paymentMethodId?: string
  ): BuyQuoteType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        inputValue,
        pair,
        paymentMethod,
        paymentMethodId,
        profile
      },
      endPoint: '/brokerage/quote',
      url: nabuUrl
    })

  type getBSTransactionsType = {
    currency: string
    fromId?: string
    fromValue?: string
    limit?: number
    next?: string | null
    state?: BSTransactionStateType
    type?: 'DEPOSIT' | 'WITHDRAWAL'
  }

  const getBSTransactions = ({
    currency,
    fromId,
    fromValue,
    limit,
    next,
    state,
    type
  }: getBSTransactionsType): BSTransactionsType =>
    next
      ? authorizedGet({
          endPoint: next,
          ignoreQueryParams: true,
          url: nabuUrl
        })
      : authorizedGet({
          data: {
            currency,
            fromId,
            fromValue,
            limit,
            pending: true,
            product: 'SIMPLEBUY',
            state,
            type
          },
          endPoint: '/payments/transactions',
          url: nabuUrl
        })
  // This is to get unified Sell trades from sellp3 using the swap 2.0 api
  // Will eventually be used to get all trades, buy/sell/swap included
  // keeping all the swap types until buy/sell everything else is together
  const getUnifiedSellTrades = (
    currency: FiatType,
    limit?: number,
    before?: string,
    after?: string,
    v2states?: SwapOrderStateType
  ): Array<SwapOrderType> =>
    authorizedGet({
      data: {
        after,
        before,
        currency,
        limit,
        states: v2states
      },
      endPoint: `/trades/unified`,
      url: nabuUrl
    })

  const withdrawBSFunds = (
    address: string,
    currency: string,
    amount: string,
    fee?: number
  ): WithdrawResponseType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        address,
        amount,
        currency,
        fee: fee?.toString(),
        product: ProductTypes.SIMPLEBUY
      },
      endPoint: '/payments/withdrawals',
      headers: {
        'blockchain-origin': 'simplebuy'
      },
      url: nabuUrl
    })

  const getBSLimits = (
    currency: FiatType,
    product: NabuCustodialProductType,
    networkFee: CoinType,
    side: BSOrderActionType
  ): SwapUserLimitsType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/trades/limits?currency=${currency}&product=${product}&networkFee=${networkFee}&side=${side}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getAccumulatedTrades = (product: NabuCustodialProductType): TradesAccumulatedResponse =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/trades/accumulated?product=${product}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getApplePayInfo = (currency: FiatType): ApplePayInfoType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/payments/apple-pay/info?currency=${currency}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const validateApplePayMerchant = ({
    beneficiaryID,
    domain,
    validationURL
  }: ValidateApplePayMerchantRequest): ValidateApplePayMerchantResponse =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        beneficiaryID,
        domain,
        validationURL
      },
      endPoint: '/payments/apple-pay/validate-merchant',
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getGooglePayInfo = (currency: FiatType): GooglePayInfoType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/payments/google-pay/info?currency=${currency}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const checkCardSuccessRate = (bin: string): CardSuccessRateResponse =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/payments/cards/success-rate?bin=${bin}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  return {
    activateBSCard,
    cancelBSOrder,
    checkCardSuccessRate,
    confirmBSOrder,
    createAddCardToken,
    createBSOrder,
    createBankAccountLink,
    createCard,
    createFiatDeposit,
    createRecurringBuy,
    deleteRecurringBuy,
    deleteSavedAccount,
    getAccumulatedTrades,
    getApplePayInfo,
    getBSBalances,
    getBSCard,
    getBSCards,
    getBSFiatEligible,
    getBSLimits,
    getBSOrder,
    getBSOrders,
    getBSPairs,
    getBSPaymentAccount,
    getBSPaymentMethods,
    getBSQuote,
    getBSTransactions,
    getBankTransferAccountDetails,
    getBankTransferAccounts,
    getBuyQuote,
    getCardAcquirers,
    getGooglePayInfo,
    getPaymentById,
    getRBPaymentInfo,
    getRBRegisteredList,
    getUnifiedSellTrades,
    refreshBankAccountLink,
    updateBankAccountLink,
    validateApplePayMerchant,
    withdrawBSFunds
  }
}
