import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { OrderType } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { trackEvent } from 'data/analytics/slice'
import { Analytics } from 'data/analytics/types'
import { actions as buySellActions } from 'data/components/buySell/slice'
import { actions as swapActions } from 'data/components/swap/slice'
import { media } from 'services/styles'

import { getData } from './selectors'

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

const ActionsContainer = () => {
  const dispatch = useDispatch()
  const { coinName, cryptoCurrency } = useSelector(getData)

  const onBuyClick = () => {
    dispatch(
      buySellActions.showModal({
        cryptoCurrency,
        orderType: OrderType.BUY,
        origin: 'PriceChart'
      })
    )
    dispatch(
      trackEvent({
        key: Analytics.PRICE_GRAPH_BUY_CLICKED,
        properties: {}
      })
    )
  }

  const onSwapClick = () => {
    dispatch(swapActions.showModal({ origin: 'PriceChart' }))
    dispatch(
      trackEvent({
        key: Analytics.PRICE_GRAPH_SWAP_CLICKED,
        properties: {}
      })
    )
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

export default ActionsContainer
