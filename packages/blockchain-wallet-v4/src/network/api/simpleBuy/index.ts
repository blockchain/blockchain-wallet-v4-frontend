/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios'
import { Moment } from 'moment'
import { v4 as uuidv4 } from 'uuid'

import {
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
  FiatEligibleType,
  NabuAddressType,
  SBAccountType,
  SBBalancesType,
  SBCardType,
  SBMoneyType,
  SBOrderActionType,
  SBOrderType,
  SBPairsType,
  SBPairType,
  SBPaymentMethodsType,
  SBPaymentMethodType,
  SBPaymentTypes,
  SBProviderAttributesType,
  SBQuoteType,
  SBTransactionStateType,
  SBTransactionsType,
  SBTransactionType
} from './types'

export default ({
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
  everypayUrl,
  get,
  nabuUrl
}) => {
  const activateSBCard = (cardId: SBCardType['id'], customerUrl: string): SBCardType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        everypay: {
          customerUrl
        }
      },
      endPoint: `/payments/cards/${cardId}/activate`,
      url: nabuUrl
    })

  const cancelSBOrder = (order: SBOrderType) =>
    authorizedDelete({
      endPoint: `/simple-buy/trades/${order.id}`,
      url: nabuUrl
    })

  const createSBCard = (
    currency: FiatType,
    address: NabuAddressType,
    email: UserDataType['email']
  ): SBCardType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        address,
        currency,
        email
      },
      endPoint: '/payments/cards',
      removeDefaultPostData: true,
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

  const createSBOrder = (
    pair: SBPairsType,
    action: SBOrderActionType,
    pending: boolean,
    input: SBMoneyType,
    output: SBMoneyType,
    paymentType: SBPaymentMethodType['type'],
    period?: RecurringBuyPeriods,
    paymentMethodId?: SBCardType['id']
  ): SBOrderType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        action,
        input,
        output,
        pair,
        paymentMethodId,
        paymentType,
        period
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

  const createBankAccountLink = (currency: WalletCurrencyType) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        currency
      },
      endPoint: `/payments/banktransfer`,
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const updateBankAccountLink = (bankId: string, attributes) =>
    authorizedPost({
      contentType: 'application/json',
      data: { attributes },
      endPoint: `/payments/banktransfer/${bankId}/update`,
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const confirmSBOrder = (
    order: SBOrderType,
    attributes?: SBProviderAttributesType,
    paymentMethodId?: string
  ): SBOrderType =>
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

  const getPaymentById = (pId: string): SBTransactionType =>
    authorizedGet({
      endPoint: `/payments/payment/${pId}`,
      url: nabuUrl
    })

  // TODO: move this BROKERAGE component
  const deleteSavedAccount = (
    accountId: SBCardType['id'] | BankTransferAccountType['id'],
    accountType: 'cards' | 'banktransfer'
  ): SBCardType | BankTransferAccountType =>
    authorizedDelete({
      endPoint: `/payments/${accountType}/${accountId}`,
      url: nabuUrl
    })

  const getSBBalances = (currency?: CoinType): SBBalancesType =>
    authorizedGet({
      data: {
        ccy: currency,
        includeAllEligible: false
      },
      endPoint: '/accounts/simplebuy',
      url: nabuUrl
    })

  const getSBCard = (cardId: SBCardType['id']): SBCardType =>
    authorizedGet({
      endPoint: `/payments/cards/${cardId}`,
      url: nabuUrl
    })

  const getSBCards = (): Array<SBCardType> =>
    authorizedGet({
      endPoint: '/payments/cards',
      url: nabuUrl
    })

  const getSBFiatEligible = (currency: keyof FiatCurrenciesType): FiatEligibleType =>
    authorizedGet({
      data: {
        fiatCurrency: currency,
        methods: `${SBPaymentTypes.PAYMENT_CARD},${SBPaymentTypes.BANK_ACCOUNT},${SBPaymentTypes.BANK_TRANSFER}`
      },
      endPoint: '/simple-buy/eligible',
      url: nabuUrl
    })

  const getSBOrder = (orderId: string): SBOrderType =>
    authorizedGet({
      endPoint: `/simple-buy/trades/${orderId}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getSBOrders = ({
    after,
    before,
    pendingOnly = false
  }: {
    after?: string
    before?: string
    pendingOnly?: boolean
  }): Array<SBOrderType> =>
    authorizedGet({
      data: {
        after,
        before,
        pendingOnly
      },
      endPoint: '/simple-buy/trades',
      url: nabuUrl
    })

  const getSBPairs = (currency: keyof FiatCurrenciesType): { pairs: Array<SBPairType> } =>
    get({
      data: {
        fiatCurrency: currency
      },
      endPoint: '/simple-buy/pairs',
      url: nabuUrl
    })

  const getSBPaymentAccount = (currency: keyof FiatCurrenciesType): SBAccountType =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        currency
      },
      endPoint: '/payments/accounts/simplebuy',
      url: nabuUrl
    })

  const getSBPaymentMethods = (
    currency: FiatType | undefined,
    includeNonEligibleMethods?: boolean,
    includeTierLimits?: number
  ): SBPaymentMethodsType =>
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

  const getSBQuote = (
    currencyPair: SBPairsType,
    action: SBOrderActionType,
    amount: string
  ): SBQuoteType =>
    authorizedGet({
      data: {
        action,
        amount,
        currencyPair
      },
      endPoint: '/simple-buy/quote',
      url: nabuUrl
    })

  type getSBTransactionsType = {
    currency: string
    fromId?: string
    fromValue?: string
    limit?: number
    next?: string | null
    state?: SBTransactionStateType
    type?: 'DEPOSIT' | 'WITHDRAWAL'
  }

  const getSBTransactions = ({
    currency,
    fromId,
    fromValue,
    limit,
    next,
    state,
    type
  }: getSBTransactionsType): SBTransactionsType =>
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

  const submitSBCardDetailsToEverypay = ({
    accessToken,
    apiUserName,
    ccNumber,
    cvc,
    expirationDate,
    holderName,
    nonce
  }: {
    accessToken: string
    apiUserName: string
    ccNumber: string
    cvc: string
    expirationDate: Moment
    holderName: string
    nonce: string
  }) =>
    axios({
      data: {
        api_username: apiUserName,
        cc_details: {
          cc_number: ccNumber,

          cvc,

          holder_name: holderName,
          // months are 0 indexed
          month: expirationDate.month() + 1,
          year: expirationDate.year()
        },
        nonce: nonce.slice(0, 8),
        timestamp: new Date().toISOString(),
        token_consented: true
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      url: `${everypayUrl}/api/v3/mobile_payments/card_details`
    })

  const withdrawSBFunds = (
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

  const getSBLimits = (
    currency: FiatType,
    product: NabuCustodialProductType,
    networkFee: CoinType,
    side: SBOrderActionType
  ): SwapUserLimitsType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/trades/limits?currency=${currency}&product=${product}&networkFee=${networkFee}&side=${side}`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  return {
    activateSBCard,
    cancelSBOrder,
    confirmSBOrder,
    createBankAccountLink,
    createFiatDeposit,
    createRecurringBuy,
    createSBCard,
    createSBOrder,
    deleteRecurringBuy,
    deleteSavedAccount,
    getBankTransferAccountDetails,
    getBankTransferAccounts,
    getPaymentById,
    getRBPaymentInfo,
    getRBRegisteredList,
    getSBBalances,
    getSBCard,
    getSBCards,
    getSBFiatEligible,
    getSBLimits,
    getSBOrder,
    getSBOrders,
    getSBPairs,
    getSBPaymentAccount,
    getSBPaymentMethods,
    getSBQuote,
    getSBTransactions,
    getUnifiedSellTrades,
    submitSBCardDetailsToEverypay,
    updateBankAccountLink,
    withdrawSBFunds
  }
}
