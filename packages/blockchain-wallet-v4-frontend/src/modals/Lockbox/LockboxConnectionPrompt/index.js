import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import * as Lockbox from 'services/lockbox'

import LockboxConnectionPrompt from './template'

class LockboxConnectionPromptContainer extends React.PureComponent {
  componentWillUnmount() {
    this.props.lockboxActions.resetConnectionStatus()
  }

  onClose = () => {
    this.props.lockboxActions.lockboxModalClose()
    this.props.closeAll()
  }

  render() {
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
