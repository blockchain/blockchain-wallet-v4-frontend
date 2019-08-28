import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import Actions from './Actions'
import Balance from './Balance'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  z-index: 10;

  @media (min-width: 850px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`
const LeftContainer = styled(Container)`
  order: 2;
  @media (min-width: 850px) {
    order: 1;
  }
`
const RightContainer = styled(Container)`
  order: 1;
  margin-bottom: 8px;
  @media (min-width: 850px) {
    margin-bottom: 0px;
    order: 2;
  }
`
const TextContainer = styled.div`
  display: none;
  margin-left: 24px;
  @media (min-width: 850px) {
    display: flex;
  }
`

const MenuTop = () => (
  <Wrapper>
    <LeftContainer>
      <Actions />
      <TextContainer inline>
        <Text size='16px' weight={500} uppercase color='gray-3'>
          Be Your Own Bank
        </Text>
        <Text size='15px' weight={400} color='gray-3'>
          <sup>®</sup>
        </Text>
      </TextContainer>
    </LeftContainer>
    <RightContainer>
      <Balance />
    </RightContainer>
  </Wrapper>
)

export default MenuTop
