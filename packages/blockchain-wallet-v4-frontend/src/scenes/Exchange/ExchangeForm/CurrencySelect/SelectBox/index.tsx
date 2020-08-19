import { Icon, Text as TextComponent } from 'blockchain-info-components'
import { toLower } from 'ramda'
import React from 'react'
import styled, { css, DefaultTheme } from 'styled-components'

import { convertBaseToStandard } from 'data/components/exchange/services'
import { GroupHeadingLabelType } from '../types'
import { SelectBox } from 'components/Form'
import { SwapAccountDropdownItemType } from 'data/types'

const option = css`
  padding: 12px 20px;
  &:hover {
    background-color: ${props => props.theme['blue000']} !important;
  }
`

const width = css`
  width: 240px;
`

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
    ${width}
  }

  .bc__menu-list {
    margin: 0;
    overflow: initial;
    max-height: initial !important;
  }

  .bc__group {
    position: relative;
    ${option}
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
      border-radius: 8px;
      box-shadow: 0px 4px 16px rgba(5, 24, 61, 0.2);
    }
    &:hover {
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
    border-radius: 0px;
    &.bc__option--is-focused {
      background-color: ${props => props.theme.white};
    }
    ${width}
    ${option}
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
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  min-width: 0;
`
const GroupHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
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
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme[props.color || 'grey700']};
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'none')};
`
const Title = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme['grey800']};
`
const Value = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin-top: 2px;
  color: ${props => props.theme['grey600']};
`
const DisplayIcon = styled(Icon)`
  font-size: 26px;
  margin-right: 8px;
  color: ${props => props.theme.white};
`

const renderDisplay = (item: SwapAccountDropdownItemType, children) => {
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

const renderItem = (item: SwapAccountDropdownItemType) => {
  if (!item.value) return

  return (
    <ItemWrapper>
      <div>
        <Title>{item.value.label}</Title>
        <Value>
          {convertBaseToStandard(item.value.coin, item.value.balance)}{' '}
          {item.value.coin}
        </Value>
      </div>
    </ItemWrapper>
  )
}

const renderGroupHeading = (props, heading: GroupHeadingLabelType) => {
  return (
    <GroupHeadingWrapper role='button'>
      <Icon
        size='28px'
        color={heading.coin.toLowerCase() as keyof DefaultTheme}
        name={heading.icon}
        style={{ marginRight: '12px' }}
      />
      <GroupContent>
        <div>
          <Title>{heading.name}</Title>
          <Value>{heading.coin}</Value>
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
      grouped={true}
      searchEnabled={false}
      hideIndicator={true}
      templateDisplay={renderDisplay}
      templateGroupHeading={renderGroupHeading}
      templateItem={renderItem}
    />
  )
}

type Props = { elements: Array<SwapAccountDropdownItemType> }

export default SelectBoxExchange
