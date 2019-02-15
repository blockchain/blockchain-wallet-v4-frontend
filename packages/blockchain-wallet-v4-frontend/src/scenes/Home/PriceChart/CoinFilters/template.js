import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import CoinTicker from './CoinTicker'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const CoinFilters = props => {
  const { coin, handleClick } = props

  return (
    <Wrapper>
      <CoinTicker
        coin='BTC'
        selected={coin === 'BTC'}
        handleClick={() => handleClick('BTC')}
        data-e2e='priceChartBTC'
      />
      <CoinTicker
        coin='ETH'
        selected={coin === 'ETH'}
        handleClick={() => handleClick('ETH')}
        data-e2e='priceChartETH'
      />
      <CoinTicker
        coin='BCH'
        selected={coin === 'BCH'}
        handleClick={() => handleClick('BCH')}
        data-e2e='priceChartBCH'
      />
      <CoinTicker
        coin='XLM'
        selected={coin === 'XLM'}
        handleClick={() => handleClick('XLM')}
      />
    </Wrapper>
  )
}

CoinFilters.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH', 'XLM']).isRequired,
  handleClick: PropTypes.func.isRequired
}

export default CoinFilters
