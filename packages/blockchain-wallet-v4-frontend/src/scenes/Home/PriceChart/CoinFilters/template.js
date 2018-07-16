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
      <CoinTicker coin='BTC' selected={coin === 'BTC'} handleClick={() => handleClick('BTC')} />
      <CoinTicker coin='ETH' selected={coin === 'ETH'} handleClick={() => handleClick('ETH')} />
      <CoinTicker coin='BCH' selected={coin === 'BCH'} handleClick={() => handleClick('BCH')} />
    </Wrapper>
  )
}

CoinFilters.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  handleClick: PropTypes.func.isRequired
}

export default CoinFilters
