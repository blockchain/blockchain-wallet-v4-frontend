import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import CoinTicker from './CoinTicker'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const CoinFilters = props => {
  const { coin, actions } = props

  return (
    <Wrapper>
      <CoinTicker coin='BTC' selected={coin === 'BTC'} handleClick={() => actions.coinClicked('BTC')} />
      <CoinTicker coin='ETH' selected={coin === 'ETH'} handleClick={() => actions.coinClicked('ETH')} />
      <CoinTicker coin='BCH' selected={coin === 'BCH'} handleClick={() => actions.coinClicked('BCH')} />
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  coin: selectors.components.priceChart.getCoin(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinFilters)
