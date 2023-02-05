import React from 'react'

import { SpinningLoader } from 'blockchain-info-components'

import { LoadingWrapper, TokenRow } from '../components/styles'

export const LoadingMore = () => (
  <TokenRow>
    <LoadingWrapper>
      <SpinningLoader width='24px' height='24px' borderWidth='4px' />
    </LoadingWrapper>
  </TokenRow>
)
