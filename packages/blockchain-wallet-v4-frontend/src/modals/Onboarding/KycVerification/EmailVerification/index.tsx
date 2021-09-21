import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { VerifyEmailFormValuesType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { VERIFY_EMAIL_FORM } = model.components.identityVerification

class VerifyEmail extends PureComponent<Props> {
  componentDidMount() {
    const { isEmailVerified, settingsActions } = this.props
    if (!isEmailVerified) {
      settingsActions.fetchSettings()
    }
  }

  handleSubmit = () => {
    const { formValues, identityVerificationActions, securityCenterActions, settingsActions } =
      this.props
    if (formValues) {
      identityVerificationActions.updateEmail(formValues.email)
      securityCenterActions.resendVerifyEmail(formValues.email)
      settingsActions.setEmail(formValues.email)
    }
  }

  onResendEmail = (email: string) => {
    const { securityCenterActions } = this.props
    securityCenterActions.resendVerifyEmail(email)
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <Success
          {...this.props}
          {...val}
          resendEmail={this.onResendEmail}
          onSubmit={this.handleSubmit}
        />
      )
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  formValues: selectors.form.getFormValues(VERIFY_EMAIL_FORM)(state) as
    | VerifyEmailFormValuesType
    | undefined,
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export default connector(VerifyEmail)
