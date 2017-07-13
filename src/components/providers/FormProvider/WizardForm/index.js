import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, path } from 'ramda'
import { reduxForm } from 'redux-form'
import { actions } from 'data'

const wizardForm = (formName, totalSteps) => Component => {
  class WizardForm extends React.Component {
    constructor (props) {
      super(props)
      this.next = this.next.bind(this)
      this.previous = this.previous.bind(this)
    }

    next () {
      const nextStep = this.props.step + 1
      const finalNextStep = nextStep < totalSteps ? nextStep : totalSteps
      this.props.actions.setStep(formName, finalNextStep)
    }

    previous () {
      const previousStep = this.props.step - 1
      const finalPreviousStep = previousStep >= 0 ? previousStep : 0
      this.props.actions.setStep(formName, finalPreviousStep)
    }

    render () {
      return <Component {...this.props} step={this.props.step} next={this.next} previous={this.previous} />
    }
  }

  const mapStateToProps = (state) => {
    return {
      step: path(['form', formName, 'step'], state) || 0
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(actions.form, dispatch)
    }
  }

  const enhance = compose(
    reduxForm({ form: formName, destroyOnUnmount: false }),
    connect(mapStateToProps, mapDispatchToProps)
  )

  return enhance(WizardForm)
}

export default wizardForm
