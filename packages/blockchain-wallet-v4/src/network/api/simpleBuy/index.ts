import { CoinType, CurrenciesType, FiatType } from '../../../types'
import {
  FiatEligibleType,
  NabuAddressType,
  SBAccountType,
  SBBalancesType,
  SBCardType,
  SBMoneyType,
  SBOrderType,
  SBPairsType,
  SBPairType,
  SBPaymentMethodsType,
  SBQuoteType,
  SBSuggestedAmountType
} from './types'

export default ({
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
  everypayUrl,
  get,
  nabuUrl,
  post
}) => {
  const activateSBCard = (cardId: string, customerUrl: string): SBCardType =>
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
    address: NabuAddressType
  ): SBCardType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/payments/cards',
      contentType: 'application/json',
      data: {
        currency,
        address
      }
    })

  const createSBOrder = (
    pair: SBPairsType,
    action: 'BUY' | 'SELL',
    pending: boolean,
    input: SBMoneyType,
    output: {
      symbol: CoinType
    }
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
        output
      }
    })

  const confirmSBOrder = (order: SBOrderType): SBOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/simple-buy/trades/${order.id}`,
      contentType: 'application/json',
      data: {
        action: 'confirm'
      }
    })

  const getSBBalances = (currency?: CoinType): SBBalancesType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/accounts/simplebuy',
      data: {
        ccy: currency
      }
    })

  const getSBCard = (cardId: string): SBCardType =>
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
        fiatCurrency: currency
      }
    })

  const getSBOrders = ({
    pendingOnly = false,
    before,
    after
  }: {
    after?: string
    before?: string
    pendingOnly?: boolean
  }): { orders: Array<SBOrderType> } =>
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

  const getSBPaymentMethods = (currency: FiatType): SBPaymentMethodsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/methods',
      contentType: 'application/json',
      data: {
        currency
      }
    })

  const getSBQuote = (
    currencyPair: SBPairsType,
    action: 'BUY' | 'SELL',
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

  const getSBSuggestedAmounts = (
    currency: keyof CurrenciesType
  ): SBSuggestedAmountType =>
    get({
      url: nabuUrl,
      endPoint: '/simple-buy/amounts',
      data: {
        currency
      }
    })

  const submitSBCardDetailsToEverypay = ({
    accessToken,
    apiUserName,
    ccNumber,
    cvc,
    month,
    nonce,
    year
  }: {
    accessToken: string
    apiUserName: string
    ccNumber: string
    cvc: string
    month: string
    nonce: string
    year: string
  }) =>
    post({
      url: everypayUrl,
      endPoint: '/api/v3/mobile_payments/card_details',
      contentType: 'application/json',
      withCrendentials: true,
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      data: {
        api_username: apiUserName,
        cc_details: {
          cc_number: ccNumber,
          month,
          year,
          cvc,
          holder_name: 'EveryPay'
        },
        nonce,
        token_consented: true,
        timestamp: new Date().toISOString()
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
    cancelSBOrder,
    createSBCard,
    createSBOrder,
    confirmSBOrder,
    getSBBalances,
    getSBCard,
    getSBCards,
    getSBOrders,
    getSBPairs,
    getSBPaymentAccount,
    getSBPaymentMethods,
    getSBFiatEligible,
    getSBQuote,
    getSBSuggestedAmounts,
    submitSBCardDetailsToEverypay,
    withdrawSBFunds
  }
}
