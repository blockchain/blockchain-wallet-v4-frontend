import { SwapOrderDirectionType, WalletFiatType } from '@core/types'

import { SwapAccountType, SwapBaseCounterTypes } from '../swap/types'

const PREFERRED_CURRENCY = 'preferredTradingCurrency'

// eslint-disable-next-line import/prefer-default-export
export const getDirection = (
  from: SwapAccountType
): Exclude<SwapOrderDirectionType, 'TO_USERKEY' | 'ON_CHAIN'> => {
  switch (true) {
    case from.type === SwapBaseCounterTypes.ACCOUNT:
      return 'FROM_USERKEY'
    default:
      return 'INTERNAL'
  }
}

export const setPreferredCurrency = (currency: WalletFiatType) =>
  localStorage.setItem(PREFERRED_CURRENCY, currency)

export const getPreferredCurrency = (): WalletFiatType | null => {
  const preferredCurrency = localStorage.getItem(PREFERRED_CURRENCY)

  if (preferredCurrency) {
    return preferredCurrency as WalletFiatType
  }

  return null
}

export const reversePair = (pair: string) => {
  const pairArr = pair.split('-')
  const pairReversed = `${pairArr[1]}-${pairArr[0]}`

  return pairReversed
}
