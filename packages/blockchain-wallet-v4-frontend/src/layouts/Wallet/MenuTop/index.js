import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

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
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-1']};

  @media(min-width: 850px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`
const LeftContainer = styled(Container)`
  order: 2;
  @media(min-width: 850px) { order: 1; }
`
const RightContainer = styled(Container)`
  order: 1;
  @media(min-width: 850px) { order: 2; }
`
const TextContainer = styled.div`
  display: none;
  margin-left: -2px;
  @media(min-width: 850px) { display: flex; }
`

const MenuTop = (props) => (
  <Wrapper>
    <LeftContainer>
      <TextContainer inline>
        <Text size='28px' weight={200} uppercase>
          <FormattedMessage id='layouts.wallet.menutop.bank' defaultMessage='Be your own bank.' />
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
