import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Create from './template'

class CreateContainer extends PureComponent {
  state = {
    create: '',
    uniqueEmail: true,
    codeSent: false
  }
  componentDidMount () {
    if (this.props.emailVerified) {
      // eslint-disable-next-line
      this.setState({ create: 'create_account' })
    } else {
      // eslint-disable-next-line
      this.setState({ create: 'verify_email' })
      this.props.securityCenterActions.updateEmail(this.props.email)
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.emailVerified && this.props.emailVerified) {
      // eslint-disable-next-line
      this.setState({ create: 'create_account' })
    }
    if (prevProps.signupError && !prevProps.emailVerified && this.props.emailVerified) {
      this.props.coinifyFrontendActions.coinifyClearSignupError()
    }
  }

  render () {
    const { handleSignup, email, signupError, ...rest } = this.props
    return (
      <Create
        handleSignup={handleSignup}
        email={email}
        signupError={signupError}
        country={this.props.country}
        updateCreate={step => this.setState({ create: step })}
        updateUniqueEmail={unique => this.setState({ uniqueEmail: unique })}
        updateCodeSent={sent => this.setState({ codeSent: sent })}
        {...this.state}
        {...rest}
      />
    )
  }
}

CreateContainer.propTypes = {
  emailVerified: PropTypes.number.isRequired,
  country: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(
  getData,
  mapDispatchToProps
)(CreateContainer)
