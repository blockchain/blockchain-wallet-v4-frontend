import React from 'react'

import Template from './template'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
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

  render () {
    if (this.state.error) {
      return <Template error={this.state.error} errorInfo={this.state.errorInfo} />
    }
    return this.props.children
  }
}

export default ErrorBoundary
