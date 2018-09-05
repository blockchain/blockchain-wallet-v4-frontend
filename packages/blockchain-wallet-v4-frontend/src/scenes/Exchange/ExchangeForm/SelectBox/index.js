import React from 'react'
import styled from 'styled-components'
import { path } from 'ramda'

import { Icon } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'

const ExchangeSelect = styled(SelectBox)`
  .bc__control {
    border-radius: 3px;
    border: none;
    background-color: ${props => props.theme[props.color]};
    :hover {
      border: none;
    }
  }

  .bc__single-value {
    color: ${props => props.theme.white};
  }
`

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
  cursor: pointer;
  width: 100%;
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DisplayIcon = styled(Icon)`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.white};
`

const ItemIcon = styled(Icon)`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme[props.color]} !important;
`

const getIconName = coin => `exchange-${coin.toLowerCase()}`

const renderDisplay = (props, children) => {
  const coin = path(['value', 'coin'], props)
  return (
    <DisplayWrapper coin={coin} {...props}>
      {<DisplayIcon name={getIconName(coin)} />}
      <Text>{children}</Text>
    </DisplayWrapper>
  )
}

const renderItem = item => {
  const coin = path(['value', 'coin'], item)
  return (
    <ItemWrapper>
      {<ItemIcon color={coin.toLowerCase()} name={getIconName(coin)} />}
      <Text>{item.text}</Text>
    </ItemWrapper>
  )
}

const SelectBoxExchange = props => (
  <ExchangeSelect
    {...props}
    searchEnabled={false}
    color={path(['input', 'value', 'coin'], props).toLowerCase()}
    hideIndicator={true}
    templateDisplay={renderDisplay}
    templateItem={renderItem}
  />
)

export default SelectBoxExchange
