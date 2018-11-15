import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Header from './template.js'

class HeaderContainer extends React.PureComponent {
  render () {
    return (
      <Header
        isTestnet={this.props.network === 'testnet'}
        handleToggle={() => this.props.actions.layoutWalletMenuToggleClicked()}
      />
    )
  }
}

const mapStateToProps = state => ({
  network: selectors.core.walletOptions
    .getBtcNetwork(state)
    .getOrElse('bitcoin')
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer)
