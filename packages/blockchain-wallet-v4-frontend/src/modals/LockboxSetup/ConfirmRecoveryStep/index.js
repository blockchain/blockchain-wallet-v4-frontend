import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Stepper, { StepView, StepTransition } from 'components/Utilities/Stepper'
import { actions } from 'data'
import { Button } from 'blockchain-info-components'

class ConfirmRecoveryStep extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      step: 0
    }
  }

  nextStep () {
    this.setState({ step: this.state.step + 1 })
  }

  render () {
    return (
      <Stepper key='LockboxConfirmRecoveryStep' initialStep={0}>
        <StepView step={0}>
          <div>Have you saved your 24 word phrase?</div>
          <StepTransition next Component={Button} nature='primary'>
            Yes, I saved my passphrase
          </StepTransition>
        </StepView>
        <StepView step={1}>
          <div>Please confirm!</div>
          <StepTransition next Component={Button} nature='primary'>
            Yes!
          </StepTransition>
        </StepView>
        <StepView step={2}>
          <div>Do you want to save you public keys?</div>
          <Button
            nature='primary'
            onClick={() => this.props.lockboxActions.saveDevice()}
          >
            Yes, I want to see my balance always
          </Button>
          <Button
            nature='sent'
            onClick={() => this.props.modalActions.closeModal()}
          >
            No thank you
          </Button>
        </StepView>
      </Stepper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ConfirmRecoveryStep)
