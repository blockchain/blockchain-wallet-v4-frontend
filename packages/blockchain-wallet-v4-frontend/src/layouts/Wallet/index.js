import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import React from 'react'

import { selectors } from 'data'
import WalletLayout from './template'

class WalletLayoutContainer extends React.PureComponent {
  render () {
    const {
      isAuthenticated,
      path,
      computedMatch,
      component: Component,
      ...rest
    } = this.props

    return isAuthenticated ? (
      <Route
        path={path}
        render={props => (
          <WalletLayout location={props.location} coin={this.props.coin}>
            <Component computedMatch={computedMatch} {...rest} />
          </WalletLayout>
        )}
      />
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: '' } }} />
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

export default connect(mapStateToProps)(WalletLayoutContainer)
