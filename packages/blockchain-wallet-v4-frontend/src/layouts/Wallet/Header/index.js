import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Header from './template.js'

class HeaderContainer extends React.PureComponent {
  render () {
    return (
      <Header handleToggle={() => this.props.actions.layoutWalletMenuToggleClicked()} />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

export default connect(undefined, mapDispatchToProps)(HeaderContainer)
