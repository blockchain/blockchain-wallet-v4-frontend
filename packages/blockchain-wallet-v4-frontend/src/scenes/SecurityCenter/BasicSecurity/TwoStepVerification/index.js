import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import { ModalName } from 'data/types'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class TwoStepVerificationContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      authMethod: '',
      authName: '',
      editing: false,
      pulse: false,
      success: false,
      verifyToggled: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.chooseMethod = this.chooseMethod.bind(this)
    this.handleDisableClick = this.handleDisableClick.bind(this)
    this.handleTwoFactorChange = this.handleTwoFactorChange.bind(this)
    this.pulseText = this.pulseText.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleGoBack = this.handleGoBack.bind(this)
    this.triggerSuccess = this.triggerSuccess.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const data = nextProps.data.getOrElse({})
    if (data.authType === 4) return { authName: 'Authenticator App' }
    if (data.authType === 5) return { authName: 'SMS Codes' }
    if (data.authType === 1 || data.authType === 2) {
      return { authName: 'Yubikey' }
    }
    return prevState
  }

  componentDidUpdate(prevProps) {
    const next = this.props.data.getOrElse({})
    const prev = prevProps.data.getOrElse({})
    if (next.authType > 0 && prev.authType === 0) {
      this.handleUpdate()
    }
  }

  handleUpdate() {
    this.setState((previousState) => ({
      ...previousState,
      editing: !previousState.editing
    }))
  }

  handleClick() {
    this.setState((previousState) => ({
      ...previousState,
      verifyToggled: !previousState.verifyToggled
    }))
  }

  handleDisableClick() {
    const next = this.props.data.getOrElse({})
    if (next.authType > 0) {
      this.props.modalActions.showModal(ModalName.CONFIRM_DISABLE_2FA, {
        authName: this.state.authName
      })
    } else {
      this.setState((previousState) => ({
        ...previousState,
        verifyToggled: !previousState.verifyToggled
      }))
    }
  }

  handleTwoFactorChange() {
    this.props.modalActions.showModal(ModalName.CONFIRM_DISABLE_2FA, {
      authName: this.state.authName
    })
    this.setState({
      editing: false
    })
  }

  handleGoBack() {
    this.setState({ authMethod: '', verifyToggled: false })
  }

  pulseText() {
    this.setState({ pulse: true })
    setTimeout(() => {
      this.setState({ pulse: false })
    }, 500)
  }

  chooseMethod(method) {
    const next = this.props.data.getOrElse({})
    if (next.smsVerified && method === 'sms') {
      this.props.securityCenterActions.setVerifiedMobileAsTwoFactor()
      this.setState({
        verifyToggled: true
      })
    } else {
      this.setState({
        authMethod: method
      })
    }
  }

  triggerSuccess() {
    this.setState({ success: true })
    setTimeout(() => {
      this.setState({ success: false })
    }, 1500)
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
          handleClick={this.handleClick}
          chooseMethod={this.chooseMethod}
          handleGoBack={this.handleGoBack}
          handleDisableClick={this.handleDisableClick}
          handleTwoFactorChange={this.handleTwoFactorChange}
          twoStepChoice={this.state.authMethod}
          authName={this.state.authName}
          editing={this.state.editing}
          pulseText={this.pulseText}
          pulse={this.state.pulse}
          triggerSuccess={() => {
            this.triggerSuccess()
            this.handleGoBack()
          }}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  mobileNumber: formValueSelector('twoStepVerification')(state, 'mobileNumber')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TwoStepVerificationContainer)
