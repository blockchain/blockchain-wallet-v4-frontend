import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Login from './template.js'
import { actions } from 'data'

class LoginContainer extends React.Component {
  constructor () {
    super()
    this.state = {
      credentials: {
        guid: '',
        password: ''
      },
      accountIndex: '0'
    }

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onTrezor = this.onTrezor.bind(this)
  }

  onChange (event) {
    const credentials = this.state.credentials

    switch (event.target.name) {
      case 'guid':
        credentials.guid = event.target.value
        break
      case 'password':
        credentials.password = event.target.value
        break
    }

    this.setState({ credentials: credentials })
  }

  onClick () {
    this.props.actions.loginStart(this.state.credentials)
  }

  onTrezor () {
    this.props.coreActions.createTrezorWallet(this.state.accountIndex)
  }

  render () {
    return (
      <Login onChange={this.onChange} onClick={this.onClick} onTrezor={this.onTrezor} />
    )
  }
}

function mapStateToProps (state) {
  return {
    credentials: state.credentials
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.auth, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
