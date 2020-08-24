import { Icon, Text as TextComponent } from 'blockchain-info-components'
import { toLower } from 'ramda'
import React from 'react'
import styled, { css, DefaultTheme } from 'styled-components'

import { convertBaseToStandard } from 'data/components/exchange/services'
import { FormattedMessage } from 'react-intl'
import { GroupHeadingLabelType } from '../types'
import { SelectBox } from 'components/Form'
import { SuccessCartridge } from 'components/Cartridge'
import { SwapAccountDropdownItemType } from 'data/types'

import media from 'services/ResponsiveService'

const option = css`
  &.bc__option--is-selected {
    background-color: ${props => props.theme['blue000']} !important;
  }

  ${media.atLeastTabletL`
    padding: 12px 20px;
    &.bc__option--is-focused {
      background-color: ${props => props.theme.white} !important;
    }

    &:hover {
      background-color: ${props => props.theme['blue000']} !important;
    }
  `}

  ${media.tabletL`
    border-bottom: 1px solid ${props => props.theme['grey000']};
    &:last-child {
      border-bottom: 0px;
    }
  `}
`

const ExchangeSelect = styled(SelectBox)`
  ${media.mobile`
    position: static;
    > div {
      position: static;
    }
  `}

  .bc__control {
    border: none !important;
    :hover {
      border: none !important;
    }
    :active {
      border: none !important;
    }

    ${media.mobile`
      position: static;
    `}
  }

  .bc__menu {
    width: 260px;
    ${media.mobile`
      top: 72px;
      left: 0px;
      width: 100%;
    `}
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
      ${media.atLeastTabletL`
        box-shadow: 0px 4px 16px rgba(5, 24, 61, 0.2);
        position: absolute;
        border-radius: 8px;
        left: 100%;
        top: 0;
        .bc__option {
          width: 300px;
        }
      `}
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
    ${media.tabletL`
      padding: 12px;
      border-bottom: 1px solid ${props => props.theme['grey000']};
    `}
  }

  .bc__value-container {
    padding: 0;
  }
  .bc__option {
    border-radius: 0px;
    ${option}
    ${media.tabletL`
      padding: 12px;
    `}
    &:after {
      display: none;
    }
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
  justify-content: space-between;
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

  ${media.tabletL`
    font-size: 14px;
  `}
`
const Value = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin-top: 2px;
  color: ${props => props.theme['grey600']};

  ${media.tabletL`
    font-size: 12px;
  `}
`
const StyledSuccessCartridge = styled(SuccessCartridge)`
  white-space: nowrap;
`
const DisplayIcon = styled(Icon)`
  font-size: 26px;
  margin-right: 8px;
  color: ${props => props.theme.white};
`
const DropdownIcon = styled(Icon)`
  ${media.tabletL`
    transform: rotate(90deg);
  `}
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
      {item.value.type === 'CUSTODIAL' && (
        <StyledSuccessCartridge>
          <FormattedMessage id='copy.low_fees' defaultMessage='Low Fees' />
        </StyledSuccessCartridge>
      )}
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
        <DropdownIcon size='24px' color={'grey400'} name='chevron-right' />
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
      menuIsOpen={props.menuIsOpen}
      templateItem={renderItem}
    />
  )
}

type Props = {
  elements: Array<SwapAccountDropdownItemType>
  menuIsOpen?: boolean
}

export default SelectBoxExchange
