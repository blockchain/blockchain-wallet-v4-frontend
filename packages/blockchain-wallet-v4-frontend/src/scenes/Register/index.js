import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Register from './template.js'
import { actions, selectors } from 'data'

class RegisterContainer extends React.PureComponent {
  constructor () {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const { email, password } = this.props
    this.props.authActions.register(email, password)
  }

  render () {
    const { data } = this.props
    let busy = data.cata({ Success: () => false, Failure: () => false, Loading: () => true, NotAsked: () => false })

    return (
      <Register onSubmit={this.onSubmit} busy={busy} />
    )
  }
}

const mapStateToProps = (state) => ({
  data: selectors.auth.getRegistering(state),
  email: formValueSelector('register')(state, 'email'),
  password: formValueSelector('register')(state, 'password')
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer)
