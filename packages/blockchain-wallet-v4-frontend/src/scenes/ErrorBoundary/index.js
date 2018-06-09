import React from 'react'

import Template from './template'

class ErrorBoundary extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
      pathWithError: null
    }
  }

  componentDidCatch (error, errorInfo) {
    // Display fallback UI
    this.setState({
      error: error,
      errorInfo: errorInfo,
      pathWithError: this.props.currentPath
    })
    // TODO: log the error to redux logger
    // console.info(error, errorInfo)
  }

  componentWillUnmount () {
    // TODO: figure out solution to this route always being flagged as error now...
  }

  render () {
    if (this.state.errorInfo && this.props.currentPath === this.state.pathWithError) {
      return <Template error={this.state.error} errorInfo={this.state.errorInfo} />
    }
    return this.props.children
  }
}

export default ErrorBoundary
