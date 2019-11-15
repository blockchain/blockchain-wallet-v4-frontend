import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import React from 'react'

import { actions } from 'data'
import Header from './template.js'

class HeaderContainer extends React.PureComponent {
  render () {
    return (
      <Header
        handleToggle={() => this.props.actions.layoutWalletMenuToggleClicked()}
        {...this.props}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(HeaderContainer)
)
