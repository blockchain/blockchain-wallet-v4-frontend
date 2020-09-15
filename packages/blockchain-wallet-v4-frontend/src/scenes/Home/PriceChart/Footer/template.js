import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { model } from 'data'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

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

const Footer = ({ coinTicker, coinName, handleBuy }) => {
  const [swapTo, setSwapTo] = useState('BTC')

  useEffect(() => {
    coinTicker === 'BTC' ? setSwapTo('ETH') : setSwapTo('BTC')
  }, [coinTicker])
  return (
    <Wrapper>
      <BuyTradeButton height='48px' nature='primary' onClick={handleBuy}>
        <FormattedMessage
          id='price.chart.buy.coin'
          defaultMessage='Buy {coinName}'
          values={{ coinName }}
        />
      </BuyTradeButton>
      <LinkContainer
        to={{
          pathname: '/swap',
          state: {
            from: coinTicker,
            to: swapTo,
            amount: '0',
            fix: model.rates.FIX_TYPES.BASE_IN_FIAT
          }
        }}
        data-e2e='exchangeLink'
      >
        <BuyTradeButton height='48px' nature='primary'>
          <FormattedMessage
            id='price.chart.swap.coin'
            defaultMessage='Swap {coinName}'
            values={{ coinName }}
          />
        </BuyTradeButton>
      </LinkContainer>
    </Wrapper>
  )
}

export default Footer
