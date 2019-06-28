import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, model } from 'data'
import AcceptTerms from './template'

const { CHANGE } = model.components.coinify.REGISTER_STATES
const { EMAIL_STEPS } = model.components.identityVerification

class AcceptTermsContainer extends PureComponent {
  handleResend = () =>
    this.props.securityCenterActions.updateEmail(this.props.email)

  handleEditEmail = () => {
    this.props.updateCreate(CHANGE)
    this.props.idvActions.setEmailStep(EMAIL_STEPS.edit)
    this.props.coinifyActions.coinifyNotAsked()
  }

  onSubmit = () => this.props.coinifyActions.coinifySignup(this.props.country)

  render () {
    const {
      coinifyBusy,
      invalid,
      email,
      emailVerified,
      coinifyActions,
      create
    } = this.props
    const { coinifyNotAsked } = coinifyActions

    const { busy, error } = coinifyBusy.cata({
      Success: () => ({ busy: false }),
      Failure: error => ({ busy: false, error }),
      Loading: () => ({ busy: true }),
      NotAsked: () => ({ busy: false })
    })

    return (
      <AcceptTerms
        busy={busy}
        email={email}
        emailVerified={emailVerified}
        invalid={invalid}
        onSubmit={this.onSubmit}
        signupError={error}
        editEmail={this.handleEditEmail}
        clearError={coinifyNotAsked}
        create={create}
        handleResend={this.handleResend}
      />
    )
  }
}

AcceptTermsContainer.propTypes = {
  invalid: PropTypes.bool,
  email: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({
  idvActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

export default connect(
  null,
  mapDispatchToProps
)(AcceptTermsContainer)
