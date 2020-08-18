import { Icon, Text as TextComponent } from 'blockchain-info-components'
import { toLower } from 'ramda'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { GroupHeadingLabelType, SwapAccountType } from '../types'
import { SelectBox } from 'components/Form'

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

  .bc__menu {
    width: auto;
    min-width: 240px;
  }

  .bc__menu-list {
    margin: 0;
    overflow: initial;
    max-height: initial !important;
  }

  .bc__group {
    position: relative;
    padding: 12px 20px;

    ${`/* 
      🚨🚨🚨
      > div:last-child
      refers to the options list container
      unfortunately it does not have a classname
    */`}
    > div:last-child {
      display: none;
      position: absolute;
      left: 100%;
      top: 0;
    }
    &:hover {
      background-color: ${props => props.theme['blue000']};
      > div:last-child {
        display: block;
      }
    }
  }

  .bc__group-heading {
    display: block;
    margin: 0;
    padding: 0;
    font-size: initial;
    text-transform: initial;
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
const GroupHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const GroupContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Text = styled(TextComponent)<{
  color?: keyof DefaultTheme
  uppercase?: boolean
}>`
  cursor: pointer;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme[props.color || 'grey700']};
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'none')};
`

const DisplayIcon = styled(Icon)`
  font-size: 26px;
  margin-right: 8px;
  color: ${props => props.theme.white};
`

const selectItemIconColor = props => props.theme[props.coin]

const ItemIcon = styled(Icon)<{ coin: keyof DefaultTheme }>`
  font-size: 20px;
  margin-right: 8px;
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
      <Text size='13px' weight={600} color='white'>
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
      <Text size='13px' weight={600}>
        {item.value.label}
      </Text>
    </ItemWrapper>
  )
}

const renderGroupHeading = (props, heading: GroupHeadingLabelType) => {
  return (
    <GroupHeadingWrapper>
      <Icon
        size='28px'
        color={heading.coin.toLowerCase() as keyof DefaultTheme}
        name={heading.icon}
        style={{ marginRight: '12px' }}
      />
      <GroupContent>
        <div>
          <Text size='16px' weight={600} color='grey800'>
            {heading.name}
          </Text>
          <Text size='14px' weight={500} color='grey600'>
            {heading.coin}
          </Text>
        </div>
        <Icon size='24px' color={'grey400'} name='chevron-right' />
      </GroupContent>
    </GroupHeadingWrapper>
  )
}

const SelectBoxExchange = (props: Props) => {
  return (
    <ExchangeSelect
      {...props}
      menuIsOpen
      grouped={true}
      searchEnabled={false}
      hideIndicator={true}
      templateDisplay={renderDisplay}
      templateGroupHeading={renderGroupHeading}
      templateItem={renderItem}
    />
  )
}

type Props = { elements: Array<SwapAccountType> }

export default SelectBoxExchange
