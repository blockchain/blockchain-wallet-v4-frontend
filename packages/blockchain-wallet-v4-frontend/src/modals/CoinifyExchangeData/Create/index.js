import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Create from './template'

class CreateContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      create: '',
      uniqueEmail: true,
      codeSent: false
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount () {
    if (this.props.emailVerified) {
      this.props.setState({ create: 'create_account' })
    } else {
      this.props.setState({ create: 'enter_email_code' })
      this.props.securityCenterActions.sendConfirmationCodeEmail(
        this.props.oldEmail
      )
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.emailVerified && this.props.emailVerified) {
      this.props.setState({ create: 'create_account' })
    }
  }
  handleChange (key, value) {
    this.setState({
      key: value
    })
  }

  render () {
    const { handleSignup, oldEmail, signupError } = this.props
    return (
      <Create
        handleSignup={handleSignup}
        oldEmail={oldEmail}
        signupError={signupError}
        ui={this.state}
        updateUI={this.handleChange}
        country={this.props.country}
      />
    )
  }
}

CreateContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateContainer)
