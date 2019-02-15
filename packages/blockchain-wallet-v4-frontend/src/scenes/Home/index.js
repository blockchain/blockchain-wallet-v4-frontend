import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'

import ActivityList from './ActivityList'
import DidYouKnow from './DidYouKnow'
import PriceChart from './PriceChart'
import Balances from './Balances'
import Banners from './Banners'

ReactHighcharts.Highcharts.setOptions({ lang: { thousandsSep: ',' } })

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 400px) {
    margin: 0 5px;
  }
  @media (min-width: 400px), (max-width: 992px) {
    margin: 0 10px;
  }
  @media (min-width: 992px) {
    margin: 0 30px;
  }
`
const ColumnWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  @media (min-width: 992px) {
    flex-direction: row;
  }
`
const Column = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  @media (max-height: 800px), (max-width: 992px) {
    height: auto;
    display: block;
  }
`
const ColumnLeft = styled(Column)`
  padding: 15px 10px 10px 0;
  @media (max-width: 992px) {
    padding: 15px 0 0 0;
  }
`
const ColumnRight = styled(Column)`
  padding: 15px 0 10px 0;
`

const Home = () => (
  <Wrapper>
    <Banners />
    <ColumnWrapper>
      <ColumnLeft>
        <Balances />
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
