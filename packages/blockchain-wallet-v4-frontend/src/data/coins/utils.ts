import { BSBalanceType, CoinType, InterestBalanceType } from '@core/types'
import { convertStandardToBase } from 'data/components/exchange/services'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/types'

export const generateTradingAccount = (
  coin: CoinType,
  sbBalance?: BSBalanceType
): SwapAccountType[] => {
  const { coinfig } = window.coins[coin]
  return [
    {
      balance: sbBalance?.available || '0',
      baseCoin: coinfig.type.erc20Address ? 'ETH' : (coin as SwapAccountType['baseCoin']),
      coin,
      label: 'Trading Account',
      type: SwapBaseCounterTypes.CUSTODIAL
    }
  ]
}

export const generateInterestAccount = (
  coin: CoinType,
  interestBalance?: InterestBalanceType
): SwapAccountType[] => {
  const { coinfig } = window.coins[coin]
  return [
    {
      balance: interestBalance?.balance || '0',
      baseCoin: coinfig.type.erc20Address ? 'ETH' : (coin as SwapAccountType['baseCoin']),
      coin,
      label: `${coin} Rewards Account`,
      // @ts-ignore
      type: 'INTEREST'
    }
  ]
}

export const generateProvisionalPaymentAmount = (
  coin: CoinType,
  amount: number
): string | number => {
  if (coin === 'BTC' || coin === 'BCH') {
    return parseInt(convertStandardToBase(coin, amount), 10)
  }

  return convertStandardToBase(coin, amount)
}
