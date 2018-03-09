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

    this.state = { busy: false }

    this.handleEmailInUse = this.handleEmailInUse.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.setBusyOff = this.setBusyOff.bind(this)
  }

  componentDidMount () {
    if (this.props.emailVerified && this.props.smsVerified) this.props.updateUI({ create: 'create_account' })
    else if (this.props.emailVerified) this.props.updateUI({ create: 'change_mobile' })
    else this.props.updateUI({ create: 'enter_email_code' })
  }

  handleEmailInUse () {
    this.setState({ uniqueEmail: false, busy: false })
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
      uniqueEmail={this.state.uniqueEmail}
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
  ui({ state: { create: '' } })
)

export default enhance(CreateContainer)
