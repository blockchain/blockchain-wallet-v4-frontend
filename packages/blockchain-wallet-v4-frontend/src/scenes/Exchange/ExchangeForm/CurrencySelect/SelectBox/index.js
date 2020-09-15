import { Icon } from 'blockchain-info-components'
import { pathOr, prop, toLower } from 'ramda'
import { SelectBox } from 'components/Form'
import React from 'react'
import styled from 'styled-components'

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
const Text = styled.span`
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

const ItemIcon = styled(Icon)`
  font-size: 20px;
  color: ${selectItemIconColor} !important;
  span {
    color: ${selectItemIconColor} !important;
  }
`

const renderDisplay = (props, children) => {
  const coin = pathOr('', ['value', 'coin'], props)
  const icon = pathOr('', ['value', 'icon'], props)

  return (
    <DisplayWrapper className={props.className} coin={toLower(coin)}>
      {<DisplayIcon name={icon} />}
      <Text>{children}</Text>
    </DisplayWrapper>
  )
}

const renderItem = item => {
  const coin = pathOr('', ['value', 'coin'], item)
  const icon = pathOr('', ['value', 'icon'], item)

  const isSelected = prop('isSelected', item)
  return (
    <ItemWrapper>
      <ItemIcon coin={toLower(coin)} isSelected={isSelected} name={icon} />
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
