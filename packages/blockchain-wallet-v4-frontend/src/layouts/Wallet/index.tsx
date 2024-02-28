import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { getIsCoinDataLoaded } from '@core/redux/data/coins/selectors'
import { isAuthenticated } from 'data/auth/selectors'

import { COIN_APPROVAL_DATE } from './coinApprovalDates'
import Loading from './template.loading'
import WalletLayout from './WalletLayout'

const WalletLayoutContainer: FC<Props> = ({
  approvalDate,
  center,
  component: Component,
  computedMatch,
  hasUkBanner,
  hideMenu,
  path,
  removeContentPadding,
  ...rest
}: Props) => {
  document.title = 'Blockchain.com Wallet'

  const isUserAuthenticated = useSelector(isAuthenticated)
  const isCoinDataLoaded = useSelector(getIsCoinDataLoaded)

  // IMPORTANT: do not allow routes to load until window.coins is loaded
  if (!isCoinDataLoaded) return <Loading />

  if (!isUserAuthenticated) {
    return <Redirect to={{ pathname: '/login', state: { from: '' } }} />
  }

  const coin = computedMatch?.params.coin ?? ''

  const isValidRoute = !(path.includes('/transaction') && !window.coins[coin])

  if (!isValidRoute) {
    return <Redirect to={{ pathname: '/home', state: { from: '' } }} />
  }

  const showBannerForCoin = computedMatch?.path.startsWith('/coins/') && coin
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

type Props = {
  approvalDate?: string
  center?: boolean
  component: React.ComponentType<any>
  computedMatch?: {
    params: { coin?: string }
    path: string
  }
  exact?: boolean
  hasUkBanner?: boolean
  hideMenu?: boolean
  path: string
  removeContentPadding?: boolean
}

export default WalletLayoutContainer
