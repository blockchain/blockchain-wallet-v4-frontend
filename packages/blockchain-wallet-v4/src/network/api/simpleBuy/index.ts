import { CoinType, CurrenciesType } from '../../../types'
import {
  FiatEligibleType,
  SBAccountType,
  SBBalancesType,
  SBMoneyType,
  SBOrderType,
  SBPairsType,
  SBPairType
} from './types'

export default ({
  nabuUrl,
  get,
  authorizedGet,
  authorizedPost,
  authorizedPut,
  authorizedDelete
}) => {
  const cancelSBOrder = (order: SBOrderType) =>
    authorizedDelete({
      url: nabuUrl,
      endPoint: `/simple-buy/trades/${order.id}`
    })

  const createSBOrder = (
    pair: SBPairsType,
    action: 'BUY' | 'SELL',
    input: SBMoneyType,
    output: {
      symbol: CoinType
    }
  ): SBOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/simple-buy/trades',
      contentType: 'application/json',
      data: {
        pair,
        action,
        input,
        output
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
    pendingOnly,
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

  const getSBSuggestedAmounts = (currency: keyof CurrenciesType) =>
    get({
      url: nabuUrl,
      endPoint: '/simple-buy/amounts',
      data: {
        currency
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
    cancelSBOrder,
    createSBOrder,
    getSBBalances,
    getSBOrders,
    getSBPairs,
    getSBPaymentAccount,
    getSBFiatEligible,
    getSBSuggestedAmounts,
    withdrawSBFunds
  }
}
