import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { actions, selectors } from 'data'
import BtcWelcome from './template.btc.js'
import BchWelcome from './template.bch.js'

class CoinWelcomeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClickBtc = this.handleClickBtc.bind(this)
    this.handleRequestBtc = this.handleRequestBtc.bind(this)
    this.handleClickBch = this.handleClickBch.bind(this)
    this.handleRequestBch = this.handleRequestBch.bind(this)
  }

  handleClickBtc () {
    this.props.preferencesActions.setBitcoinWelcome(false)
  }

  handleRequestBtc () {
    this.props.modalActions.showModal('RequestBitcoin')
  }

  handleClickBch () {
    this.props.preferencesActions.setBitcoinCashWelcome(false)
  }

  handleRequestBch () {
    this.props.modalActions.showModal('RequestBch')
  }

  render () {
    const {
      coin,
      canBuyBtc,
      btcBalanceR,
      bchBalanceR,
      ethBalanceR,
      showBtcWelcome,
      showBchWelcome
    } = this.props
    const exchangeBtc = ethBalanceR.getOrElse(0) + bchBalanceR.getOrElse(0) > 0
    const exchangeBch = ethBalanceR.getOrElse(0) + btcBalanceR.getOrElse(0) > 0
    const partnerBtc = canBuyBtc.cata({
      Success: val => val,
      Loading: () => false,
      Failure: () => false,
      NotAsked: () => false
    })
    switch (coin) {
      case 'BTC':
        return (
          <BtcWelcome
            displayed={showBtcWelcome}
            handleClick={this.handleClickBtc}
            handleRequest={this.handleRequestBtc}
            partner={partnerBtc}
            exchange={exchangeBtc}
          />
        )
      case 'BCH':
        return (
          <BchWelcome
            displayed={showBchWelcome}
            handleClick={this.handleClickBch}
            handleRequest={this.handleRequestBch}
            exchange={exchangeBch}
          />
        )
      case 'ETH':
        // TODO
        return null
      default:
        return null
    }
  }
}

const mapStateToProps = state => ({
  ethBalanceR: selectors.core.data.ethereum.getBalance(state),
  bchBalanceR: selectors.core.data.bch.getBalance(state),
  btcBalanceR: selectors.core.data.bitcoin.getBalance(state),
  showBchWelcome: selectors.preferences.getShowBitcoinCashWelcome(state),
  showBtcWelcome: selectors.preferences.getShowBitcoinWelcome(state),
  canBuyBtc: selectors.exchange.getCanTrade(state, 'Buy')
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

CoinWelcomeContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH'])
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinWelcomeContainer)
