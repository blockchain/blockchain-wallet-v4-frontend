import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Logout from './template.js'
import { actions } from 'data'

class LogoutContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { secondsRemaining: 10 }
    this.onDeauthorizeBrowser = this.onDeauthorizeBrowser.bind(this)
    this.tick = this.tick.bind(this)
  }

  componentDidMount () {
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  tick () {
    this.setState({
      secondsRemaining: this.state.secondsRemaining - 1
    })
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval)
      this.props.routerActions.push('/login')
    }
  }

  onDeauthorizeBrowser () {
    this.props.authActions.deauthorizeBrowser()
  }

  render () {
    return <Logout onDeauthorizeBrowser={this.onDeauthorizeBrowser} secondsRemaining={this.state.secondsRemaining} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(null, mapDispatchToProps)(LogoutContainer)
