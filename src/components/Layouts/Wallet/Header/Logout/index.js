import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Logout from './template.js'

class LogoutContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout () {
    this.props.authActions.logoutStart()
  }

  render () {
    return (
      <Logout handleLogout={this.handleLogout} />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(actions.auth, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(LogoutContainer)
