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
    this.handleGetCode = this.handleGetCode.bind(this)
    this.showChangeMobileNumber = this.showChangeMobileNumber.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const next = nextProps.data.data
    const prev = this.props.data.data
    if (next.authType !== prev.authType) {
      setTimeout(function () {
        nextProps.goBack()
      }, 2000)
    }
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.securityCenterActions.verifyMobileCode(this.props.verificationCode)
  }

  handleGetCode () {
    this.props.securityCenterActions.sendMobileVerificationCode(this.props.mobileNumber)
    this.props.updateUI({ changeNumberToggled: false })
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
        handleGetCode={this.handleGetCode}
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
  ui({ key: 'Security_TwoFactor', state: { changeNumberToggled: false, verifyMobileNumberStep: false } })
)

export default enhance(SmsAuthContainer)
