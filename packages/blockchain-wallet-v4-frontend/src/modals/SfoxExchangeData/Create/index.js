import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
// import { formValueSelector } from 'redux-form'
import Create from './template'
import { actions, selectors } from 'data'
import ui from 'redux-ui'

class CreateContainer extends Component {
  constructor (props) {
    super(props)

    this.state = { uniqueEmail: true, busy: false }

    this.handleEmailInUse = this.handleEmailInUse.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.doneChangingEmail = this.doneChangingEmail.bind(this)
    this.setBusyOff = this.setBusyOff.bind(this)
  }

  handleEmailInUse () {
    this.setState({ uniqueEmail: false, busy: false })
  }

  doneChangingEmail () {
    this.props.updateUI({ changingEmail: false })
  }

  setBusyOff () {
    this.setState({ busy: false })
  }

  handleSignup () {
    this.props.sfoxFrontendActions.sfoxSignup()
    this.setState({ busy: true })
  }

  render () {
    return <Create
      {...this.props}
      setBusyOff={this.setBusyOff}
      handleSignup={this.handleSignup}
      handleEmailInUse={this.handleEmailInUse}
      doneChangingEmail={this.doneChangingEmail}
    />
  }
}

CreateContainer.propTypes = {
  sfoxFrontendActions: PropTypes.object,
  emailVerified: PropTypes.number.isRequired,
  smsVerified: PropTypes.number.isRequired,
  ui: PropTypes.object,
  smsNumber: PropTypes.string,
  updateUI: PropTypes.function
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).data,
  emailVerified: selectors.core.settings.getEmailVerified(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data,
  smsVerified: selectors.core.settings.getSmsVerified(state).data
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { smsCodeSent: false, changingEmail: false } })
)

export default enhance(CreateContainer)
