import React from 'react'
import styled from 'styled-components'
import { path, prop } from 'ramda'

import { Icon, Separator } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'

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

const renderDisplay = (props, children) => {
  console.log(props)
  const { value, ...rest } = props
  return (
    <DisplayWrapper {...rest}>
      {value.coin === 'BCH' && (
        <Icon name='bitcoin-cash' size='14px' weight={300} />
      )}
      {value.coin === 'BTC' && <Icon name='bitcoin' size='14px' weight={300} />}
      {value.coin === 'ETH' && (
        <Icon name='ethereum' size='14px' weight={300} />
      )}
      <Text>{children}</Text>
    </DisplayWrapper>
  )
}
const renderHeader = item => (
  <HeaderWrapper>
    {prop('text', item) === 'Bitcoin' && (
      <Icon name='bitcoin-in-circle' size='14px' weight={300} />
    )}
    {prop('text', item) === 'Bitcoin Cash' && (
      <Icon name='bitcoin-cash' size='14px' weight={300} />
    )}
    {prop('text', item) === 'Ether' && (
      <Icon name='ethereum-filled' size='14px' weight={300} />
    )}
    <Separator align='right'>
      <Text uppercase>{item.text}</Text>
    </Separator>
  </HeaderWrapper>
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

const SelectBoxExchange = props =>
  props.hasOneAccount ? (
    <SelectBox
      {...props}
      templateDisplay={renderDisplay}
      templateItem={renderItemWithIcon}
    />
  ) : (
    <SelectBox
      {...props}
      templateDisplay={renderDisplay}
      templateHeader={renderHeader}
      templateItem={renderItem}
      grouped
    />
  )

export default SelectBoxExchange
