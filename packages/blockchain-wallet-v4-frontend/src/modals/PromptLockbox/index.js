import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import PromptForLockbox from './template.js'
import { CONFIRM_STEPS } from './model'

class PromptLockboxContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { step: CONFIRM_STEPS.connect }
    this.onStepChange = this.onStepChange.bind(this)
  }

  onStepChange (step) {
    this.setState({ step })
  }

  render () {
    return (
      <PromptForLockbox
        {...this.props}
        step={this.state.step}
        handleStepChange={this.onStepChange}
      />
    )
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
