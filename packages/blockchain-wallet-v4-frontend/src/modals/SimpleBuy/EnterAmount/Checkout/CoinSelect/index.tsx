import { fiatToString } from 'core/exchange/currency'
import { Field } from 'redux-form'
import {
  getCoinFromPair,
  getFiatFromPair
} from 'data/components/simpleBuy/model'
import { Icon, Text } from 'blockchain-info-components'
import { Props } from '../template.success'
import { SBPairType, SupportedCoinType } from 'core/types'
import { SelectBox } from 'components/Form'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const DisplayContainer = styled.div<{
  coinType: SupportedCoinType
  isItem: boolean
}>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: ${props => (props.isItem ? '6px 6px 0px 6px' : '16px 12px')};
  > span {
    color: ${props => props.theme[props.coinType.colorCode]} !important;
  }
`

const SelectBoxBuyCoin = styled(SelectBox)`
  .bc__dropdown-indicator {
    padding-right: 24px;
    color: ${props => props.theme.grey600};
  }
`
const Display = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
  .bc__single-value {
    position: relative;
    top: 0;
    transform: initial;
    margin: 0;
  }
  input {
    height: 0;
  }
`
const Rate = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
  color: ${props => props.theme.grey600} !important;
`

class CoinSelect extends PureComponent<Props & { name: string }> {
  state = {}

  renderElements = () => {
    return [
      {
        group: '',
        items: this.props.pairs.map(value => ({
          text: this.props.supportedCoins[getCoinFromPair(value.pair)]
            .displayName,
          value
        }))
      }
    ]
  }

  renderDisplay = (props: { value: SBPairType }, children) => {
    if (!props.value) return
    if (!this.props.formValues) return

    const coin = getCoinFromPair(props.value.pair)
    const fiat = getFiatFromPair(props.value.pair)
    const coinType = this.props.supportedCoins[coin]
    const displayName = coinType.displayName
    const coinTicker = coinType.coinTicker
    const icon = coinType.icons.circleFilled
    const color = coinType.colorCode
    const isItem = !children

    return (
      <DisplayContainer coinType={coinType} isItem={isItem}>
        <Icon size='32px' color={color} name={icon} />
        <Display>
          {children || displayName}
          <Rate>
            1 {coinTicker} ={' '}
            {fiatToString({
              value: this.props.rates[coin][fiat].last,
              unit: fiat
            })}
          </Rate>
        </Display>
      </DisplayContainer>
    )
  }

  render () {
    return (
      <Field
        component={SelectBoxBuyCoin}
        elements={this.renderElements()}
        hideIndicator={this.props.pairs.length <= 1}
        name={this.props.name}
        openMenuOnClick={this.props.pairs.length > 1}
        searchEnabled={false}
        templateDisplay={this.renderDisplay}
        templateItem={this.renderDisplay}
      />
    )
  }
}

export default CoinSelect
