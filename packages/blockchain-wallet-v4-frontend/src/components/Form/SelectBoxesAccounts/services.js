import React from 'react'
import styled from 'styled-components'
import { Icon, Separator, Text } from 'blockchain-info-components'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: not-allowed;

  & > * { margin: 0 5px; }
`

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;

  & > * { margin: 0 5px; }

  &:hover {
    color: ${props => props.theme['gray-4']};
    background-color: ${props => props.theme['gray-1']};
  }
`

export const renderHeader = value => (
  <HeaderWrapper>
    {value === 'Bitcoin' && <Icon name='bitcoin' size='14px' weight={300} />}
    {value === 'Ethereum' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300} uppercase>{value}</Text>
    <Separator />
  </HeaderWrapper>
)

export const renderItem = item => (
  <ItemWrapper>
    <Text size='14px' weight={300}>{item.text}</Text>
  </ItemWrapper>
)
