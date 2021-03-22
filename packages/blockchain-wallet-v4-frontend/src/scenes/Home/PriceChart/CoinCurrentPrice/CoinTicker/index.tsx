import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const CoinTickerContainer = ({ actions: { initialized }, data }: Props) => {
  useEffect(() => {
    initialized()
  }, [initialized])

  return data.cata({
    Success: value => <Success {...value} />,
    Failure: message => <Error>{message}</Error>,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />
  })
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  data: selectors.components.priceTicker.getData(ownProps.coin, state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceTicker, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinTickerContainer)
