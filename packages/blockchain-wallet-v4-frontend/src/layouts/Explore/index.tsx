import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'

import { CoinfigType, CoinType } from '@core/types'
import { selectors } from 'data'

import WalletLayout from '../Wallet'
import ExploreLayout from './template'

class ExploreLayoutContainer extends React.PureComponent<Props> {
  render() {
    const { component: Component, isAuthenticated, path, ...rest } = this.props

    return isAuthenticated ? (
      <WalletLayout path={path} exact component={Component} {...rest} />
    ) : (
      <Route
        path={path}
        render={() => (
          <ExploreLayout>
            <Component computedMatch={rest.computedMatch} {...rest} />
          </ExploreLayout>
        )}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  coin?: CoinType
  coinfig?: CoinfigType
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  path: string
}

export default connector(ExploreLayoutContainer)
