import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import React from 'react'

import { actions } from 'data'
import Header from './template'

export type LinkDispatchPropsType = {
  actions: typeof actions.components.layoutWallet
  modalActions: typeof actions.modals
  refreshActions: typeof actions.components.refresh
}

type Props = LinkDispatchPropsType

class HeaderContainer extends React.PureComponent<Props> {
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
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  refreshActions: bindActionCreators(actions.components.refresh, dispatch)
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(HeaderContainer)
)
