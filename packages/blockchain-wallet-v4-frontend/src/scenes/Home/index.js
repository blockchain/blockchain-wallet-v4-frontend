import React from 'react'
import styled from 'styled-components'

import ActivityList from './ActivityList'
import BalanceSummary from './BalanceSummary'
import DidYouKnow from './DidYouKnow'
import Chart from './Highchart/Chart'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

  @media(min-width: 992px) { flex-direction: row; }
`
const Column = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 30px 0;
  box-sizing: border-box;
`
const ColumnLeft = styled(Column)`
  padding: 30px;
  @media(min-width: 992px) { padding: 30px 5px 30px 30px; }
`
const ColumnRight = styled(Column)`
  padding: 30px;
  @media(min-width: 992px) { padding: 30px 30px 30px 5px; }
`

const Home = (props) => {
  return (
    <Wrapper>
      <ColumnLeft>
        <ActivityList />
      </ColumnLeft>
      <ColumnRight>
        <Chart />
        <DidYouKnow />
      </ColumnRight>
    </Wrapper>
  )
}

export default Home
