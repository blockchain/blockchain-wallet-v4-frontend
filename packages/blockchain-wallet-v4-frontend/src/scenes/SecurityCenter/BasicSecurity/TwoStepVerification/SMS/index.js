import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import { ModalName } from 'data/types'

import { getData } from './selectors'
import Sms from './template'

class SmsAuthContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      changeNumberToggled: false,
      successToggled: false,
      verifyMobileNumberStep: false
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
    this.setState((previousState) => ({
      ...previousState,
      changeNumberToggled: !previousState.changeNumberToggled
    }))
  }

  handleUpdate() {
    this.setState((previousState) => ({
      ...previousState,
      successToggled: !previousState.successToggled
    }))
  }

  handleClick() {
    this.props.modalActions.showModal(ModalName.TWO_STEP_SETUP_MODAL)
  }

  onSubmit() {
    const { smsNumber, smsVerified } = this.props.data.getOrElse({})

    if (this.state.changeNumberToggled || (!smsNumber && !smsVerified)) {
      this.props.securityCenterActions.sendMobileVerificationCode(this.props.mobileNumber)
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
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (value) => (
        <Sms
          data={value}
          handleClick={this.handleClick}
          onSubmit={this.onSubmit}
          goBack={goBack}
          changeMobileNumber={() => this.handleMount()}
          uiState={this.state}
          code={verificationCode}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  mobileNumber: formValueSelector('securitySms')(state, 'mobileNumber'),
  verificationCode: formValueSelector('securitySms')(state, 'verificationCode')
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SmsAuthContainer)
