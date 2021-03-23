import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { selectors } from 'data'
import { media } from 'services/styles'

import CoinTicker from './CoinTicker'

const Wrapper = styled.div`
  ${media.atLeastTabletL`
    padding-left: 24px;
  `}
`

const CoinCurrentPrice = ({ priceChart: { coin = 'BTC' } }: Props) => {
  return (
    <Wrapper>
      <CoinTicker coin={coin} data-e2e={`coinTicker${coin}`} />
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  priceChart: selectors.preferences.getPriceChart(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinCurrentPrice)
