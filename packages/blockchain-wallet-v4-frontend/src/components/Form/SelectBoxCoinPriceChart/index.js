import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

import SelectBox from '../SelectBox'
import { getCoins } from './selectors'

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

const renderItem = (props) => {
  const { text, value, ...rest } = props
  const coinValue = value || 'BTC'
  return (
    <HeaderWrapper {...rest}>
      <ItemIcon name={coinValue} color={coinValue} size='22px' weight={400} />
      <Text size='14px' weight={400} cursor='pointer' data-e2e=''>
        {text}
      </Text>
    </HeaderWrapper>
  )
}

const renderDisplay = (props, children) => {
  const { value } = props
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

class SelectBoxCoinPriceChart extends React.PureComponent {
  render() {
    const { coins, ...rest } = this.props
    const elements = [{ group: '', items: coins }]
    return (
      <SelectBoxCoin
        elements={elements}
        templateDisplay={renderDisplay}
        templateItem={renderItem}
        {...rest}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  coins: getCoins(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxCoinPriceChart)
