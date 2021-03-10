import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'

import { getData } from './selectors'
import Sms from './template'

class SmsAuthContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      changeNumberToggled: false,
      verifyMobileNumberStep: false,
      successToggled: false
    }
    this.handleMount = this.handleMount.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    const { smsNumber, smsVerified } = this.props.data.getOrElse({})
    if (smsNumber && smsNumber.length && !smsVerified) {
      this.props.securityCenterActions.sendMobileVerificationCode(smsNumber)
      this.handleMount()
    }
  }

  componentDidUpdate(prevProps) {
    const next = this.props.data.getOrElse({})
    const prev = prevProps.data.getOrElse({})
    if (next.authType !== prev.authType) {
      this.handleUpdate()
      this.props.triggerSuccess()
      this.props.goBackOnSuccess()
    }
  }
  handleMount() {
    this.setState({
      changeNumberToggled: !this.state.changeNumberToggled
    })
  }
  handleUpdate() {
    this.setState({
      successToggled: !this.state.successToggled
    })
  }

  handleClick() {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  onSubmit() {
    const { smsNumber, smsVerified } = this.props.data.getOrElse({})

    if (this.state.changeNumberToggled || (!smsNumber && !smsVerified)) {
      this.props.securityCenterActions.sendMobileVerificationCode(
        this.props.mobileNumber
      )
      this.setState({
        changeNumberToggled: false
      })
    } else {
      this.props.securityCenterActions.verifyMobile(this.props.verificationCode)
    }
  }

  render() {
    const { data, goBack, verificationCode } = this.props

    return data.cata({
      Success: value => (
        <Sms
          data={value}
          handleClick={this.handleClick}
          onSubmit={this.onSubmit}
          goBack={goBack}
          changeMobileNumber={() => this.handleMount()}
          uiState={this.state}
          code={verificationCode}
        />
      ),
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = state => ({
  mobileNumber: formValueSelector('securitySms')(state, 'mobileNumber'),
  verificationCode: formValueSelector('securitySms')(state, 'verificationCode'),
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(SmsAuthContainer)
