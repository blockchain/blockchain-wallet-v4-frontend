import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

import SelectBox from '../SelectBox'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  > span:first-child {
    margin-right: 4px;
  }
`
const CoinText = styled(Text)`
  display: flex;
`
const ItemIcon = styled(Icon)`
  color: ${(props) => props.theme[props.color]} !important;
`
const SelectBoxCoin = styled(SelectBox)`
  .bc__control {
    border: 0px !important;
  }
  .bc__dropdown-indicator {
    padding-left: 0px;
    color: ${(props) => props.theme.black};
  }
  .bc__single-value {
    color: ${(props) => props.theme.black};
    transform: initial;
    position: relative;
    max-width: none;
    top: initial;
  }
`

const renderItem = ({ text, value }) => {
  const coinValue = value || 'BTC'
  return (
    <HeaderWrapper>
      <ItemIcon name={coinValue} color={coinValue} size='22px' weight={400} />
      <Text size='14px' weight={400} cursor='pointer' data-e2e=''>
        {text}
      </Text>
    </HeaderWrapper>
  )
}

const renderDisplay = ({ value }, children) => {
  const coinValue = value || 'BTC'
  const e2eTag = `${coinValue}CurrencyOption`

  return (
    <HeaderWrapper>
      <Icon name={coinValue} color={coinValue} size='22px' weight={400} />
      <CoinText size='18px' weight={500} color='black' cursor='pointer' data-e2e={e2eTag}>
        {children} ({value})
      </CoinText>
    </HeaderWrapper>
  )
}

const COINS = [
  { text: 'Bitcoin', value: 'BTC' },
  { text: 'Ether', value: 'ETH' },
  { text: 'Bitcoin Cash', value: 'BCH' },
  { text: 'Stellar', value: 'XLM' }
]

class SelectBoxCoinPriceChart extends React.PureComponent {
  render() {
    const elements = [{ group: '', items: COINS }]

    return (
      <SelectBoxCoin
        elements={elements}
        templateDisplay={renderDisplay}
        templateItem={renderItem}
        coins={COINS}
        {...this.props}
      />
    )
  }
}

export default SelectBoxCoinPriceChart
