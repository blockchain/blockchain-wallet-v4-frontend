import { connect } from 'react-redux'
import { FiatType, RemoteDataType } from 'core/types'
import { getData } from './selectors'
import Loading from './template.loading'
import React from 'react'
import Success from './template.success'

export type SuccessStateType = {
  currency: FiatType
  priceChange: number
  priceChartTime: '1day'
  pricePercentageChange: number
}

type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

type Props = LinkStatePropsType

class CoinPerformance extends React.PureComponent<Props> {
  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success {...value} />,
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(CoinPerformance)
