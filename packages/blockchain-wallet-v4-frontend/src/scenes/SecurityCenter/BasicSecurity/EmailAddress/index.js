import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import { Analytics } from 'data/types'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EmailAddressContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      successToggled: false,
      updateToggled: false,
      verifyToggled: false
    }

    this.handleResend = this.handleResend.bind(this)
    this.handleVerifyClick = this.handleVerifyClick.bind(this)
    this.handleChangeEmailView = this.handleChangeEmailView.bind(this)
    this.handleEmailChangeCancel = this.handleEmailChangeCancel.bind(this)
    this.handleEmailChangeSubmit = this.handleEmailChangeSubmit.bind(this)
  }

  componentDidMount() {
    if (this.props.changeEmail) {
      this.handleChangeEmailView()
    }
  }

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate(prevProps) {
    const next = this.props.data.getOrElse({})
    const prev = prevProps.data.getOrElse({})
    if (next.verified && !prev.verified) {
      this.setState({
        successToggled: false,
        verifyToggled: false
      })
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  handleVerifyClick() {
    this.handleResend()
  }

  handleResend() {
    const { email } = this.props.data.getOrElse({})
    this.props.securityCenterActions.resendVerifyEmail(email, 'SECURITY')
  }

  handleChangeEmailView() {
    const { email } = this.props.data.getOrElse({})
    this.setState({
      isEditing: !this.state.isEditing
    })
    this.props.formActions.change('securityEmailAddress', 'changeEmail', email)
  }

  handleEmailChangeCancel() {
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  handleEmailChangeSubmit() {
    this.props.securityCenterActions.updateEmail(this.props.updatedEmail)
    this.props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_EMAIL_VERIFICATION_REQUESTED,
      properties: { origin: 'SECURITY' }
    })
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  render() {
    const { data, ...rest } = this.props

    return data.cata({
      Failure: (message) => <Error {...rest} message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />,
      Success: (value) => (
        <Success
          {...rest}
          uiState={this.state}
          data={value}
          handleVerifyClick={this.handleVerifyClick}
          handleResend={this.handleResend}
          handleChangeEmailView={this.handleChangeEmailView}
          handleEmailChangeCancel={this.handleEmailChangeCancel}
          handleEmailChangeSubmit={this.handleEmailChangeSubmit}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  code: formValueSelector('securityEmailAddress')(state, 'emailCode'),
  data: getData(state),
  updatedEmail: formValueSelector('securityEmailAddress')(state, 'changeEmail')
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EmailAddressContainer)
