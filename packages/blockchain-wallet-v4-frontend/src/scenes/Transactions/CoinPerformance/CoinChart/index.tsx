import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { CoinType, TimeRange } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'

import { getData } from './selectors'
import Chart from './template'

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`

const CoinPerformanceContainer = ({
  coin,
  currency,
  data,
  height,
  priceChartActions,
  width
}: Props) => {
  useEffect(() => {
    priceChartActions.initialized(coin, TimeRange.WEEK)
  }, [coin])

  return data.cata({
    Success: value => (
      <Chart
        width={width}
        height={height}
        currency={currency}
        coin={value.coin}
        data={value.data}
      />
    ),
    Failure: error => (
      <ErrorWrapper>
        <Text size='12px' weight={400} color='red600'>
          {error}
        </Text>
      </ErrorWrapper>
    ),
    Loading: () => <></>,
    NotAsked: () => <></>
  })
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = dispatch => ({
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = { coin: CoinType, height: number; width: number; }

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinPerformanceContainer)
