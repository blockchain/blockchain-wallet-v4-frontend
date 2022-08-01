import React, { FC } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { selectors } from 'data'

import Loading from './template.loading'
import { WalletLayout } from './WalletLayout'

const WalletLayoutContainer: FC<Props> = ({
  center,
  component: Component,
  computedMatch,
  hideMenu,
  isAuthenticated,
  isCoinDataLoaded,
  path,
  removeContentPadding,
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
        <WalletLayout
          removeContentPadding={removeContentPadding}
          hideMenu={hideMenu}
          center={center}
          pathname={props.location.pathname}
        >
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
  center?: boolean
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  hideMenu?: boolean
  path: string
  removeContentPadding?: boolean
}

export default connector(WalletLayoutContainer)
