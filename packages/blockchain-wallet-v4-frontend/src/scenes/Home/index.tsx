import React from 'react'
import ReactHighcharts from 'react-highcharts'
import styled from 'styled-components'

import { SceneWrapper } from 'components/Layout'
import Balances from './Balances'
import Banners from './Banners'
import media from 'services/ResponsiveService'
import PriceChart from './PriceChart'

ReactHighcharts.Highcharts.setOptions({ lang: { thousandsSep: ',' } })

const ColumnWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  ${media.atLeastTabletL`
    flex-direction: row;
  `}
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
  @media (max-height: 800px) {
    height: auto;
    display: block;
  }
  ${media.tablet`
    height: auto;
    display: block;
  `}
`
const ColumnLeft = styled(Column)`
  ${media.atLeastTabletL`
    padding-right: 30px;
  `}
`
const ColumnRight = styled(Column)`
  & > :not(:first-child) {
    margin-top: 20px;
  }
`

const Home = () => {
  return (
    <SceneWrapper>
      <Banners />
      <ColumnWrapper>
        <ColumnLeft>
          <Balances />
        </ColumnLeft>
        <ColumnRight>
          <PriceChart />
        </ColumnRight>
      </ColumnWrapper>
    </SceneWrapper>
  )
}

export default Home
