import axios from 'axios'
import { Moment } from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { UserDataType } from 'data/types'

import {
  CoinType,
  CurrenciesType,
  FiatType,
  WalletCurrencyType
} from '../../../types'
import { SwapOrderStateType, SwapOrderType } from '../swap/types'
import {
  BankTransferAccountType,
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
  SBProviderAttributesType,
  SBQuoteType,
  SBTransactionStateType,
  SBTransactionsType
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
  const activateSBCard = (
    cardId: SBCardType['id'],
    customerUrl: string
  ): SBCardType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/payments/cards/${cardId}/activate`,
      contentType: 'application/json',
      data: {
        everypay: {
          customerUrl
        }
      }
    })

  const cancelSBOrder = (order: SBOrderType) =>
    authorizedDelete({
      url: nabuUrl,
      endPoint: `/simple-buy/trades/${order.id}`
    })

  const createSBCard = (
    currency: FiatType,
    address: NabuAddressType,
    email: UserDataType['email']
  ): SBCardType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/payments/cards',
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: {
        currency,
        address,
        email
      }
    })

  const createFiatDeposit = (
    amount: number,
    bankId: string,
    currency: FiatType,
    product: 'SIMPLEBUY' = 'SIMPLEBUY'
  ) =>
    authorizedPost({
      url: nabuUrl,
      contentType: 'application/json',
      endPoint: `/payments/banktransfer/${bankId}/payment`,
      data: { amount, currency, product, orderId: uuidv4() }
    })

  const createSBOrder = (
    pair: SBPairsType,
    action: SBOrderActionType,
    pending: boolean,
    input: SBMoneyType,
    output: SBMoneyType,
    paymentType: SBPaymentMethodType['type'],
    paymentMethodId?: SBCardType['id']
  ): SBOrderType =>
    authorizedPost({
      url: nabuUrl,
      removeDefaultPostData: true,
      endPoint: `/simple-buy/trades${pending ? '?action=pending' : ''}`,
      contentType: 'application/json',
      data: {
        pair,
        action,
        input,
        output,
        paymentMethodId,
        paymentType
      }
    })

  const getBankTransferAccounts = () =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/payments/banktransfer`,
      contentType: 'application/json'
    })

  const getBankTransferAccountDetails = (bankId: string) =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/payments/banktransfer/${bankId}`,
      contentType: 'application/json'
    })

  const createBankAccountLink = (currency: WalletCurrencyType) =>
    authorizedPost({
      url: nabuUrl,
      removeDefaultPostData: true,
      endPoint: `/payments/banktransfer`,
      contentType: 'application/json',
      data: {
        currency
      }
    })

  const updateBankAccountLink = (
    providerAccountId: number,
    bankId: string,
    accountId: string
  ) =>
    authorizedPost({
      url: nabuUrl,
      removeDefaultPostData: true,
      endPoint: `/payments/banktransfer/${bankId}/update`,
      contentType: 'application/json',
      data: {
        attributes: {
          providerAccountId: `${providerAccountId}`,
          accountId: `${accountId}`
        }
      }
    })

  const confirmSBOrder = (
    order: SBOrderType,
    attributes?: SBProviderAttributesType,
    paymentMethodId?: string
  ): SBOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/simple-buy/trades/${order.id}`,
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: {
        action: 'confirm',
        attributes,
        paymentMethodId
      }
    })

  // TODO: move this BROKERAGE component
  const deleteSavedAccount = (
    accountId: SBCardType['id'] | BankTransferAccountType['id'],
    accountType: 'cards' | 'banktransfer'
  ): SBCardType | BankTransferAccountType =>
    authorizedDelete({
      url: nabuUrl,
      endPoint: `/payments/${accountType}/${accountId}`
    })

  const getSBBalances = (currency?: CoinType): SBBalancesType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/accounts/simplebuy',
      data: {
        ccy: currency,
        includeAllEligible: false
      }
    })

  const getSBCard = (cardId: SBCardType['id']): SBCardType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/payments/cards/${cardId}`
    })

  const getSBCards = (): Array<SBCardType> =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/cards'
    })

  const getSBFiatEligible = (
    currency: keyof CurrenciesType
  ): FiatEligibleType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/simple-buy/eligible',
      data: {
        fiatCurrency: currency,
        methods: 'PAYMENT_CARD,BANK_ACCOUNT,BANK_TRANSFER'
      }
    })

  const getSBOrder = (orderId: string): SBOrderType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/simple-buy/trades/${orderId}`,
      ignoreQueryParams: true
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
      url: nabuUrl,
      endPoint: '/simple-buy/trades',
      data: {
        after,
        before,
        pendingOnly
      }
    })

  const getSBPairs = (
    currency: keyof CurrenciesType
  ): { pairs: Array<SBPairType> } =>
    get({
      url: nabuUrl,
      endPoint: '/simple-buy/pairs',
      data: {
        fiatCurrency: currency
      }
    })

  const getSBPaymentAccount = (currency: keyof CurrenciesType): SBAccountType =>
    authorizedPut({
      url: nabuUrl,
      endPoint: '/payments/accounts/simplebuy',
      contentType: 'application/json',
      data: {
        currency
      }
    })

  const getSBPaymentMethods = (
    currency: FiatType,
    includeNonEligibleMethods?: boolean,
    includeTierLimits?: number
  ): SBPaymentMethodsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/eligible/payment-methods',
      contentType: 'application/json',
      data: {
        currency,
        eligibleOnly: includeNonEligibleMethods,
        tier: includeTierLimits
      }
    })

  const getSBQuote = (
    currencyPair: SBPairsType,
    action: SBOrderActionType,
    amount: string
  ): SBQuoteType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/simple-buy/quote',
      data: {
        currencyPair,
        action,
        amount
      }
    })

  type getSBTransactionsType = {
    currency: WalletCurrencyType
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
          url: nabuUrl,
          endPoint: next,
          ignoreQueryParams: true
        })
      : authorizedGet({
          url: nabuUrl,
          endPoint: '/payments/transactions',
          data: {
            currency,
            limit,
            fromId,
            fromValue,
            pending: true,
            product: 'SIMPLEBUY',
            state,
            type
          }
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
      url: nabuUrl,
      endPoint: `/trades/unified`,
      data: {
        currency,
        limit,
        before,
        after,
        states: v2states
      }
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
      url: `${everypayUrl}/api/v3/mobile_payments/card_details`,
      method: 'POST',
      data: {
        api_username: apiUserName,
        cc_details: {
          cc_number: ccNumber,
          // months are 0 indexed
          month: expirationDate.month() + 1,
          year: expirationDate.year(),
          cvc: cvc,
          holder_name: holderName
        },
        nonce: nonce.slice(0, 8),
        token_consented: true,
        timestamp: new Date().toISOString()
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

  const withdrawSBFunds = (
    address: string,
    currency: keyof CurrenciesType,
    amount: string
  ) =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/payments/withdrawals',
      contentType: 'application/json',
      headers: {
        'blockchain-origin': 'simplebuy'
      },
      data: {
        address,
        currency,
        amount
      }
    })

  return {
    activateSBCard,
    createFiatDeposit,
    cancelSBOrder,
    createSBCard,
    createSBOrder,
    createBankAccountLink,
    confirmSBOrder,
    deleteSavedAccount,
    getBankTransferAccounts,
    getBankTransferAccountDetails,
    getSBBalances,
    getSBCard,
    getSBCards,
    getSBOrder,
    getSBOrders,
    getSBPairs,
    getSBPaymentAccount,
    getSBPaymentMethods,
    getSBFiatEligible,
    getSBQuote,
    getSBTransactions,
    getUnifiedSellTrades,
    submitSBCardDetailsToEverypay,
    updateBankAccountLink,
    withdrawSBFunds
  }
}
