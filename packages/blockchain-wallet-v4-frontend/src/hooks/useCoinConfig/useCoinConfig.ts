import { useMemo } from 'react'

import { CoinConfigHook } from './types'

export const useCoinConfig: CoinConfigHook = ({ coin }) =>
  useMemo(() => window.coins[coin].coinfig, [coin])
