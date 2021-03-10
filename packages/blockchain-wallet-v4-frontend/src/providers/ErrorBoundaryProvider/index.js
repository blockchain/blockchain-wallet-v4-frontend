import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { selectors } from '../../data'
import ErrorModal from './template'

class ErrorBoundary extends React.Component {
  state = {
    error: null,
    errorInfo: null
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info
    })
  }

  onSubmit = () => {
    this.setState({ error: null, errorInfo: null })
    if (this.props.isAuthenticated) {
      this.props.history.push('/home')
    } else {
      this.props.history.push('/login')
      window.location.reload(true)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorModal
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onSubmit={this.onSubmit}
          {...this.props}
        />
      )
    }
    return this.props.children
  }
}

const mapStateToProps = state => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary)
)
