import React from 'react'
import { SpinningLoader } from '@blockchain-com/constellation'

import { PageWrapper } from '../PageWrapper'

export const PageLoading = () => (
  <PageWrapper>
    <SpinningLoader variant='color' size='large' />
  </PageWrapper>
)
