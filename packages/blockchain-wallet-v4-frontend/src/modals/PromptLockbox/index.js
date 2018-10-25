import React from 'react'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { bindActionCreators, compose } from 'redux'
import modalEnhancer from 'providers/ModalEnhancer'
import PromptForLockbox from './template.js'

class PromptLockboxContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.lockboxActions.resetConnectionStatus()
  }

  render () {
    return <PromptForLockbox {...this.props} />
  }
}

const mapStateToProps = state => ({
  currentConnection: selectors.components.lockbox.getCurrentConnection(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('PromptLockbox'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(PromptLockboxContainer)
