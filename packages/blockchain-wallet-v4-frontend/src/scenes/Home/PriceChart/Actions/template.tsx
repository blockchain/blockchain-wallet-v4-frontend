import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { OrderType } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { Analytics } from 'data/analytics/types'
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
  analyticsActions,
  buySellActions,
  coinName,
  cryptoCurrency,
  swapActions
}: Props) => {
  const onBuyClick = () => {
    buySellActions.showModal({
      cryptoCurrency,
      orderType: OrderType.BUY,
      origin: 'PriceChart'
    })
    analyticsActions.trackEvent({
      key: Analytics.PRICE_GRAPH_BUY_CLICKED,
      properties: {}
    })
  }

  const onSwapClick = () => {
    swapActions.showModal({ origin: 'PriceChart' })
    analyticsActions.trackEvent({
      key: Analytics.PRICE_GRAPH_SWAP_CLICKED,
      properties: {}
    })
  }

  return (
    <Wrapper>
      <BuyTradeButton data-e2e='buyButton' height='42px' nature='primary' onClick={onBuyClick}>
        <Text color='white' size='16px' lineHeight='24px' weight={600}>
          <FormattedMessage
            id='price.chart.buy.coin'
            defaultMessage='Buy {coinName}'
            values={{ coinName }}
          />
        </Text>
      </BuyTradeButton>
      <BuyTradeButton
        data-e2e='swapButton'
        height='42px'
        nature='empty-secondary'
        onClick={onSwapClick}
      >
        <Text color='blue600' size='16px' lineHeight='24px' weight={600}>
          <FormattedMessage
            id='price.chart.swap.coin'
            defaultMessage='Swap {coinName}'
            values={{ coinName }}
          />
        </Text>
      </BuyTradeButton>
    </Wrapper>
  )
}

export default Actions
