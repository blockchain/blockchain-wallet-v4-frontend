import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import PromptForLockbox from './template.js'

class PromptLockboxContainer extends React.PureComponent {
  render () {
    return <PromptForLockbox {...this.props} />
  }
}

const mapStateToProps = state => ({
  currentConnection: selectors.components.lockbox.getCurrentConnection(state)
})

const enhance = compose(
  modalEnhancer('PromptLockbox'),
  connect(mapStateToProps)
)

export default enhance(PromptLockboxContainer)
