import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { connect } from 'react-redux'

import { selectors } from 'data'
import ActivityList from './ActivityList'
import DidYouKnow from './DidYouKnow'
import PriceChart from './PriceChart'
import BalancesChartContainer from './BalancesChart'
import SfoxSignupBanner from './SfoxSignupBanner'
import ErrorBoundary from 'layouts/ErrorBoundary'

ReactHighcharts.Highcharts.setOptions({ lang: { thousandsSep: ',' } })

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  @media(max-width: 400px) { margin: 0 5px; }
  @media(min-width: 400px), (max-width: 992px) { margin: 0 10px; }
  @media(min-width: 992px) { margin: 0 30px; }
`
const ColumnWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  @media(min-width: 992px) { flex-direction: row; }
`
const Column = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  margin-top: 15px;
  box-sizing: border-box;
  @media (max-height: 800px), (max-width: 992px) {
    height: auto;
    display: block;
  }
`
const ColumnLeft = styled(Column)`
  padding: 0 10px 10px 0;
  @media(max-width: 992px) { padding: 0 }
`
const ColumnRight = styled(Column)`
  padding: 0 0 10px 0;
  @media(max-width: 992px) { padding-top: 15px; }
`

class Home extends React.PureComponent {
  render () {
    const { buySellKv } = this.props

    return (
      <ErrorBoundary>
        <Wrapper>
          { buySellKv.cata({ Success: () => <SfoxSignupBanner/>, Failure: () => <div/>, Loading: () => <div/>, NotAsked: () => <div/> }) }
          <ColumnWrapper>
            <ColumnLeft>
              <BalancesChartContainer/>
              <ActivityList/>
            </ColumnLeft>
            <ColumnRight>
              <PriceChart/>
              <DidYouKnow/>
            </ColumnRight>
          </ColumnWrapper>
        </Wrapper>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state) => ({
  buySellKv: selectors.core.kvStore.buySell.getMetadata(state)
})

export default connect(mapStateToProps)(Home)
