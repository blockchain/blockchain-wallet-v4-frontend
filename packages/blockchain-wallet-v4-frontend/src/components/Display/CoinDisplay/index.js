import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'

import CoinDisplay from './template.js'
import { bindActionCreators } from '../../../../../../../../Library/Caches/typescript/2.6/node_modules/redux';

class CoinDisplayContainer extends React.Component {
  componentWillMount () {
    this.props.actions.fetchSettings()
  }

  render () {
    const { coin, unit, children } = this.props

    // switch (coin) {
    //   case 'BTC': return <CoinDisplay {...this.props}>{Exchange.displayBitcoinToBitcoin({ value: children, fromUnit: 'SAT', toUnit: unit })}</CoinDisplay>
    //   case 'ETH': return <CoinDisplay {...this.props}>{Exchange.displayEtherToEther({ value: children, fromUnit: 'WEI', toUnit: 'ETH' })}</CoinDisplay>
    //   default: return <div />
    // }
    return <div />
  }
}

CoinDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  country: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  country: selectors.core.settings.getCountryCode(state),
  unit: selectors.core.settings.getBtcUnit(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinDisplayContainer)
