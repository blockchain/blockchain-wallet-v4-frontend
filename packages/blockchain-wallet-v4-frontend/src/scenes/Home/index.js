import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import media from 'services/ResponsiveService'
import ActivityList from './ActivityList'
import DidYouKnow from './DidYouKnow'
import PriceChart from './PriceChart'
import Balances from './Balances'
import SwapBanner from './SwapBanner'

ReactHighcharts.Highcharts.setOptions({ lang: { thousandsSep: ',' } })

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 30px;
  ${media.tablet`
    margin: 0 10px;
  `};
  ${media.mobile`
    margin: 0 5px;
  `};
`
const ColumnWrapper = styled.section`
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  flex-direction: row;
  ${media.laptop`
    flex-direction: column;
  `};
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
  ${media.laptop`
    padding: 15px 0 0 0;
  `};
`
const ColumnRight = styled(Column)`
  padding: 15px 0 10px 0;
`

const Home = () => (
  <Wrapper>
    <SwapBanner />
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
