import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { actions, selectors } from 'data'
import BtcWelcome from './template.btc'
import BchWelcome from './template.bch'
import EthWelcome from './template.eth'

// TODO: refactor methods and preferences updates
class CoinWelcomeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClickBtc = this.handleClickBtc.bind(this)
    this.handleRequestBtc = this.handleRequestBtc.bind(this)
    this.handleClickBch = this.handleClickBch.bind(this)
    this.handleRequestBch = this.handleRequestBch.bind(this)
    this.handleClickEth = this.handleClickEth.bind(this)
    this.handleRequestEth = this.handleRequestEth.bind(this)
  }

  handleClickEth () {
    this.props.preferencesActions.setEtherWelcome(false)
  }

  handleRequestEth () {
    this.props.modalActions.showModal('RequestEther')
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
      showBchWelcome,
      showEthWelcome
    } = this.props
    const exchangeBtc = ethBalanceR.getOrElse(0) + bchBalanceR.getOrElse(0) > 0
    const exchangeBch = ethBalanceR.getOrElse(0) + btcBalanceR.getOrElse(0) > 0
    const exchangeEth = btcBalanceR.getOrElse(0) + bchBalanceR.getOrElse(0) > 0
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
        return (
          <EthWelcome
            displayed={showEthWelcome}
            handleClick={this.handleClickEth}
            handleRequest={this.handleRequestEth}
            exchange={exchangeEth}
          />
        )
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
  showEthWelcome: selectors.preferences.getShowEtherWelcome(state),
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
