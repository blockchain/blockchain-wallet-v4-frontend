import React from 'react'
import styled from 'styled-components'
import { pathOr, prop, toLower } from 'ramda'

import { Icon } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'

const ExchangeSelect = styled(SelectBox)`
  .bc__control {
    border: none;
    :hover {
      border: none;
    }
    :active {
      border: none;
    }
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

const DisplayWrapper = styled.div`
  border-radius: 3px;
  background-color: ${props => props.theme[props.coin]};
  min-height: 40px;
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
  font-size: 28px;
  color: ${props => props.theme.white};
`

const selectItemIconColor = props =>
  props.isSelected ? props.theme.white : props.theme[props.coin]

const ItemIcon = styled(Icon)`
  font-size: 24px;
  color: ${selectItemIconColor} !important;
`

const getIconName = coin => `${toLower(coin)}`

const renderDisplay = (props, children) => {
  const coin = pathOr('', ['value', 'coin'], props)
  return (
    <DisplayWrapper className={props.className} coin={toLower(coin)}>
      {<DisplayIcon name={getIconName(coin)} />}
      <Text>{children}</Text>
    </DisplayWrapper>
  )
}

const renderItem = item => {
  const coin = pathOr('', ['value', 'coin'], item)
  const isSelected = prop('isSelected', item)
  return (
    <ItemWrapper>
      {
        <ItemIcon
          coin={toLower(coin)}
          isSelected={isSelected}
          name={getIconName(coin)}
        />
      }
      <Text>{item.text}</Text>
    </ItemWrapper>
  )
}

const SelectBoxExchange = props => (
  <ExchangeSelect
    {...props}
    searchEnabled={false}
    hideIndicator={true}
    templateDisplay={renderDisplay}
    templateItem={renderItem}
  />
)

export default SelectBoxExchange
