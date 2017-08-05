import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, Redirect } from 'react-router-dom'

import { actions, selectors } from 'data'
import WalletLayout from './template.js'

class WalletLayoutContainer extends React.Component {
  render () {
    const { component: Component, ...rest } = this.props

    return (
      <Route {...rest} render={props => (rest.isAuthenticated
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
    isAuthenticated: selectors.auth.getIsAuthenticated
  }
}

export default connect(mapStateToProps)(WalletLayoutContainer)
