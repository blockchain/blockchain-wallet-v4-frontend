import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import ui from 'redux-ui'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { formValueSelector } from 'redux-form'

class TwoStepVerificationContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.chooseMethod = this.chooseMethod.bind(this)
    this.handleDisableClick = this.handleDisableClick.bind(this)
    this.handleTwoFactorChange = this.handleTwoFactorChange.bind(this)
    this.pulseText = this.pulseText.bind(this)

    this.state = { authName: '', pulse: false }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const data = nextProps.data.data
    if (data.authType === 4) return { authName: 'Authenticator App' }
    if (data.authType === 5) return { authName: 'SMS Codes' }
    if (data.authType === 1 || data.authType === 2) return { authName: 'Yubikey' }
    return prevState
  }

  componentDidUpdate (prevProps) {
    if (this.props.data.data.authType > 0 && prevProps.data.data.authType === 0) this.props.updateUI({ editing: true })
  }

  handleClick () {
    this.props.updateUI({ verifyToggled: true })
    this.props.handleEnable()
  }

  handleDisableClick () {
    if (this.props.data.data.authType > 0) this.props.modalActions.showModal('ConfirmDisable2FA', { authName: this.state.authName })
    else this.props.updateUI({ verifyToggled: !this.props.ui.verifyToggled, editing: true })
  }

  chooseMethod (method) {
    if (this.props.data.data.smsVerified && method === 'sms') {
      this.props.securityCenterActions.setVerifiedMobileAsTwoFactor()
      this.props.updateUI({ verifyToggled: true })
    } else {
      this.props.updateUI({ authMethod: method })
    }
  }

  handleDisableTwoStep () {
    this.props.securityCenterActions.disableTwoStep()
    this.setState({ authName: '' })
  }

  handleTwoFactorChange () {
    this.props.modalActions.showModal('ConfirmDisable2FA', { authName: this.state.authName })
    this.props.updateUI({ editing: false })
  }

  pulseText () {
    this.setState({ pulse: true })
    setTimeout(() => { this.setState({ pulse: false }) }, 500)
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest}
        data={value}
        handleClick={this.handleClick}
        chooseMethod={this.chooseMethod}
        handleGoBack={() => this.props.updateUI({ authMethod: '', verifyToggled: false })}
        handleDisableClick={this.handleDisableClick}
        handleTwoFactorChange={this.handleTwoFactorChange}
        twoStepChoice={this.props.ui.authMethod}
        authName={this.state.authName}
        editing={this.props.ui.editing}
        pulseText={this.pulseText}
        pulse={this.state.pulse}
        triggerSuccess={() => { this.props.updateUI({ success: true }); setTimeout(() => { this.props.updateUI({ success: false }) }, 1500) }}
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
  mobileNumber: formValueSelector('twoStepVerification')(state, 'mobileNumber')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_TwoStep', state: { verifyToggled: false, editing: false, authMethod: '', success: false } })
)

export default enhance(TwoStepVerificationContainer)
