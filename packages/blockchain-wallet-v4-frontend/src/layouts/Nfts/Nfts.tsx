import React, { FC, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect, Route, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { CoinfigType, CoinType } from '@core/types'
import { actions, selectors } from 'data'

import Loading from '../Auth/template.loading'
import NftsTemplate from './NftsTemplate'

const NftsContainer = (props) => {
  const {
    component: Component,
    isAuthenticated,
    isCoinDataLoaded,
    pageTitle,
    path,
    ...rest
  } = props
  const isValidRoute = true

  if (pageTitle) document.title = pageTitle

  const doRefresh = (e) => {
    if (props.isAuthenticated) {
      const refreshButton = document.getElementById('nft-refresh')
      if (refreshButton) {
        refreshButton.click()
      }
      e.preventDefault()
      e.returnValue = ''
    }
  }

  useEffect(() => {
    if (isCoinDataLoaded) {
      props.coinsActions.fetchCoinsRates()
    }
    window.addEventListener('beforeunload', doRefresh)
    return () => {
      window.removeEventListener('beforeunload', doRefresh)
    }
  }, [isCoinDataLoaded])

  useEffect(() => {
    document.getElementsByTagName('html')[0].classList.add('nfts')

    return () => document.getElementsByTagName('html')[0].classList.remove('nfts')
  })

  // IMPORTANT: do not allow routes to load until window.coins is loaded
  if (!isCoinDataLoaded) return <Loading />
  return !isAuthenticated ? (
    <Redirect to={{ pathname: '/login', state: { from: '' } }} />
  ) : isValidRoute ? (
    <Route
      path={path}
      render={(props) => (
        <NftsTemplate {...props}>
          <Component computedMatch={rest.computedMatch} {...rest} />
        </NftsTemplate>
      )}
    />
  ) : (
    <Redirect to={{ pathname: '/home', state: { from: '' } }} />
  )
}

const mapStateToProps = (state) => ({
  ethAddress: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftSearch')(state) as { search: string },
  isAuthenticated: selectors.auth.isAuthenticated(state),
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state),
  isKycVerificationEnabled: selectors.custodial.isKycVerificationEnabled(state),
  isTestnet: selectors.components.nfts.getIsTestnet(state),
  pathname: selectors.router.getPathname(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  refreshActions: bindActionCreators(actions.components.refresh, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  sessionActions: bindActionCreators(actions.session, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
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

export default withRouter(connector(NftsContainer))
