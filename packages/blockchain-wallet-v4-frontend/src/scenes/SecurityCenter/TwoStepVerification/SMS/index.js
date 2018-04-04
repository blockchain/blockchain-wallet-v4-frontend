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
    this.onSubmit = this.onSubmit.bind(this)
    this.showChangeMobileNumber = this.showChangeMobileNumber.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (this.props.data.data.authType === 5 && prevProps.data.data.authType !== 5) {
      this.props.updateUI({ showSuccess: true })
      setTimeout(function () {
        this.props.reset()
        this.props.goBackOnSuccess()
      }, 1500)
    }
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  onSubmit (e) {
    e.preventDefault()
    if (this.props.ui.changeNumberToggled || (!this.props.data.data.smsNumber && !this.props.data.data.smsVerified)) {
      this.props.securityCenterActions.sendMobileVerificationCode(this.props.mobileNumber)
      this.props.updateUI({ changeNumberToggled: false })
    } else {
      this.props.securityCenterActions.verifyMobile(this.props.verificationCode)
    }
  }

  showChangeMobileNumber () {
    this.props.updateUI({ changeNumberToggled: !this.props.changeNumberToggled })
  }

  render () {
    const { data, ui, verificationCode, goBack, ...rest } = this.props

    return data.cata({
      Success: (value) => <SmsAuth
        data={value}
        handleClick={this.handleClick}
        onSubmit={this.onSubmit}
        goBack={goBack}
        changeMobileNumber={this.showChangeMobileNumber}
        ui={ui}
        code={verificationCode}
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
  ui({ key: 'Security_TwoFactor', state: { changeNumberToggled: false, verifyMobileNumberStep: false, showSuccess: false } })
)

export default enhance(SmsAuthContainer)
