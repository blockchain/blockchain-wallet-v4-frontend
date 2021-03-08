import React from 'react'
import { Text, TextGroup } from 'blockchain-info-components'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  margin-bottom: 15px;
`

export default () => (
  <Wrapper>
    <Row>
      <Text size='24px' weight={400} color='blue900'>
        We&rsquo;ll be back soon!
      </Text>
    </Row>
    <Row>
      <TextGroup>
        <Text size='18px' weight={400} color='blue900'>
          Sorry for the inconvenience but we&rsquo;re performing some
          maintenance at the moment.
        </Text>
        <Text size='18px' weight={400} color='blue900'>
          &mdash; The Blockchain Team
        </Text>
      </TextGroup>
    </Row>
  </Wrapper>
)
