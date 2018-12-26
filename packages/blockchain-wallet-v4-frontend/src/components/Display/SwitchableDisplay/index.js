import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

import CoinDisplay from '../CoinDisplay'
import FiatDisplay from '../FiatDisplay'

class SwitchableDisplayContainer extends React.PureComponent {
  render () {
    return this.props.coinDisplayed ? (
      <CoinDisplay {...this.props}>{this.props.children}</CoinDisplay>
    ) : (
      <FiatDisplay {...this.props}>{this.props.children}</FiatDisplay>
    )
  }
}

SwitchableDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH', 'BSV', 'XLM']).isRequired,
  coinDisplayed: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  coinDisplayed: selectors.preferences.getCoinDisplayed(state)
})

export default connect(mapStateToProps)(SwitchableDisplayContainer)
