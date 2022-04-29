import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { CoinfigType, CoinType } from '@core/types'
import { actions, selectors } from 'data'

import NftsTemplate from './NftsTemplate'

class NftsContainer extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.coinsActions.fetchCoinsRates()
  }

  render() {
    const { component: Component, pageTitle, path, ...rest } = this.props
    if (pageTitle) document.title = pageTitle

    return (
      <Route
        path={path}
        render={() => (
          <NftsTemplate {...this.props}>
            <Component computedMatch={rest.computedMatch} {...rest} />
          </NftsTemplate>
        )}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  ethAddress: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftSearch')(state) as { search: string },
  isAuthenticated: selectors.auth.isAuthenticated(state),
  pathname: selectors.router.getPathname(state)
})

const mapDispatchToProps = (dispatch) => ({
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
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
