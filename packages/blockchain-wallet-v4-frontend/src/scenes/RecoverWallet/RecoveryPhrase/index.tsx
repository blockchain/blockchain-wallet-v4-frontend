import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector, getFormMeta, InjectedFormProps, reduxForm } from 'redux-form'

import { Form } from 'components/Form'
import { actions, selectors } from 'data'
import { LoginSteps } from 'data/types'

import { Props } from '..'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RecoveryPhraseContainer extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props,
  StateProps
> {
  constructor(props) {
    super(props)
    this.state = {
      step: 1
    }
  }

  componentWillUnmount() {
    this.props.formActions.clearFields('recover', false, false, 'mnemonic')
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change('recover', 'step', step)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { authActions, email, language, mnemonic, recoverPassword } = this.props
    if (this.state.step === 1) {
      this.setState({ step: 2 })
    } else {
      // TODO: last argument is network, do we even need this?
      authActions.restore(mnemonic, email, recoverPassword, language, undefined)
    }
  }

  previousStep = () => {
    this.setState({ step: 1 })
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.state.step === 2 && <SecondStep previousStep={this.previousStep} {...this.props} />}
        {this.state.step === 1 && <FirstStep {...this.props} />}
      </Form>
    )
  }
}

// const mapStateToProps = (state) => ({
//   email: formValueSelector('recover')(state, 'email'),
//   formMeta: getFormMeta('recover')(state),
//   formValues: selectors.form.getFormValues('recover')(state),
//   kycReset: selectors.auth.getKycResetStatus(state),
//   language: selectors.preferences.getLanguage(state),
//   loginFormValues: selectors.form.getFormValues('login')(state),
//   mnemonic: formValueSelector('recover')(state, 'mnemonic'),
//   password: formValueSelector('recover')(state, 'password') || '',
//   registering: selectors.auth.getRegistering(state)
// })

// const mapDispatchToProps = (dispatch) => ({
//   authActions: bindActionCreators(actions.auth, dispatch),
//   formActions: bindActionCreators(actions.form, dispatch)
// })

// type FormProps = {
//   busy: boolean
//   invalid: boolean
//   pristine: boolean
//   submitting: boolean
// }

export type StateProps = {
  step: number
}
// export type Props = ConnectedProps<typeof connector> & FormProps

// const connector = connect(mapStateToProps, mapDispatchToProps)
// const enhance = compose<any>(
//   reduxForm({
//     destroyOnUnmount: false,
//     form: 'recover'
//   }),
//   connector
// )

export default RecoveryPhraseContainer
