import React from 'react'
import styled from 'styled-components'
import { path, prop } from 'ramda'
import { Icon, Separator, Text } from 'blockchain-info-components'

const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;

  & > * { margin-left: 5px; }
`

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

  & > * { margin-left: 5px; }
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

  & > * { margin-left: 5px; }

  &:hover {
    color: ${props => props.theme['gray-4']};
    background-color: ${props => props.theme['gray-1']};
  }
`

export const renderDisplay = item => (
  <DisplayWrapper>
    {path(['value', 'coin'], item) === 'BTC' && <Icon name='bitcoin' size='14px' weight={300} />}
    {path(['value', 'coin'], item) === 'ETH' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300}>{item.text}</Text>
  </DisplayWrapper>
)

export const renderHeader = item => (
  <HeaderWrapper>
    {prop('text', item) === 'Bitcoin' && <Icon name='bitcoin' size='14px' weight={300} />}
    {prop('text', item) === 'Ethereum' && <Icon name='ethereum' size='14px' weight={300} />}
    <Text size='14px' weight={300} uppercase>{item.text}</Text>
    <Separator />
  </HeaderWrapper>
)

export const renderItem = item => (
  <ItemWrapper>
    <Text size='14px' weight={300}>{item.text}</Text>
  </ItemWrapper>
)
