import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import Template from './template'
import { actions } from 'data'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
      routingKey: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location.key !== this.state.routingKey) {
      this.setState({
        error: null,
        errorInfo: null,
        routingKey: null
      })
    }
  }

  componentDidCatch (eName, eInfo) {
    const error = {
      error: eName,
      errorInfo: eInfo,
      routingKey: this.props.location.key
    }
    this.setState(error)
    this.props.logActions.logErrorMessage('scenes/ErrorBoundary', 'componentDidCatch', error)
  }

  render () {
    if (this.state.error && this.props.location.key === this.state.routingKey) {
      return <Template error={this.state.error} errorInfo={this.state.errorInfo} />
    }
    return this.props.children
  }
}

const mapDispatchToProps = (dispatch) => ({
  logActions: bindActionCreators(actions.logs, dispatch)
})

export default withRouter(connect(null, mapDispatchToProps)(ErrorBoundary))
