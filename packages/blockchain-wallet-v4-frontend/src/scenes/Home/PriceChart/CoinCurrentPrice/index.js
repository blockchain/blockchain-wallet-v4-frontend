import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import CoinTicker from './CoinTicker'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  margin-top: 20px;
  z-index: 1;
`
const Header = styled(Text).attrs({
  size: '12px'
})`
  margin-bottom: 12px;
`

class CoinCurrentPrice extends React.PureComponent {
  render () {
    const { coin } = this.props

    return (
      <Wrapper>
        <Header>
          <FormattedMessage
            id='scenes.home.pricechart.coincurrentprice.currentprice'
            defaultMessage='Current Price'
          />
        </Header>
        <CoinTicker coin={coin} data-e2e={`coinTicker${coin}`} />
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  coin: selectors.components.priceChart.getCoin(state)
})

export default connect(mapStateToProps)(CoinCurrentPrice)
