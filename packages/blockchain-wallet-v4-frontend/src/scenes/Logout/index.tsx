import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import Logout from './template'

class LogoutContainer extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = { secondsRemaining: 10 }
    this.onDeauthorizeBrowser = this.onDeauthorizeBrowser.bind(this)
    this.onGoToLogin = this.onGoToLogin.bind(this)
    this.tick = this.tick.bind(this)
  }

  componentDidMount() {
    // @ts-ignore
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    // @ts-ignore
    clearInterval(this.interval)
  }

  tick() {
    this.setState({
      secondsRemaining: this.state.secondsRemaining - 1
    })
    if (this.state.secondsRemaining <= 0) {
      this.props.authActions.logoutClearReduxStore()
    }
  }

  onGoToLogin() {
    this.props.authActions.logoutClearReduxStore()
  }

  onDeauthorizeBrowser() {
    this.props.authActions.deauthorizeBrowser()
  }

  render() {
    return (
      <Logout
        onDeauthorizeBrowser={this.onDeauthorizeBrowser}
        onGoToLogin={this.onGoToLogin}
        secondsRemaining={this.state.secondsRemaining}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

type State = {
  secondsRemaining: number
}

export default connector(LogoutContainer)
