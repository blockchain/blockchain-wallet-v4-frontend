import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import ui from 'redux-ui'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
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
  }

  handleVerifyClick () {
    this.props.updateUI({ verifyToggled: !this.props.ui.verifyToggled })
  }

  handleResend () {
    console.log('handleResend', this.props.data)
    this.props.securityCenterActions.sendConfirmationCodeEmail(this.props.data.data.email)
  }

  handleSubmitVerification () {
    console.log('handleSUbmitVerification', this.props)
    this.props.securityCenterActions.verifyEmailCode(this.props.code)
  }

  handleChangeEmailView () {
    this.props.updateUI({ changeEmailToggled: !this.props.ui.changeEmailToggled })
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
  code: formValueSelector('securityEmailAddress')(state, 'emailCode')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_EmailAddress', state: { updateToggled: false, verifyToggled: false, changeEmailToggled: false } })
)

export default enhance(EmailAddressContainer)
