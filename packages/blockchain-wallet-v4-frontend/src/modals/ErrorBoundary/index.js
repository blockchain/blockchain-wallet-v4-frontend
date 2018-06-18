import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withRouter } from 'react-router-dom'

import modalEnhancer from 'providers/ModalEnhancer'
import ErrorBoundaryTemplate from './template'
import { actions, selectors } from 'data'

class ErrorBoundary extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.modalActions.closeModal()
    if (this.props.isAuthenticated) {
      this.props.history.push('/home')
    } else {
      this.props.history.push('/login')
      window.location.reload(true)
    }
  }

  render () {
    const { error, errorInfo } = this.props
    return <ErrorBoundaryTemplate error={error} errorInfo={errorInfo} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('ErrorBoundary'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default withRouter(enhance(ErrorBoundary))
