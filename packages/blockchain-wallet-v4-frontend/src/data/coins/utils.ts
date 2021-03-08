import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  CoinType,
  Erc20CoinsEnum,
  SBBalanceType
} from 'blockchain-wallet-v4/src/types'

import { convertStandardToBase } from 'data/components/exchange/services'

export const generateCustodyAccount = (
  coin: CoinType,
  sbBalance?: SBBalanceType
) => {
  // hack to support PAX rebrand 🤬
  const ticker = coin === 'PAX' ? 'USD-D' : coin
  return [
    {
      baseCoin: coin in Erc20CoinsEnum ? 'ETH' : coin,
      coin,
      label: `${ticker} Trading Wallet`,
      type: ADDRESS_TYPES.CUSTODIAL,
      balance: sbBalance?.available || '0'
    }
  ]
}

export const generateProvisionalPaymentAmount = (
  coin: CoinType,
  amount: number
): string | number => {
  if (coin === 'BTC' || coin === 'BCH') {
    return parseInt(convertStandardToBase(coin, amount))
  }

  return convertStandardToBase(coin, amount)
}
