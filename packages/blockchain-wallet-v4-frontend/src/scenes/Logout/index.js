import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Logout from './template.js'
import { actions } from 'data'

class LogoutContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onDeauthorizeBrowser = this.onDeauthorizeBrowser.bind(this)
  }

  onDeauthorizeBrowser () {
    this.props.authActions.deauthorizeBrowser()
  }

  render () {
    return <Logout onDeauthorizeBrowser={this.onDeauthorizeBrowser} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(null, mapDispatchToProps)(LogoutContainer)
