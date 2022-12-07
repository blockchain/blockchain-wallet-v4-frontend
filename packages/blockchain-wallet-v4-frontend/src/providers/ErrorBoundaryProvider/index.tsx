import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { Analytics } from 'data/analytics/types'

import NewVersionAvailable from './newversion.template'
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

    this.props.analyticsActions.trackEvent({
      key: Analytics.CLIENT_ERROR,
      properties: {
        error: 'FATAL_ERROR',
        source: 'CLIENT',
        title: error.message
      }
    })
  }

  onSubmit = () => {
    this.setState({ error: null })
    if (this.props.isAuthenticated) {
      this.props.history.push('/home')
    } else {
      this.props.history.push('/login')
      // @ts-ignore
      window.location.reload(true)
    }
  }

  render() {
    if (this.state.error) {
      // Case to handle loading chunk error
      // when old version is cached after release
      if (this.state.error.toString().includes('ChunkLoadError:')) {
        return <NewVersionAvailable />
      }
      return <ErrorModal error={this.state.error} onSubmit={this.onSubmit} />
    }
    return this.props.children
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & { history: { push: (path: string) => void } }

export default withRouter(connector(ErrorBoundary))
