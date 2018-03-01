import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import Create from './template'
import { actions, selectors } from 'data'

class CreateContainer extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    if (this.props.email) {
      this.props.formActions.change('sfoxCreate', 'email', this.props.email)
    }
    if (this.props.smsNumber) {
      this.props.formActions.change('sfoxCreate', 'mobile', this.props.smsNumber)
    }
  }

  handleSubmit () {
    const { emailAddress, mobileNumber } = this.props

    console.log('handle submit', emailAddress, mobileNumber)

    this.props.sfoxFrontendActions.signup(emailAddress, mobileNumber)
  }

  render () {
    const { emailVerified, smsVerified } = this.props
    return <Create
      emailVerification={emailVerified}
      smsVerified={smsVerified}
      handleSubmit={this.handleSubmit}
    />
  }
}

const mapStateToProps = (state) => ({
  emailAddress: formValueSelector('sfoxCreate')(state, 'email'),
  mobileNumber: formValueSelector('sfoxCreate')(state, 'phone'),
  email: selectors.core.settings.getEmail(state).data,
  emailVerified: selectors.core.settings.getEmailVerified(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data,
  smsVerified: selectors.core.settings.getSmsVerified(state).data
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateContainer)
