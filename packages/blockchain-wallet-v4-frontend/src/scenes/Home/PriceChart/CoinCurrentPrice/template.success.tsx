import React from 'react'
import styled from 'styled-components'

import { CoinType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  margin-left: 0;

  ${media.atLeastTabletL`
    margin-left: 24px;
  `}
`

const Success = ({ coin, fiat }: { coin: CoinType; fiat: string }) => {
  return (
    <Wrapper>
      <Text size='24px' weight={600} color='black' data-e2e={`coinTicker${coin}`}>
        {fiat}
      </Text>
    </Wrapper>
  )
}

export default Success
