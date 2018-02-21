import React from 'react'
import styled from 'styled-components'

import { Icon, SkeletonRectangle } from 'blockchain-info-components'

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

export default (props) => {
  return (
    <Wrapper>
      <Row>
        <Container>
          <SkeletonRectangle width='100%' height='40px' color='gray-2' />
        </Container>
        <Icon name='exchange-2' size='24px' />
        <Container>
          <SkeletonRectangle width='100%' height='40px' color='gray-2' />
        </Container>
      </Row>
    </Wrapper>
  )
}
