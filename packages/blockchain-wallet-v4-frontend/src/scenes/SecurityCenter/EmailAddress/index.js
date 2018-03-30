import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import ui from 'redux-ui'
import { formValueSelector } from 'redux-form'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EmailAddressContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleVerifyClick = this.handleVerifyClick.bind(this)
    this.handleSubmitVerification = this.handleSubmitVerification.bind(this)
    this.handleResend = this.handleResend.bind(this)
    this.handleChangeEmailView = this.handleChangeEmailView.bind(this)
    this.handleEmailChangeCancel = this.handleEmailChangeCancel.bind(this)
    this.handleEmailChangeSubmit = this.handleEmailChangeSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.data.verified && !this.props.data.data.verified) {
      this.props.updateUI({ successToggled: true })
      setTimeout(function () {
        nextProps.updateUI({ successToggled: false })
        nextProps.goBackOnSuccess ? nextProps.goBackOnSuccess() : nextProps.updateUI({ verifyToggled: false })
      }, 1500)
    }
  }

  handleVerifyClick () {
    this.props.handleEnable()
  }

  handleResend () {
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.data.data.email)
  }

  handleSubmitVerification (e) {
    e.preventDefault()
    this.props.securityCenterActions.verifyEmailCode(this.props.code)
  }

  handleChangeEmailView () {
    this.props.updateUI({ changeEmailToggled: true })
    const email = this.props.data.data.email
    this.props.formActions.change('securityEmailAddress', 'changeEmail', email)
  }

  handleEmailChangeCancel () {
    this.props.updateUI({ changeEmailToggled: false })
  }

  handleEmailChangeSubmit () {
    this.props.securityCenterActions.updateEmail(this.props.updatedEmail)
    this.props.updateUI({ changeEmailToggled: false, verifyToggled: true })
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest}
        data={value}
        handleVerifyClick={this.handleVerifyClick}
        handleResend={this.handleResend}
        handleSubmitVerification={this.handleSubmitVerification}
        handleChangeEmailView={this.handleChangeEmailView}
        handleEmailChangeCancel={this.handleEmailChangeCancel}
        handleEmailChangeSubmit={this.handleEmailChangeSubmit}
      />,
      Failure: (message) => <Error {...rest}
        message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  code: formValueSelector('securityEmailAddress')(state, 'emailCode'),
  updatedEmail: formValueSelector('securityEmailAddress')(state, 'changeEmail')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_EmailAddress', state: { updateToggled: false, verifyToggled: false, changeEmailToggled: false, successToggled: false } })
)

export default enhance(EmailAddressContainer)
