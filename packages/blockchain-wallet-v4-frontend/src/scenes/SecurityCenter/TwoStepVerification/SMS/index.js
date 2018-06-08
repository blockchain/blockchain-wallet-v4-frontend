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

class SmsAuthContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    const { smsVerified, smsNumber } = this.props.data.getOrElse({})
    if ((smsNumber && smsNumber.length) && !smsVerified) {
      this.props.securityCenterActions.sendMobileVerificationCode(smsNumber)
      this.props.updateUI({ changeNumberToggled: false })
    }
  }

  componentDidUpdate (prevProps) {
    const next = this.props.data.getOrElse({})
    const prev = prevProps.data.getOrElse({})
    if (next.authType !== prev.authType) {
      this.props.updateUI({ successToggled: true })
      this.props.triggerSuccess()
      setTimeout(() => {
        this.props.handleGoBack()
        this.props.goBackOnSuccess()
      }, 1500)
    }
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  onSubmit (e) {
    e.preventDefault()
    const { smsNumber, smsVerified } = this.props.data.getOrElse({})
    if (this.props.ui.changeNumberToggled || (!smsNumber && !smsVerified)) {
      this.props.securityCenterActions.sendMobileVerificationCode(this.props.mobileNumber)
      this.props.updateUI({ changeNumberToggled: false })
    } else {
      this.props.securityCenterActions.verifyMobile(this.props.verificationCode)
    }
  }

  render () {
    const { data, ui, verificationCode, goBack, ...rest } = this.props

    return data.cata({
      Success: (value) => <SmsAuth
        data={value}
        handleClick={this.handleClick}
        onSubmit={this.onSubmit}
        goBack={goBack}
        changeMobileNumber={() => this.props.updateUI({ changeNumberToggled: !this.props.changeNumberToggled })}
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
  ui({ key: 'Security_TwoFactor', state: { changeNumberToggled: false, verifyMobileNumberStep: false, successToggled: false } })
)

export default enhance(SmsAuthContainer)
