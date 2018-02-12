import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import SmsAuth from './template.success'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import ui from 'redux-ui'
import { formValueSelector } from 'redux-form'

class SmsAuthContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleVerifyCode = this.handleVerifyCode.bind(this)
    this.handleGetCode = this.handleGetCode.bind(this)
    this.showChangeMobileNumber = this.showChangeMobileNumber.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const next = nextProps.data.data
    const prev = this.props.data.data
    if (next.smsVerified !== prev.smsVerified && next.smsNumber === prev.smsNumber) {
      setTimeout(function () {
        nextProps.goBack()
      }, 1500)
    }
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  handleVerifyCode (e) {
    e.preventDefault()
    this.props.securityCenterActions.verifyMobile(this.props.verificationCode)
  }

  handleGetCode () {
    this.props.securityCenterActions.sendMobileVerificationCode(this.props.mobileNumber)
  }

  showChangeMobileNumber () {
    this.props.updateUI({ changeNumberToggled: !this.props.changeNumberToggled })
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <SmsAuth
        data={value}
        handleClick={this.handleClick}
        handleVerifyCode={this.handleVerifyCode}
        goBack={this.props.goBack}
        handleGetCode={this.handleGetCode}
        changeMobileNumber={this.showChangeMobileNumber}
        {...rest}
      />,
      Failure: (message) => <Error {...rest}
        message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  mobileNumber: formValueSelector('securitySms')(state, 'mobileNumber'),
  verificationCode: formValueSelector('securitySms')(state, 'verificationCode'),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_TwoFactor', state: { changeNumberToggled: false } })
)

export default enhance(SmsAuthContainer)
