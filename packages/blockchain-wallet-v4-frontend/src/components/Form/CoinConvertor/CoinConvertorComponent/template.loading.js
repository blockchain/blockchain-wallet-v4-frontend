import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { SkeletonRectangle, Text } from 'blockchain-info-components'
import CoinLoading from './CoinLoading'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  & > :first-child { width: 45%; }
  & > :last-child { width: 45%; }
  & > :not(:first-child):not(:last-child) { width: 10%; }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  & > * { margin-bottom: 5px; }
`

const Loading = (props) => (
  <Wrapper>
    <Row>
      <Container>
        <SkeletonRectangle width='100%' height='40px' color='gray-2' />
        <SkeletonRectangle width='100%' height='40px' color='gray-2' />
      </Container>
      <CoinLoading loading />
      <Container>
        <SkeletonRectangle width='100%' height='40px' color='gray-2' />
        <SkeletonRectangle width='100%' height='40px' color='gray-2' />
      </Container>
    </Row>
  </Wrapper>
)

export default Loading
