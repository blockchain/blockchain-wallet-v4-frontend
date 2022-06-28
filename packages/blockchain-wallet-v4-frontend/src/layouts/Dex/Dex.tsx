import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { CoinfigType, CoinType } from '@core/types'
import { actions, selectors } from 'data'

import Loading from '../Auth/template.loading'
import DexTemplate from './DexTemplate'

const DexContainer = (props) => {
  const { coinsActions, component: Component, isCoinDataLoaded, pageTitle, path, ...rest } = props
  if (pageTitle) document.title = pageTitle

  useEffect(() => {
    if (isCoinDataLoaded) {
      coinsActions.fetchCoinsRates()
    }
  }, [coinsActions, isCoinDataLoaded])

  // IMPORTANT: do not allow routes to load until window.coins is loaded
  if (!isCoinDataLoaded) return <Loading />

  return (
    <Route
      path={path}
      render={() => (
        <DexTemplate {...props}>
          <Component computedMatch={rest.computedMatch} {...rest} />
        </DexTemplate>
      )}
    />
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state),
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state),
  pathname: selectors.router.getPathname(state)
})

const mapDispatchToProps = (dispatch) => ({
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  coin?: CoinType
  coinfig?: CoinfigType
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  pageTitle?: string
  path: string
}

export default connector(DexContainer)
