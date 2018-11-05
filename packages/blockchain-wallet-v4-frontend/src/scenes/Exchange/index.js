import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import media from 'services/ResponsiveService'
import GetStarted from './GetStarted'
import Exchange from './ExchangeContainer'

import { getData } from './selectors'

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
`

const Container = styled.section`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  @media (min-width: 992px) {
    flex-direction: row;
  }

  ${media.mobile`
    align-items: center;
    padding: 10px;
  `};
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`

const ExchangeScene = ({ verified }) => (
  <Wrapper>
    {verified
      ? <Container>
        <Column>
          <Exchange />
        </Column>
      </Container>
      : <GetStarted />
    }
  </Wrapper>
)

export default connect(getData)(ExchangeScene)
