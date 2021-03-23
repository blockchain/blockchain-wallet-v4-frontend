import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button } from 'blockchain-info-components'
import { media } from 'services/styles'

import { Props } from '.'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  ${media.atLeastTabletL`
    margin-top: 24px;
    margin-right: 24px;
  `}
`

const BuyTradeButton = styled(Button)`
  &:first-child {
    margin-right: 12px;
  }
`

const Actions = ({
  coinName,
  cryptoCurrency,
  simpleBuyActions,
  swapActions
}: Props) => {
  return (
    <Wrapper>
      <BuyTradeButton
        data-e2e='buyButton'
        height='48px'
        nature='primary'
        onClick={() =>
          simpleBuyActions.showModal('PriceChart', cryptoCurrency, 'BUY')
        }
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
        nature='empty'
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

export default Actions
