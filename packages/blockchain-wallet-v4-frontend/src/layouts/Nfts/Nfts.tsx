import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { CoinfigType, CoinType } from '@core/types'
import { actions, selectors } from 'data'

import Loading from '../Auth/template.loading'
import NftsTemplate from './NftsTemplate'

const NftsContainer = (props) => {
  const { component: Component, isCoinDataLoaded, pageTitle, path, ...rest } = props
  if (pageTitle) document.title = pageTitle

  const doRefresh = (e) => {
    if (props.isAuthenticated) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', doRefresh)
    return () => {
      window.removeEventListener('beforeunload', doRefresh)
    }
  })

  // IMPORTANT: do not allow routes to load until window.coins is loaded
  if (!isCoinDataLoaded) return <Loading />

  return (
    <Route
      path={path}
      render={() => (
        <NftsTemplate {...props}>
          <Component computedMatch={rest.computedMatch} {...rest} />
        </NftsTemplate>
      )}
    />
  )
}

const mapStateToProps = (state) => ({
  ethAddress: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftSearch')(state) as { search: string },
  isAuthenticated: selectors.auth.isAuthenticated(state),
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state),
  pathname: selectors.router.getPathname(state)
})

const mapDispatchToProps = (dispatch) => ({
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
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

export default connector(NftsContainer)
