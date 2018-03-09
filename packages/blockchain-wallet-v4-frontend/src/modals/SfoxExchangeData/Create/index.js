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

    this.handleSignup = this.handleSignup.bind(this)
  }

  componentDidMount () {
    if (this.props.emailVerified && this.props.smsVerified) this.props.updateUI({ create: 'create_account' })
    else if (this.props.emailVerified) this.props.updateUI({ create: 'change_mobile' })
    else this.props.updateUI({ create: 'enter_email_code' })
  }

  handleSignup (e) {
    e.preventDefault()
    this.props.sfoxFrontendActions.sfoxSignup()
  }

  render () {
    return <Create
      {...this.props}
      setBusyOff={this.setBusyOff}
      handleSignup={this.handleSignup}
    />
  }
}

CreateContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  sfoxFrontendActions: PropTypes.object,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  smsVerified: selectors.core.settings.getSmsVerified(state).data,
  emailVerified: selectors.core.settings.getEmailVerified(state).data
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { create: '', uniqueEmail: true } })
)

export default enhance(CreateContainer)
