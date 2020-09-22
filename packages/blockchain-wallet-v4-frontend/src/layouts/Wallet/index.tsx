import { connect, ConnectedProps } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import React from 'react'

import { CoinType } from 'core/types'
import { selectors } from 'data'
import WalletLayout from './template'

class WalletLayoutContainer extends React.PureComponent<Props> {
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

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  coin?: CoinType
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  isCoinErc20?: boolean
  path: string
}

export default connector(WalletLayoutContainer)
