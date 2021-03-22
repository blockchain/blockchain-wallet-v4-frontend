import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { CoinType , TimeRange } from 'blockchain-wallet-v4/src/types'
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
const CustomImage = styled(Image)`
  width: auto;
  margin-left: 50px;
  display: block;
`

const Loading = () => (
  <CustomImage name='chart-placeholder' width='450px' height='100px' />
)

export class CoinPerformanceContainer extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.priceChartActions.initialized(this.props.coin, TimeRange.WEEK)
  }

  componentDidUpdate(prevProps) {
    if (this.props.coin !== prevProps.coin) {
      this.props.priceChartActions.initialized(this.props.coin, TimeRange.WEEK)
    }
  }

  render() {
    const { currency } = this.props

    return this.props.data.cata({
      Success: value => (
        <Chart
          currency={currency}
          coin={value.coin}
          time={value.time}
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
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = dispatch => ({
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = { coin: CoinType }

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinPerformanceContainer)
