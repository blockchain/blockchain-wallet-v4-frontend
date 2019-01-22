import React from 'react'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'
import Actions from './Actions'
import Balance from './Balance'
import Media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
  z-index: 10;
  ${Media.tablet`
    flex-direction: column;
    justify-content: flex-start;
  `};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`
const LeftContainer = styled(Container)`
  order: 1;
  ${Media.tablet`
    order: 2;
  `};
`
const RightContainer = styled(Container)`
  order: 2;
  ${Media.tablet`
    order: 1;
  `};
`
const TextContainer = styled.div`
  display: flex;
  margin-left: -2px;
  ${Media.tablet`
    display: none;
    margin-left: 0px;
  `};
`

const MenuTop = props => (
  <Wrapper>
    <LeftContainer>
      <TextContainer inline>
        <Text size='28px' weight={200} uppercase>
          Be Your Own Bank
        </Text>
        <Text size='20px' weight={200}>
          <sup>®</sup>
        </Text>
      </TextContainer>
      <Actions />
    </LeftContainer>
    <RightContainer>
      <Balance />
    </RightContainer>
  </Wrapper>
)

export default MenuTop
