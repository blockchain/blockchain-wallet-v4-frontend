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
  gap: 12px;

  ${media.atLeastTabletL`
    margin-top: 24px;
    margin-right: 24px;
  `}
`

const ActionsContainer = () => {
  const dispatch = useDispatch()
  const { cryptoCurrency } = useSelector(getData)

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

  const onSellClick = () => {
    dispatch(
      buySellActions.showModal({
        cryptoCurrency,
        orderType: OrderType.SELL,
        origin: 'PriceChart'
      })
    )
    dispatch(
      trackEvent({
        key: Analytics.PRICE_GRAPH_SELL_CLICKED,
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
      <Button
        width='125px'
        data-e2e='buyButton'
        height='42px'
        nature='primary'
        onClick={onBuyClick}
      >
        <Text color='white' size='16px' lineHeight='24px' weight={600}>
          <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
        </Text>
      </Button>
      <Button
        width='125px'
        data-e2e='sellButton'
        height='42px'
        nature='empty-secondary'
        onClick={onSellClick}
      >
        <Text color='blue600' size='16px' lineHeight='24px' weight={600}>
          <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
        </Text>
      </Button>
      <Button
        width='125px'
        data-e2e='swapButton'
        height='42px'
        nature='empty-secondary'
        onClick={onSwapClick}
      >
        <Text color='blue600' size='16px' lineHeight='24px' weight={600}>
          <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
        </Text>
      </Button>
    </Wrapper>
  )
}

export default ActionsContainer
