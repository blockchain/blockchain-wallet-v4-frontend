import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

const wizard = (name, totalSteps) => Component => {
  class WizardProvider extends React.PureComponent {
    constructor(props) {
      super(props)
      this.handleNextStep = this.handleNextStep.bind(this)
      this.handlePreviousStep = this.handlePreviousStep.bind(this)
      this.handleResetStep = this.handleResetStep.bind(this)
    }

    handlePreviousStep() {
      if (this.props.step > 1) {
        this.props.actions.setStep(name, this.props.step - 1)
      }
    }

    handleNextStep() {
      if (this.props.step < totalSteps) {
        this.props.actions.setStep(name, this.props.step + 1)
      }
    }

    handleResetStep() {
      this.props.actions.reset(name)
    }

    render() {
      return (
        <Component
          {...this.props}
          previousStep={this.handlePreviousStep}
          nextStep={this.handleNextStep}
          resetStep={this.handleResetStep}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    step: selectors.wizard.selectStep(name, state)
  })

  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions.wizard, dispatch)
  })

  return connect(mapStateToProps, mapDispatchToProps)(WizardProvider)
}

export default wizard
