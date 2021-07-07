import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector, getFormMeta, InjectedFormProps, reduxForm } from 'redux-form'

import { Form } from 'components/Form'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { RecoverFormType, RecoverSteps } from 'data/types'

import CloudRecovery from './CloudRecovery'
import RecoveryOptions from './RecoveryOptions'
import RecoveryPhrase from './RecoveryPhrase'
// import ResetAccount from './ResetAccount'

class RecoverWalletContainer extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  componentDidMount() {
    this.props.formActions.change('recover', 'step', RecoverSteps.RECOVERY_OPTIONS)
  }

  componentWillUnmount() {
    this.props.formActions.destroy('recover')
  }

  setStep = (step: RecoverSteps) => {
    this.props.formActions.change('recover', 'step', step)
  }

  render() {
    const { step } = this.props.formValues || RecoverSteps.RECOVERY_OPTIONS
    return (
      <Wrapper>
        <Form>
          {(() => {
            switch (step) {
              case RecoverSteps.RECOVERY_OPTIONS:
                return <RecoveryOptions {...this.props} setStep={this.setStep} />

              case RecoverSteps.CLOUD_RECOVERY:
                return <CloudRecovery {...this.props} setStep={this.setStep} />
              case RecoverSteps.RECOVERY_PHRASE:
                return <RecoveryPhrase {...this.props} setStep={this.setStep} />
              default:
                return <RecoveryOptions {...this.props} setStep={this.setStep} />
            }
          })()}
        </Form>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  cachedEmail: selectors.cache.getEmail(state),
  cachedGuid: selectors.cache.getStoredGuid(state),
  email: formValueSelector('recover')(state, 'email'),
  formMeta: getFormMeta('recover')(state),
  formValues: selectors.form.getFormValues('recover')(state) as RecoverFormType,
  kycReset: selectors.auth.getKycResetStatus(state),
  language: selectors.preferences.getLanguage(state),
  loginFormValues: selectors.form.getFormValues('login')(state),
  mnemonic: formValueSelector('recover')(state, 'mnemonic'),
  password: formValueSelector('recover')(state, 'password') || '',
  registering: selectors.auth.getRegistering(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

type FormProps = {
  busy: boolean
  invalid: boolean
  pristine: boolean
  setStep: (step: RecoverSteps) => void
  submitting: boolean
}

export type Props = ConnectedProps<typeof connector> & FormProps

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose<any>(
  reduxForm({
    destroyOnUnmount: false,
    form: 'recover'
  }),
  connector
)

export default enhance(RecoverWalletContainer)
