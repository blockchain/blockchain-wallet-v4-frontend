import React from 'react'
import styled from 'styled-components'

import ActivityList from './ActivityList'
import BalanceSummary from './BalanceSummary'
import DidYouKnow from './DidYouKnow'

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
`

const Home = (props) => {
  return (
    <Wrapper>
      <Column>
        <ActivityList />
      </Column>
      <Column>
        <BalanceSummary />
        <DidYouKnow />
      </Column>
    </Wrapper>
  )
}

export default Home
