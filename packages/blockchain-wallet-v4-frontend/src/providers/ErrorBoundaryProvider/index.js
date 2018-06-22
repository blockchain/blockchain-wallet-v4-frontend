import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import ErrorModal from './template'
import { selectors } from '../../data'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidCatch (error, info) {
    this.setState({
      error: error,
      errorInfo: info
    })
  }

  onSubmit () {
    this.setState({ error: null, errorInfo: null })
    if (this.props.isAuthenticated) {
      this.props.history.push('/home')
    } else {
      this.props.history.push('/login')
      window.location.reload(true)
    }
  }

  render () {
    if (this.state.error) {
      return <ErrorModal error={this.state.error} errorInfo={this.state.errorInfo} onSubmit={this.onSubmit} />
    }
    return this.props.children
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary))
