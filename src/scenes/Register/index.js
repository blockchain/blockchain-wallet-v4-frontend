import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Register from './template.js'
import { actions } from 'data'

class RegisterContainer extends React.Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    event.preventDefault()
     // TODO: Handle multilanguages
    this.props.alertActions.displaySuccess('Registration completed!')
  }

  render () {
    return (
      <Register handleClick={this.handleClick} />
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch)
  }
}

export default connect(undefined, mapDispatchToProps)(RegisterContainer)
