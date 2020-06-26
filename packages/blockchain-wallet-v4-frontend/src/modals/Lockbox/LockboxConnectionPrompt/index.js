import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import * as Lockbox from 'services/LockboxService'
import { actions, selectors } from 'data'
import LockboxConnectionPrompt from './template'
import modalEnhancer from 'providers/ModalEnhancer'

class LockboxConnectionPromptContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.resetConnectionStatus()
  }

  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render () {
    return (
      <LockboxConnectionPrompt
        onClose={this.onClose}
        appName={Lockbox.constants.supportedApps[this.props.coin]}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentConnection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxConnectionPrompt'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(LockboxConnectionPromptContainer)
