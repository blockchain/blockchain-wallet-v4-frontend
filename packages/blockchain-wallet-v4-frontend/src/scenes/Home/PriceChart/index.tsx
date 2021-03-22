import React from 'react'
import { ParentSize } from '@visx/responsive'
import styled from 'styled-components'

import { media } from 'services/styles'

import Actions from './Actions'
import Chart from './Chart'
import CoinCurrentPrice from './CoinCurrentPrice'
import CoinPerformance from './CoinPerformance'
import CoinSelector from './CoinSelector'
import TimeFilter from './TimeFilter'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.grey000};
`

const Row = styled.div`
  display: flex;

  flex-direction: column;
  ${media.atLeastTabletL`
    flex-direction: row;
  `}
  justify-content: space-between;
  width: 100%;
`

const Column = styled.div`
  margin-bottom: 16px;

  width: 100%;

  ${media.atLeastTabletL`
    margin: 0;
    width: fit-content;
  `}
`

const InlineContainer = styled.div`
  display: flex;
  align-items: baseline;
`

const Header = styled(Row)`
  margin-bottom: 24px;
`

const Main = styled(Row)`
  margin-bottom: 24px;
`

const Footer = styled(Row)`
  justify-content: flex-end;
`

const PriceChart = () => {
  return (
    <Wrapper>
      <Header>
        <Column>
          <CoinSelector />
          <InlineContainer>
            <CoinCurrentPrice />
            <CoinPerformance />
          </InlineContainer>
        </Column>
        <Column>
          <Actions />
        </Column>
      </Header>
      <Main>
        <ParentSize>
          {({ height, width }) => <Chart width={width} height={height} />}
        </ParentSize>
      </Main>
      <Footer>
        <TimeFilter />
      </Footer>
    </Wrapper>
  )
}

export default PriceChart
