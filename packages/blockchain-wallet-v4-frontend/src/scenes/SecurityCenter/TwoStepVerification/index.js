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

class TwoStepVerificationContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.chooseMethod = this.chooseMethod.bind(this)
    this.handleGoBack = this.handleGoBack.bind(this)
    this.handleChangeNumber = this.handleChangeNumber.bind(this)
    this.cancelMobileChange = this.cancelMobileChange.bind(this)
    this.submitMobileChange = this.submitMobileChange.bind(this)

    this.state = { authMethod: '', authName: '' }
  }
  componentWillMount () {
    if (this.props.data.data.authType === 4) this.setState({ authName: 'Authenticator App' })
    if (this.props.data.data.authType === 1) this.setState({ authName: 'Yubikey' })
  }

  handleClick () {
    this.props.updateUI({ verifyToggled: !this.props.ui.verifyToggled })
  }

  chooseMethod (method) {
    this.setState({ authMethod: method })
  }

  handleGoBack () {
    this.setState({ authMethod: '' })
  }

  handleChangeNumber () {
    this.props.updateUI({ changeNumberToggled: !this.props.ui.changeNumberToggled })
  }

  cancelMobileChange () {
    this.props.updateUI({ changeNumberToggled: false })
  }

  submitMobileChange () {
    this.props.securityCenterActions.sendMobileVerificationCode(this.props.mobileNumber)
    this.setState({ authMethod: 'sms' })
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest}
        data={value}
        handleClick={this.handleClick}
        chooseMethod={this.chooseMethod}
        twoStepChoice={this.state.authMethod}
        handleGoBack={this.handleGoBack}
        handleChangeNumber={this.handleChangeNumber}
        cancelMobileChange={this.cancelMobileChange}
        submitMobileChange={this.submitMobileChange}
        authName={this.state.authName}
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
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_TwoStep', state: { verifyToggled: false, changeNumberToggled: false } })
)

export default enhance(TwoStepVerificationContainer)
