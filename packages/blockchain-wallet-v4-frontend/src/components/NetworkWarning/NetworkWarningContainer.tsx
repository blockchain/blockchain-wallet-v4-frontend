import React from 'react'
import { useSelector } from 'react-redux'

import { NetworkWarning } from 'components/NetworkWarning/NetworkWarning'
import { getCoinNetworkWarning } from 'components/NetworkWarning/selectors'
import { RootState } from 'data/rootReducer'

import { Variant } from './types'

type Props = {
  coin: string
  variant: Variant
}

export const NetworkWarningContainer = ({ coin, variant }: Props) => {
  const networkWarning = useSelector((state: RootState) => getCoinNetworkWarning(state, coin))

  return <NetworkWarning variant={variant} warning={networkWarning} />
}
