import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import ErrorModal from './template'

class ErrorBoundary extends React.Component<Props, { error: null | TypeError }> {
  constructor(props) {
    super(props)
    this.state = {
      error: null
    }
  }

  componentDidCatch(error) {
    this.setState({
      error
    })
  }

  onSubmit = () => {
    this.setState({ error: null })
    if (this.props.isAuthenticated) {
      this.props.history.push('/home')
    } else {
      this.props.history.push('/login')
      window.location.reload(true)
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorModal error={this.state.error} onSubmit={this.onSubmit} />
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

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & { history: { push: (path: string) => void } }

export default withRouter(connector(ErrorBoundary))
