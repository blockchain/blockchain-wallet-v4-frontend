import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { CoinfigType, CoinType } from '@core/types'
import { actions, selectors } from 'data'

import Loading from '../Auth/template.loading'
import DexTemplate from './DexTemplate'

export type Props = {
  coin?: CoinType
  coinfig?: CoinfigType
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  pageTitle?: string
  path: string
}

const DexLayout = (props) => {
  const { component: Component, pageTitle, path, ...rest } = props
  if (pageTitle) document.title = pageTitle

  const dispatch = useDispatch()

  const isAuthenticated = useSelector(selectors.auth.isAuthenticated)
  const isCoinDataLoaded = useSelector(selectors.core.data.coins.getIsCoinDataLoaded)

  useEffect(() => {
    if (isCoinDataLoaded) {
      dispatch(actions.core.data.coins.fetchCoinsRates())
    }
  }, [isCoinDataLoaded])

  const isValidRoute = ['/dex'].includes(path)

  // IMPORTANT: do not allow routes to load until window.coins is loaded
  if (!isCoinDataLoaded) return <Loading />

  return !isAuthenticated ? (
    <Redirect to={{ pathname: '/login', state: { from: '' } }} />
  ) : isValidRoute ? (
    <Route
      path={path}
      render={() => (
        <DexTemplate {...props}>
          <Component {...rest} />
        </DexTemplate>
      )}
    />
  ) : (
    <Redirect to={{ pathname: '/home', state: { from: '' } }} />
  )
}

export default DexLayout
