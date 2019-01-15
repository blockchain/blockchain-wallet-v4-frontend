import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import AcceptTerms from './template'

class AcceptTermsContainer extends Component {
  state = { busy: false, acceptedTerms: false }

  componentDidUpdate () {
    /* eslint-disable */
    if (this.props.signupError && this.state.busy) {
      this.setState({ busy: false })
      this.props.updateState({ uniqueEmail: false })
    }
    /* eslint-enable */
  }

  onSubmit = () => {
    this.setState({ busy: true })
    this.props.coinifyFrontendActions.coinifySignup(this.props.country)
  }

  render () {
    const {
      invalid,
      email,
      signupError,
      updateState,
      coinifyFrontendActions
    } = this.props
    const { coinifyClearSignupError } = coinifyFrontendActions

    return (
      <AcceptTerms
        busy={this.state.busy}
        email={email}
        invalid={invalid}
        onSubmit={this.onSubmit}
        signupError={signupError}
        updateState={updateState}
        editEmail={() => {
          this.props.updateState({ create: 'change_email' })
        }}
        clearError={() => coinifyClearSignupError()}
      />
    )
  }
}

AcceptTermsContainer.propTypes = {
  invalid: PropTypes.bool,
  email: PropTypes.string.isRequired,
  country: PropTypes.string
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(AcceptTermsContainer)
