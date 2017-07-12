import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, path } from 'ramda'
import { reduxForm } from 'redux-form'
import { actions } from 'data'

const withWizard = ({ totalSteps, formName }) => Component => {
  class WizardForm extends React.Component {
    constructor (props) {
      super(props)
      this.next = this.next.bind(this)
      this.previous = this.previous.bind(this)
    }

    next () {
      let nextStep = this.props.step + 1
      this.props.actions.setStep(formName, nextStep)
    }

    previous () {
      let previousStep = this.props.step - 1
      this.props.actions.setStep(formName, previousStep)
    }

    render () {
      return (<Component
        {...this.props}
        step={this.props.step}
        next={this.next}
        previous={this.previous}
      />)
    }
  }

  function matchStateToProps (state) {
    return {
      step: path(['form', formName, 'step'], state) || 0
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
      actions: bindActionCreators(actions.form, dispatch)
    }
  }

  let enhance = compose(
    reduxForm({ form: formName, destroyOnUnmount: false }),
    connect(matchStateToProps, mapDispatchToProps)
  )

  return enhance(WizardForm)
}

export default withWizard
