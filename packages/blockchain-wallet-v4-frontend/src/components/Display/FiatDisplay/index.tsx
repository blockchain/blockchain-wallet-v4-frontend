import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatDisplayContainer extends React.PureComponent<Props> {
  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Failure: () => <Error {...rest} userCurrency={this.props.userCurrency} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />,
      Success: (value) => <Success {...rest}>{value}</Success>
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin, ownProps.children, ownProps.currency, ownProps.rates),
  userCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const connector = connect(mapStateToProps)

type OwnProps = { coin: CoinType }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(FiatDisplayContainer)
