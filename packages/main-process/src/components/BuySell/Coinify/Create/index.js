import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import Create from './template'

const { CHANGE, CREATE, VERIFY } = model.components.coinify.REGISTER_STATES

class CreateContainer extends PureComponent {
  state = {
    create: this.props.emailVerified ? CREATE : VERIFY,
    uniqueEmail: true,
    codeSent: false
  }
  componentDidMount () {
    if (!this.props.emailVerified) this.updateCreate(CHANGE)
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.emailVerified && this.props.emailVerified) {
      this.updateCreate(CREATE)
      this.props.coinifyFrontendActions.coinifyNotAsked()
    }
  }

  updateCreate (step) {
    this.setState({ create: step })
  }

  render () {
    const { handleSignup, email, signupError, ...rest } = this.props
    return (
      <Create
        handleSignup={handleSignup}
        email={email}
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
  coinifyFrontendActions: bindActionCreators(
    actions.components.coinify,
    dispatch
  ),
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
