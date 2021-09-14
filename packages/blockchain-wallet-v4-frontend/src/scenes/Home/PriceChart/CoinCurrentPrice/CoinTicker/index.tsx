import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

import Loading from './template.loading'
import Success from './template.success'

const CoinTickerContainer = ({ data }: Props) => {
  return data.cata({
    Failure: () => null,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (value) => <Success {...value} />
  })
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  data: selectors.components.priceTicker.getData(ownProps.coin, state)
})

const connector = connect(mapStateToProps)

type OwnProps = {
  coin: CoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinTickerContainer)
