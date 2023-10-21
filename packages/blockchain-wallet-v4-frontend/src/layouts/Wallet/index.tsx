import React, { FC } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { selectors } from 'data'

import { COIN_APPROVAL_DATE } from './coinApprovalDates'
import Loading from './template.loading'
import { WalletLayout } from './WalletLayout'

const WalletLayoutContainer: FC<Props> = ({
  approvalDate,
  center,
  component: Component,
  computedMatch,
  hasUkBanner,
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

  if (!isAuthenticated) {
    return <Redirect to={{ pathname: '/login', state: { from: '' } }} />
  }

  if (!isValidRoute) {
    return <Redirect to={{ pathname: '/home', state: { from: '' } }} />
  }

  const showBannerForCoin = computedMatch.path.startsWith('/coins/')
  const pageApprovalDate = showBannerForCoin ? COIN_APPROVAL_DATE[coin] : approvalDate
  return (
    <Route
      path={path}
      render={(props) => (
        <WalletLayout
          approvalDate={pageApprovalDate}
          removeContentPadding={removeContentPadding}
          hasUkBanner={hasUkBanner}
          hideMenu={hideMenu}
          center={center}
          pathname={props.location.pathname}
        >
          <Component computedMatch={computedMatch} {...rest} coin={coin} />
        </WalletLayout>
      )}
    />
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state),
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  approvalDate?: string
  center?: boolean
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  hasUkBanner?: boolean
  hideMenu?: boolean
  path: string
  removeContentPadding?: boolean
}

export default connector(WalletLayoutContainer)
