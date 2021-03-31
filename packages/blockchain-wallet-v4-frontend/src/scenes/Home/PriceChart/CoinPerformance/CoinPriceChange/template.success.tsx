import React from 'react'
import { PriceChange } from 'blockchain-wallet-v4-frontend/src/scenes/Transactions/model'
import styled from 'styled-components'

import { PriceChangeType } from 'blockchain-wallet-v4/src/redux/data/misc/types'
import { media } from 'services/styles'

import { Props as OwnProps, SuccessStateType } from '.'

const Wrapper = styled.div`
  margin-top: 8px;
  margin-left: 0;

  ${media.atLeastTabletL`
    margin-left: 24px;
  `}
`

const Success = ({ currency, priceChange }: Props) => {
  return (
    <Wrapper>
      <PriceChange currency={currency} priceChange={priceChange}>
        {' '}
      </PriceChange>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType & { priceChange: PriceChangeType }

export default Success
