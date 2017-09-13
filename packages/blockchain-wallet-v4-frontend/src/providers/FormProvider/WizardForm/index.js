import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, path } from 'ramda'
import { reduxForm, actions as reduxFormActions } from 'redux-form'
import { actions } from 'data'

const wizardForm = (formName, totalSteps, options = {}) => Component => {
  class WizardForm extends React.Component {
    constructor () {
      super()
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

    reset () {
      this.props.reduxFormActions.reset(formName)
    }

    render () {
      return <Component {...this.props} next={this.next} previous={this.previous} />
    }

    componentWillUnmount () { this.reset() }
  }

  const mapStateToProps = (state) => {
    return {
      step: path(['form', formName, 'step'], state) || 0
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      // actions: bindActionCreators(actions.form, dispatch),
      reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
    }
  }

  const enhance = compose(
    reduxForm({ form: formName, destroyOnUnmount: false, ...options }),
    connect(mapStateToProps, mapDispatchToProps)
  )

  return enhance(WizardForm)
}

export default wizardForm
