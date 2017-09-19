import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'

const wizard = (name, totalSteps) => Component => {
  class WizardProvider extends React.Component {
    constructor (props) {
      super(props)
      this.handleNextStep = this.handleNextStep.bind(this)
      this.handlePreviousStep = this.handlePreviousStep.bind(this)
    }

    componentWillMount () {
      this.props.actions.reset(name)
    }

    handlePreviousStep () {
      if (this.props.step > 1) {
        this.props.actions.setStep(name, (this.props.step - 1))
      }
    }

    handleNextStep () {
      if (this.props.step < totalSteps) {
        this.props.actions.setStep(name, (this.props.step + 1))
      }
    }

    render () {
      return <Component
        {...this.props}
        previousStep={this.handlePreviousStep}
        nextStep={this.handleNextStep}
      />
    }

    componentWillUnmount () {
      this.props.actions.reset(name)
    }
  }

  const mapStateToProps = (state) => ({
    step: selectors.wizard.selectStep(name, state)
  })

  const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions.wizard, dispatch)
  })

  return connect(mapStateToProps, mapDispatchToProps)(WizardProvider)
}

export default wizard
