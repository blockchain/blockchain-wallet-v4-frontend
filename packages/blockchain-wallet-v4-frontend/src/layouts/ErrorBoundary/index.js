import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PublicTemplate from './template.public'
import ModalTemplate from './template.modal'
import WalletTemplate from './template.wallet'
import { actions } from '../../data'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
    this.onGoToLogin = this.onGoToLogin.bind(this)
  }

  componentDidCatch (error, info) {
    this.setState({
      error: error,
      errorInfo: info
    })
  }

  componentWillUnmount () {
    this.setState({
      error: null,
      errorInfo: null
    })
  }

  onGoToLogin () {
    this.props.authActions.logoutClearReduxStore()
  }

  render () {
    const { publicLayout, modalLayout } = this.props
    if (this.state.error) {
      if (publicLayout) return <PublicTemplate publicLayout={publicLayout} onGoToLogin={this.onGoToLogin} error={this.state.error} errorInfo={this.state.errorInfo} />
      if (modalLayout) return <ModalTemplate error={this.state.error} errorInfo={this.state.errorInfo} />
      return <WalletTemplate error={this.state.error} errorInfo={this.state.errorInfo} />
    }
    return this.props.children
  }
}

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(null, mapDispatchToProps)(ErrorBoundary)
