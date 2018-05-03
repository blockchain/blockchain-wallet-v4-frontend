import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'

import { getData } from './selectors'
import AcceptTerms from './template'

class AcceptTermsContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      busy: false,
      acceptedTerms: false
    }
    this.handleSignup = this.handleSignup.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.signupError) {
      this.setState({ busy: false })
      this.props.updateUI({ uniqueEmail: false })
    }
  }

  handleSignup (e) {
    e.preventDefault()
    this.setState({ busy: true })
    this.props.coinifyFrontendActions.coinifySignup()
  }

  render () {
    const { busy } = this.state
    const { invalid, email, signupError, updateUI } = this.props

    return <AcceptTerms
      busy={busy}
      email={email}
      invalid={invalid}
      onSubmit={this.handleSignup}
      signupError={signupError}
      updateUI={updateUI} />
  }
}

AcceptTermsContainer.propTypes = {
  invalid: PropTypes.bool,
  updateUI: PropTypes.function,
  email: PropTypes.string.isRequired
}

const mapStateToProps = (state) => getData(state)

const mapDispatchToProps = (dispatch) => ({
  coinifyFrontendActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(AcceptTermsContainer)
