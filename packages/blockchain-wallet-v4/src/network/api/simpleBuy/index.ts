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
  SBProviderAttributesType,
  SBQuoteType,
  SBSuggestedAmountType
} from './types'
import { Moment } from 'moment'
import { UserDataType } from 'data/types'
import axios from 'axios'

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

  const createSBOrder = (
    pair: SBPairsType,
    action: 'BUY' | 'SELL',
    pending: boolean,
    input: SBMoneyType,
    output: {
      symbol: CoinType
    },
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
        paymentMethodId
      }
    })

  const confirmSBOrder = (
    order: SBOrderType,
    attributes?: SBProviderAttributesType
  ): SBOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/simple-buy/trades/${order.id}`,
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: {
        action: 'confirm',
        attributes
      }
    })

  const deleteSBCard = (cardId: SBCardType['id']): SBCardType =>
    authorizedDelete({
      url: nabuUrl,
      endPoint: `/payments/cards/${cardId}`
    })

  const getSBBalances = (currency?: CoinType): SBBalancesType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/accounts/simplebuy',
      data: {
        ccy: currency
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
        methods: 'PAYMENT_CARD,BANK_ACCOUNT'
      }
    })

  const getSBOrder = (orderId: string): SBOrderType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/simple-buy/trades/${orderId}`,
      ignoreQueryParams: true
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

  const getSBPaymentMethods = (
    currency: FiatType,
    checkEligibility?: true
  ): SBPaymentMethodsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/methods',
      contentType: 'application/json',
      data: {
        currency,
        checkEligibility
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
    cancelSBOrder,
    createSBCard,
    createSBOrder,
    confirmSBOrder,
    deleteSBCard,
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
    getSBSuggestedAmounts,
    submitSBCardDetailsToEverypay,
    withdrawSBFunds
  }
}
