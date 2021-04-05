import React from 'react'
import styled from 'styled-components'

import { SceneWrapper } from 'components/Layout'
import { media } from 'services/styles'

import Banners from './Banners'
import Holdings from './Holdings'
import PriceChart from './PriceChart'

const ColumnWrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;

  ${media.atLeastLaptopL`
    flex-direction: row;
  `}
`
const Column = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 24px;
`
const ColumnLeft = styled(Column)`
  flex: 2;
  ${media.atLeastLaptopL`
    margin-right: 24px;
  `}
`

const ColumnRight = styled(Column)`
  flex: 3;
  margin-top: 24px;

  ${media.atLeastLaptopL`
    margin-top: 0;
  `}
`

const Home = () => {
  return (
    <SceneWrapper>
      <Banners />
      <ColumnWrapper>
        <ColumnLeft>
          <Holdings />
        </ColumnLeft>
        <ColumnRight>
          <PriceChart />
        </ColumnRight>
      </ColumnWrapper>
    </SceneWrapper>
  )
}

export default Home
