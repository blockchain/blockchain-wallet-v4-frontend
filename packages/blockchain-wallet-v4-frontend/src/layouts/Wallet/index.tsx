import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { selectors } from 'data'

import WalletLayout from './template'
import Loading from './template.loading'

const WalletLayoutContainer = ({
  coinViewV2,
  component: Component,
  computedMatch,
  isAuthenticated,
  isCoinDataLoaded,
  path,
  ...rest
}: Props) => {
  let isValidRoute = true
  let coin

  document.title = 'Blockchain.com Wallet'

  if (path.includes('/transactions')) {
    coin = computedMatch.params.coin
    if (!window.coins[coin]) isValidRoute = false
  }

  // IMPORTANT: do not allow routes to load until window.coins is loaded
  if (!isCoinDataLoaded) return <Loading />

  return !isAuthenticated ? (
    <Redirect to={{ pathname: '/login', state: { from: '' } }} />
  ) : isValidRoute ? (
    <Route
      path={path}
      render={(props) => (
        <WalletLayout coinViewV2={coinViewV2} location={props.location} coin={coin}>
          <Component computedMatch={computedMatch} {...rest} coin={coin} />
        </WalletLayout>
      )}
    />
  ) : (
    <Redirect to={{ pathname: '/home', state: { from: '' } }} />
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state),
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  coinViewV2?: boolean
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  path: string
}

export default connector(WalletLayoutContainer)
