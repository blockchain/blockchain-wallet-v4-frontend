import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Props } from '.'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  z-index: 2;
  margin-bottom: 24px;
  width: 100%;
`

const BuyTradeButton = styled(Button)`
  max-width: 200px;
  width: 100%;

  &:first-child {
    margin: 0 12px;
  }

  &:last-child {
    margin: 0 12px;
  }
`

const Footer = ({
  cryptoCurrency,
  coinName,
  simpleBuyActions,
  swapActions
}: Props) => {
  return (
    <Wrapper>
      <BuyTradeButton
        data-e2e='buyButton'
        height='48px'
        nature='primary'
        onClick={() => simpleBuyActions.showModal('PriceChart', cryptoCurrency)}
      >
        <FormattedMessage
          id='price.chart.buy.coin'
          defaultMessage='Buy {coinName}'
          values={{ coinName }}
        />
      </BuyTradeButton>
      <BuyTradeButton
        data-e2e='swapButton'
        height='48px'
        nature='primary'
        onClick={() => swapActions.showModal('PriceChart')}
      >
        <FormattedMessage
          id='price.chart.swap.coin'
          defaultMessage='Swap {coinName}'
          values={{ coinName }}
        />
      </BuyTradeButton>
    </Wrapper>
  )
}

export default Footer
