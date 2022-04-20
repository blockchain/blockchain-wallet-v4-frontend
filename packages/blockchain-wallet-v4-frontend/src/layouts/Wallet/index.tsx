import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { CoinfigType, CoinType } from '@core/types'
import { selectors } from 'data'

import WalletLayout from './template'

const PAGE_TITLE = 'Blockchain.com Wallet'

class WalletLayoutContainer extends React.PureComponent<Props> {
  render() {
    const {
      coinViewV2,
      component: Component,
      computedMatch,
      isAuthenticated,
      path,
      ...rest
    } = this.props

    document.title = PAGE_TITLE

    return isAuthenticated ? (
      <Route
        path={path}
        render={(props) => (
          <WalletLayout coinViewV2={coinViewV2} location={props.location} coin={this.props.coin}>
            <Component computedMatch={computedMatch} {...rest} />
          </WalletLayout>
        )}
      />
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: '' } }} />
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  coin?: CoinType
  coinViewV2?: boolean
  coinfig?: CoinfigType
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  path: string
}

export default connector(WalletLayoutContainer)
