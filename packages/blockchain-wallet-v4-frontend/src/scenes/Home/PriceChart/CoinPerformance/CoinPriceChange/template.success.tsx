import React from 'react'
import { PriceChange } from 'blockchain-wallet-v4-frontend/src/scenes/Transactions/model'
import styled from 'styled-components'

import { PriceChangeType } from 'blockchain-wallet-v4/src/redux/data/misc/types'

import { Props as OwnProps, SuccessStateType } from '.'

const Wrapper = styled.div`
  padding-left: 8px;
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
