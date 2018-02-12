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
  }

  componentWillReceiveProps (nextProps) {
    const next = nextProps.data.data
    const prev = this.props.data.data
    if (next.smsVerified !== prev.smsVerified) {
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
    console.log('handleVerifyCode', this.props.verificationCode)
    this.props.securityCenterActions.verifyMobile(this.props.verificationCode)
  }

  handleGetCode () {
    console.log('handleGetCode', this.props.mobileNumber)
    this.props.securityCenterActions.sendMobileVerificationCode(this.props.mobileNumber)
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
  ui({ key: 'Security_TwoFactor', state: { updateToggled: false } })
)

export default enhance(SmsAuthContainer)
