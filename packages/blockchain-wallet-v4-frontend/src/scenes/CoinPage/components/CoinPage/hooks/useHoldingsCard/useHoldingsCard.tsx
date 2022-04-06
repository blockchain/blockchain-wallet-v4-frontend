import React, { useMemo } from 'react'
import { useCoinConfig, useCoinRates } from 'blockchain-wallet-v4-frontend/src/hooks'

import { HoldingsCard } from '../../../HoldingsCard'
import { HoldingsCardHook } from './types'

export const useHoldingsCard: HoldingsCardHook = ({ coin }) => {
  // const coinfig = useCoinConfig({ coin })

  // const { data: coinRate } = useCoinRates({
  //   coin
  // })

  const holdingsCardNode = useMemo(() => {
    return <HoldingsCard actions={[]} total='' coinCode={coin} coinTotal='' />
  }, [coin])

  return [holdingsCardNode]
}
