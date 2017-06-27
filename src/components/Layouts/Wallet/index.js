import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import { selectors } from 'data'
import WalletLayout from './template.js'

const WalletLayoutContainer = ({component: Component, ...rest}) => {
  console.log(rest)
  return (
    <Route {...rest} render={props => (
    // rest.isAuthenticated
    // ? (
      <WalletLayout location={props.location}>
        <Component {...rest} />
      </WalletLayout>
      // )
      // : (
      //   <Redirect to={{ pathname: '/login', state: { from: matchProps.location } }} />
      // )
    )} />
  )
}

function mapStateToProps (state) {
  return {
    isAuthenticated: selectors.auth.getIsAuthenticated
  }
}

export default connect(mapStateToProps)(WalletLayoutContainer)
