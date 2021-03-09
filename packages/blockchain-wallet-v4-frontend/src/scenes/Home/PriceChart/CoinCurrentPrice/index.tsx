import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Text } from 'blockchain-info-components'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { propOr } from 'ramda'
import styled from 'styled-components'

import { selectors } from 'data'
import CoinTicker from './CoinTicker'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  margin-top: 8px;
  z-index: 1;
`
const Header = styled(Text).attrs({
  size: '12px'
})`
  margin-bottom: 8px;
`

class CoinCurrentPrice extends React.PureComponent<Props> {
  render() {
    const { priceChart } = this.props
    const coin = propOr('BTC', 'coin', priceChart) as CoinType

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
  priceChart: selectors.preferences.getPriceChart(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinCurrentPrice)
