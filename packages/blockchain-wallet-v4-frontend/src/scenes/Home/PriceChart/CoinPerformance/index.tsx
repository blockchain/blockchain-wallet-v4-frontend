import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import CoinPriceChange from './CoinPriceChange'

const CoinPerformance = (props: Props) => {
  return <CoinPriceChange {...props} />
}

const mapStateToProps = state => ({
  currency: selectors.core.settings.getCurrency(state).getOrElse('USD'),
  priceChart: selectors.preferences.getPriceChart(state)
})

const mapDispatchToProps = dispatch => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinPerformance)
