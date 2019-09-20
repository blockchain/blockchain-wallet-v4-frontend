import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { getState } from './selectors'
import { Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  z-index: 2;
  margin-bottom: 37px;
  width: 100%;
`

const BuyTradeButton = styled(Button)`
  max-width: 200px;
  width: 100%;

  &:first-child {
    margin: 0 4px;
  }

  &:last-child {
    margin-right: 4px;
  }
`

const Footer = ({ actions, coinifySupported, priceChart }) => {
  const [coinName, setCoinName] = useState('Bitcoin')

  useEffect(() => {
    actions.checkCountryStateSupported()
  })

  useEffect(() => {
    switch (priceChart.coin) {
      case 'BTC':
        return setCoinName('Bitcoin')
      case 'ETH':
        return setCoinName('Ethereum')
      case 'BCH':
        return setCoinName('Bitcoin Cash')
      case 'XLM':
        return setCoinName('Stellar')
      default:
        setCoinName('Bitcoin')
    }
  }, [priceChart.coin])

  return (
    <Wrapper>
      {coinifySupported && (
        <LinkContainer to='/buy-sell' data-e2e='buyAndSellLink'>
          <BuyTradeButton nature='primary' height='48px'>
            <FormattedMessage
              id='price.chart.buy.coin'
              defaultMessage='Buy {coinName}'
              values={{ coinName }}
            />
          </BuyTradeButton>
        </LinkContainer>
      )}
      <LinkContainer to='/swap' data-e2e='exchangeLink'>
        <BuyTradeButton nature='primary' height='48px'>
          <FormattedMessage
            id='price.chart.swap.coin'
            defaultMessage='Trade {coinName}'
            values={{ coinName }}
          />
        </BuyTradeButton>
      </LinkContainer>
    </Wrapper>
  )
}

const mapStateToProps = state => {
  return {
    coinifySupported: getState(state),
    priceChart: selectors.preferences.getPriceChart(state)
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
