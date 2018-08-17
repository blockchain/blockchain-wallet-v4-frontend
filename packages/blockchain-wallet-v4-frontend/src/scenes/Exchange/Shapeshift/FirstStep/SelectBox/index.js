import React from 'react'
import styled from 'styled-components'
import { path, prop } from 'ramda'

import { Icon } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'
import { components } from 'react-select'

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
  min-width: 0;
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
  min-width: 0;
`
const Text = styled.span`
  position: relative;
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  font-size: 14px;
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'none')};
  font-style: normal;
  color: ${props => props.theme['gray-5']};
  cursor: pointer;
  width: 100%;
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const renderDisplay = item => (
  <DisplayWrapper>
    {prop('value', item) === 'BCH' && (
      <Icon name='bitcoin-cash' size='14px' weight={300} />
    )}
    {prop('value', item) === 'BTC' && (
      <Icon name='bitcoin' size='14px' weight={300} />
    )}
    {prop('value', item) === 'ETH' && (
      <Icon name='ethereum' size='14px' weight={300} />
    )}
    <Text>{item.text}</Text>
  </DisplayWrapper>
)

const renderItem = item => (
  <ItemWrapper>
    <Text>{item.text}</Text>
  </ItemWrapper>
)

const renderItemWithIcon = item => (
  <ItemWrapper>
    {path(['value', 'coin'], item) === 'BCH' && (
      <Icon name='bitcoin-cash' size='14px' weight={300} />
    )}
    {path(['value', 'coin'], item) === 'BTC' && (
      <Icon name='bitcoin' size='14px' weight={300} />
    )}
    {path(['value', 'coin'], item) === 'ETH' && (
      <Icon name='ethereum' size='14px' weight={300} />
    )}
    <Text>{item.text}</Text>
  </ItemWrapper>
)

const Group = props => {
  return (
    <div style={{ marginTop: '10px' }}>
      <components.Group {...props} />
    </div>
  )
}

const SelectBoxExchange = props => {
  return props.hasOneAccount ? (
    <SelectBox
      {...props}
      templateDisplay={renderDisplay}
      templateItem={renderItemWithIcon}
    />
  ) : (
    <SelectBox
      {...props}
      templateItem={renderItem}
      components={{ Group }}
      grouped
    />
  )
}

export default SelectBoxExchange
