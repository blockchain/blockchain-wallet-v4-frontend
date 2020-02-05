import { connect } from 'react-redux'
import { getData } from './selectors'
import { SkeletonRectangle } from 'blockchain-info-components'
import CoinPrices from './template'
import React from 'react'
import styled from 'styled-components'

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Loading = () => (
  <LoadingWrapper>
    <SkeletonRectangle width='100px' height='20px' />
    <SkeletonRectangle width='100px' height='16px' />
    <SkeletonRectangle width='100px' height='16px' />
  </LoadingWrapper>
)

class CoinPricesContainer extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <CoinPrices {...value} />,
      Failure: () => <Loading />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(CoinPricesContainer)
