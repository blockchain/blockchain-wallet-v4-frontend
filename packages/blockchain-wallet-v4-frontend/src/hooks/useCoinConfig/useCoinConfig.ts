import { useMemo } from 'react'

import { CoinConfigHook } from './useCoinConfig.types'

export const useCoinConfig: CoinConfigHook = ({ coin }) =>
  useMemo(() => window.coins[coin].coinfig, [coin])
