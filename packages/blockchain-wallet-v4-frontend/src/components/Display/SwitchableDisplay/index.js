import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors } from 'data'

import SwitchableDisplay from './template.js'

class SwitchableDisplayContainer extends React.PureComponent {
  render () {
    return <SwitchableDisplay {...this.props} />
  }
}

SwitchableDisplay.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  coinDisplayed: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  coinDisplayed: selectors.preferences.getCoinDisplayed(state)
})

export default connect(mapStateToProps)(SwitchableDisplayContainer)
