import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'

import ActivityList from './ActivityList'
import DidYouKnow from './DidYouKnow'
import PriceChart from './PriceChart'
import BalancesChartContainer from './BalancesChart'
import ExchangeStepper from './ExchangeStepper'

ReactHighcharts.Highcharts.setOptions({ lang: { thousandsSep: ',' } })

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 30px;
`
const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 15px 0;
`
const Column = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  @media(min-width: 992px) { flex-direction: row; }
  @media (max-height: 800px), (max-width: 992px) {
    height: auto;
    display: block;
  }
`
const ColumnLeft = styled(Column)`
  padding: 0 10px 10px 0;
  //@media(min-width: 992px) { padding: 15px 0 15px 15px; }
`
const ColumnRight = styled(Column)`
  padding: 0 0 10px 0;
  //@media(min-width: 992px) { padding: 15px 15px 15px 15px; }
`

const Home = () => (
  <Wrapper>
    <ExchangeStepper/>
    <ColumnWrapper>
      <ColumnLeft>
        <BalancesChartContainer />
        <ActivityList />
      </ColumnLeft>
      <ColumnRight>
        <PriceChart />
        <DidYouKnow />
      </ColumnRight>
    </ColumnWrapper>
  </Wrapper>
)

export default Home
