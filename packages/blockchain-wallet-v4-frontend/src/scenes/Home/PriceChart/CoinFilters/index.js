import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CoinFilters from './template'
import { actions, selectors } from 'data'

export const CoinFiltersContainer = props => {
  const { coin, actions } = props

  return <CoinFilters coin={coin} handleClick={(coin) => actions.coinClicked(coin)} />
}

CoinFiltersContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired
}

const mapStateToProps = state => ({
  coin: selectors.components.priceChart.getCoin(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinFiltersContainer)
