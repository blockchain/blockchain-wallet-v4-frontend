import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import Create from './template'
import { actions, selectors } from 'data'
import ui from 'redux-ui'

class CreateContainer extends Component {
  constructor (props) {
    super(props)

    this.handleSignup = this.handleSignup.bind(this)
  }

  handleSignup () {
    console.log('handle signup', this.props)
  }

  render () {
    const { emailVerified, smsVerified, ui, smsNumber} = this.props
    return <Create
      emailVerification={emailVerified}
      smsVerified={smsVerified}
      handleSignup={this.handleSignup}
      ui={ui}
      smsNumber={smsNumber}

    />
  }
}

const mapStateToProps = (state) => ({
  // emailAddress: formValueSelector('sfoxCreate')(state, 'email'),
  // mobileNumber: formValueSelector('sfoxCreate')(state, 'phone'),
  email: selectors.core.settings.getEmail(state).data,
  emailVerified: selectors.core.settings.getEmailVerified(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data,
  smsVerified: selectors.core.settings.getSmsVerified(state).data,
})

const mapDispatchToProps = (dispatch) => ({
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { smsCodeSent: false } })
)

export default enhance(CreateContainer)
