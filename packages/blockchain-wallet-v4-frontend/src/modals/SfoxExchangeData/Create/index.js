import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import Create from './template'
import { actions, selectors } from 'data'
import ui from 'redux-ui'

class CreateContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleSignup = this.handleSignup.bind(this)
  }

  handleSignup () {
    this.props.sfoxFrontendActions.signup()
  }

  render () {
    const { emailVerified, smsVerified, ui, smsNumber } = this.props
    return <Create
      emailVerification={emailVerified}
      smsVerified={smsVerified}
      handleSignup={this.handleSignup}
      ui={ui}
      smsNumber={smsNumber}

    />
  }
}

CreateContainer.propTypes = {
  sfoxFrontendActions: PropTypes.object,
  emailVerified: PropTypes.number.isRequired,
  smsVerified: PropTypes.number.isRequired,
  ui: PropTypes.object,
  smsNumber: PropTypes.string
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).data,
  emailVerified: selectors.core.settings.getEmailVerified(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data,
  smsVerified: selectors.core.settings.getSmsVerified(state).data
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
