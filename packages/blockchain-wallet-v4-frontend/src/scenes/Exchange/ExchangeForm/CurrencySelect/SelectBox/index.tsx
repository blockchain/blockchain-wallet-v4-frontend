import { Icon } from 'blockchain-info-components'
import { toLower } from 'ramda'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { SelectBox } from 'components/Form'
import { SwapAccountType } from '../types'

const ExchangeSelect = styled(SelectBox)`
  .bc__control {
    border: none !important;
    :hover {
      border: none !important;
    }
    :active {
      border: none !important;
    }
  }

  .bc__group-heading {
    display: initial;
  }

  .bc__value-container {
    padding: 0;
  }
  .bc__option {
    padding: 8px 0;
    font-weight: 600;
  }

  .bc__single-value {
    color: ${props => props.theme.white};
  }
`

const DisplayWrapper = styled.div<{ coin: keyof DefaultTheme }>`
  border-radius: 3px;
  background-color: ${props => props.theme[props.coin]};
  min-height: 30px;
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
const Text = styled.span<{ uppercase?: boolean }>`
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  font-size: 13px;
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'none')};
  font-style: normal;
  cursor: pointer;
  width: 100%;
  padding-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DisplayIcon = styled(Icon)`
  font-size: 26px;
  color: ${props => props.theme.white};
`

const selectItemIconColor = props => props.theme[props.coin]

const ItemIcon = styled(Icon)<{ coin: keyof DefaultTheme }>`
  font-size: 20px;
  color: ${selectItemIconColor} !important;
  span {
    color: ${selectItemIconColor} !important;
  }
`

const renderDisplay = (item: SwapAccountType, children) => {
  if (!item.value) return
  const coin = item.value.coin
  const icon = item.value.icon

  return (
    <DisplayWrapper coin={toLower(coin) as keyof DefaultTheme}>
      {<DisplayIcon name={icon} />}
      <Text>
        {item.value.label}
        {children}
      </Text>
    </DisplayWrapper>
  )
}

const renderItem = (item: SwapAccountType) => {
  if (!item.value) return
  const coin = item.value.coin
  const icon = item.value.icon

  return (
    <ItemWrapper>
      <ItemIcon coin={toLower(coin) as keyof DefaultTheme} name={icon} />
      <Text>{item.value.label}</Text>
    </ItemWrapper>
  )
}

const SelectBoxExchange = (props: Props) => {
  return (
    <ExchangeSelect
      {...props}
      grouped={true}
      searchEnabled={false}
      hideIndicator={true}
      menuIsOpen
      templateDisplay={renderDisplay}
      templateItem={renderItem}
    />
  )
}

type Props = { elements: Array<SwapAccountType> }

export default SelectBoxExchange
