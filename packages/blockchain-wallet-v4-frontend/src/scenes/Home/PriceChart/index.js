import Chart from './Chart'
import CoinCurrentPrice from './CoinCurrentPrice'
import CoinPerformance from './CoinPerformance'
import CoinSelectBox from './CoinSelectBox'
import Footer from './Footer'
import React from 'react'
import styled from 'styled-components'
import TimeFilters from './TimeFilters'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  align-items: center;
  width: 100%;
  height: 542px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.grey000};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const TitleRow = styled(Row)`
  display: flex;
  flex-direction: column;
`
const PriceChart = () => (
  <Wrapper>
    <TitleRow>
      <CoinSelectBox />
      <CoinCurrentPrice />
      <CoinPerformance />
    </TitleRow>
    <Row>
      <Chart />
      <TimeFilters />
    </Row>
    <Row>
      <Footer />
    </Row>
  </Wrapper>
)

export default PriceChart
