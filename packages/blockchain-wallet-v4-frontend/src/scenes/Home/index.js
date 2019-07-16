import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'

import PriceChart from './PriceChart'
import Balances from './Balances'
import Banners from './Banners'
import ThePit from './ThePit'

ReactHighcharts.Highcharts.setOptions({ lang: { thousandsSep: ',' } })

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  @media (min-width: 992px) {
    padding: 15px 30px;
  }
`
const ColumnWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  max-width: 600px;
  box-sizing: border-box;
  padding-bottom: 25px;
  @media (max-height: 800px), (max-width: 991px) {
    height: auto;
    display: block;
  }
`
const ColumnLeft = styled(Column)`
  @media (min-width: 992px) {
    padding-right: 30px;
  }
`
const ColumnRight = styled(Column)`
  & > :not(:first-child) {
    margin-top: 20px;
  }
`

const Home = () => (
  <Wrapper>
    <Banners />
    <ColumnWrapper>
      <ColumnLeft>
        <Balances />
      </ColumnLeft>
      <ColumnRight>
        <PriceChart />
        <ThePit />
      </ColumnRight>
    </ColumnWrapper>
  </Wrapper>
)

export default Home
