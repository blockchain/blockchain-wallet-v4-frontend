import React from 'react'

import { SpinningLoader } from 'blockchain-info-components'

import { LoadingWrapper, TokenRow } from '../components/styles'

export const Loading = () => (
  <TokenRow>
    <LoadingWrapper>
      <SpinningLoader width='36px' height='36px' borderWidth='4px' />
    </LoadingWrapper>
  </TokenRow>
)
