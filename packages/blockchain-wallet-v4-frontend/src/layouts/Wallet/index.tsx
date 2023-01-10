import React, { FC, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  let isValidRoute = true
  let coin
  if (path.includes('/transactions')) {
    coin = computedMatch.params.coin
    if (!window.coins[coin]) isValidRoute = false
  }

  useEffect(() => {
    document.title = 'Blockchain.com Wallet'
  })

  useEffect(() => {
    if (!isAuthenticated || !isValidRoute) {
      navigate('/login')
    }
  })

  // IMPORTANT: do not allow routes to load until window.coins is loaded
  if (!isCoinDataLoaded) return <Loading />

  return (
    // <Route
    //   path={path}
    //   render={(props) => (
    //     <WalletLayout
    //       removeContentPadding={removeContentPadding}
    //       hideMenu={hideMenu}
    //       pathname={props.location.pathname}
    //     >
    //       <Component computedMatch={computedMatch} {...rest} coin={coin} />
    //     </WalletLayout>
    //   )}
    // />
    <></>
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
