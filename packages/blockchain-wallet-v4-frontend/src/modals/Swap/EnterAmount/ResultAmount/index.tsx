import React from 'react'

import { SpinningLoader } from 'blockchain-info-components'

import { SpinnerWrapper, Text, Wrapper } from './index.styles'

type Props = {
  isRefreshing: boolean
  text: string
}

export const ResultAmount = ({ isRefreshing, text }: Props) => (
  <Wrapper isRefreshing={isRefreshing}>
    <Text>{text}</Text>
    <SpinnerWrapper>
      <SpinningLoader borderWidth='2px' height='10px' width='10px' />
    </SpinnerWrapper>
  </Wrapper>
)
