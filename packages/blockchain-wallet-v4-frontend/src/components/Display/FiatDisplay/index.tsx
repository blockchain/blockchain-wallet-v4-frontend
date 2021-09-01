import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatDisplayContainer extends React.PureComponent<Props> {
  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Failure: () => <Error {...rest} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />,
      Success: (value) => <Success {...rest}>{value}</Success>
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin, ownProps.children, ownProps.currency, ownProps.rates)
})

const connector = connect(mapStateToProps)

type OwnProps = { coin: CoinType }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(FiatDisplayContainer)
