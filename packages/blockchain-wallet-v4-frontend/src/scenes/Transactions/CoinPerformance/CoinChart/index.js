import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { Image, Text } from 'blockchain-info-components'
import { toUpper } from 'ramda'
import Chart from './template'
import React from 'react'
import styled from 'styled-components'

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
  flex: 1;
`

const Loading = () => (
  <CustomImage name='chart-placeholder' width='450px' height='100px' />
)

export class CoinPerformanceContainer extends React.PureComponent {
  componentDidMount () {
    this.props.priceChartActions.initialized(toUpper(this.props.coin), '1week')
  }

  componentDidUpdate (prevProps) {
    if (this.props.coin !== prevProps.coin) {
      this.props.priceChartActions.initialized(
        toUpper(this.props.coin),
        '1week'
      )
    }
  }

  render () {
    const { currencySymbol } = this.props

    return this.props.data.cata({
      Success: value => (
        <Chart
          currencySymbol={currencySymbol}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinPerformanceContainer)
