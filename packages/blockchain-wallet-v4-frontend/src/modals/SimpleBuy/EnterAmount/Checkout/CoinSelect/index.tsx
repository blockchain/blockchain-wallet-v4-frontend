import { Field } from 'redux-form'
import { getCoinFromPair } from 'data/components/simpleBuy/model'
import { Icon } from 'blockchain-info-components'
import { Props } from '../template.success'
import { SBPairType, SupportedCoinType } from 'core/types'
import { SelectBox } from 'components/Form'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const DisplayContainer = styled.div<{
  coinType: SupportedCoinType
}>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 12px;
  > span {
    color: ${props => props.theme[props.coinType.colorCode]} !important;
  }
`

const CoinName = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  width: 100%;
  cursor: pointer;
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
    const coinType = this.props.supportedCoins[coin]
    const displayName = coinType.displayName
    const icon = coinType.icons.circleFilled
    const color = coinType.colorCode

    return (
      <DisplayContainer coinType={coinType}>
        <Icon size='32px' color={color} name={icon} />
        <CoinName>{children || displayName}</CoinName>
      </DisplayContainer>
    )
  }

  render () {
    return (
      <Field
        component={SelectBox}
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
