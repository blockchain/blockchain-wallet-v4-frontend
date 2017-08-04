import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import { selectors } from 'data'
import WalletLayout from './template.js'

class WalletLayoutContainer extends React.Component {
  render () {
    const { component: Component, isAuthenticated, ...rest } = this.props

    return (
      <Route {...rest} render={props => (isAuthenticated
      ? (
        <WalletLayout location={props.location}>
          <Component {...rest} />
        </WalletLayout>
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      )} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: selectors.auth.getIsAuthenticated(state)
  }
}

export default connect(mapStateToProps)(WalletLayoutContainer)
