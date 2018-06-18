import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

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
      this.props.modalActions.showModal('ErrorBoundary', { error: this.state.error, errorInfo: this.state.errorInfo })
      return <div/>
    }
    return this.props.children
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(ErrorBoundary)
