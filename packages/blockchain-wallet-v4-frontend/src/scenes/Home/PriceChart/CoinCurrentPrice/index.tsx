import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { selectors } from 'data'

import CoinTicker from './CoinTicker'

const CoinCurrentPrice = ({ priceChart: { coin = 'BTC' } }: Props) => {
  return <CoinTicker coin={coin} data-e2e={`coinTicker${coin}`} />
}

const mapStateToProps = state => ({
  priceChart: selectors.preferences.getPriceChart(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinCurrentPrice)
