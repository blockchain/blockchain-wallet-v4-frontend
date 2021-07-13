import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import Header from './template'

class HeaderContainer extends React.PureComponent<Props> {
  render() {
    return (
      <Header
        handleToggle={() => this.props.actions.layoutWalletMenuToggleClicked()}
        {...this.props}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  refreshActions: bindActionCreators(actions.components.refresh, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default withRouter(connector(HeaderContainer))
