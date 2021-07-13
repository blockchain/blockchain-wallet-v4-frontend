import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { pathOr } from 'ramda'
import { bindActionCreators } from 'redux'

import { TimeRange } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Chart from './template.success'

const ChartContainer = (props: Props) => {
  useEffect(() => {
    const coin = pathOr('BTC', ['cache', 'coin'], props)
    const time = pathOr(TimeRange.MONTH, ['cache', 'time'], props) as TimeRange
    props.priceChartActions.initialized(coin, time)
  }, [props.cache.coin, props.cache.time])

  return props.data.cata({
    Success: value => (
      <Chart currency={props.currency} coin={value.coin} data={value.data} />
    ),
    Failure: message => <Error>{message}</Error>,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />
  })
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(ChartContainer)
