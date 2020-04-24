import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import {
  CARD_TYPES,
  DEFAULT_CARD_SVG_LOGO
} from 'components/Form/CreditCardBox/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { Field } from 'redux-form'
import { getFiatFromPair } from 'data/components/simpleBuy/model'
import { Icon, Text } from 'blockchain-info-components'
import { Props } from '../template.success'
import { SBCheckoutFormValuesType } from 'data/types'
import { SelectBox } from 'components/Form'
import React, { PureComponent, ReactElement } from 'react'
import styled from 'styled-components'

const SelectBoxMethod = styled(SelectBox)`
  margin-bottom: 24px;
  .bc__dropdown-indicator {
    padding-right: 24px;
    color: ${props => props.theme.grey600};
  }
`
const DisplayContainer = styled.div<{
  isItem: boolean
}>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: ${props => (props.isItem ? '0px 6px' : '16px 12px')};
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
const IconContainer = styled.div`
  width: 38px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`
const Limit = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
  color: ${props => props.theme.grey600} !important;
`

class MethodSelect extends PureComponent<Props> {
  state = {}

  getType = (value: ElementValueType) => {
    switch (value.type) {
      case 'BANK_TRANSFER':
        return 'Bank Wire Transfer'
      case 'CARD':
        return 'Credit or Debit Card'
      case 'USER_CARD':
        return value.card.label
    }
  }

  getIcon = (value: ElementValueType): ReactElement => {
    switch (value.type) {
      case 'BANK_TRANSFER':
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='bank-filled' />
          </IconContainer>
        )
      case 'CARD':
        return (
          <IconContainer>
            <Icon size='18px' color='blue600' name='credit-card-filled' />
          </IconContainer>
        )
      case 'USER_CARD':
        let cardType = CARD_TYPES.find(
          card => card.type === value.card.type.toLowerCase()
        )
        return (
          <img
            height='18px'
            width='auto'
            src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
          />
        )
    }
  }

  renderElements = () => {
    const availableCards = this.props.cards.filter(
      card => card.state === 'ACTIVE'
    )
    const defaultCardMethod = this.props.paymentMethods.methods.find(
      m => m.type === 'CARD'
    )
    const cardMethods = availableCards.map(card => ({
      text: card.card.label,
      value: {
        ...card,
        type: 'USER_CARD',
        limits: defaultCardMethod
          ? defaultCardMethod.limits
          : { min: '1000', max: '500000' }
      }
    }))
    const defaultMethods = this.props.paymentMethods.methods.map(value => ({
      text: this.getType(value),
      value
    }))

    return [
      {
        group: '',
        items: [...cardMethods, ...defaultMethods]
      }
    ]
  }

  renderDisplay = (
    props: {
      value: ElementValueType
    },
    children
  ) => {
    if (!props.value) return
    if (!this.props.formValues) return
    if (!this.props.formValues.pair) return

    const fiat = getFiatFromPair(this.props.formValues.pair.pair)
    const isItem = !children

    return (
      <DisplayContainer isItem={isItem}>
        {this.getIcon(props.value)}
        <Display>
          {children || this.getType(props.value)}
          <Limit>
            {Currency.fiatToString({
              value: convertBaseToStandard('FIAT', props.value.limits.max),
              unit: fiat
            })}
          </Limit>
        </Display>
      </DisplayContainer>
    )
  }

  render () {
    return (
      <Field
        component={SelectBoxMethod}
        elements={this.renderElements()}
        hideIndicator={this.props.paymentMethods.methods.length <= 1}
        name='method'
        openMenuOnClick={this.props.paymentMethods.methods.length > 1}
        searchEnabled={false}
        templateDisplay={this.renderDisplay}
        templateItem={this.renderDisplay}
      />
    )
  }
}

type ElementValueType = Exclude<SBCheckoutFormValuesType['method'], undefined>

export default MethodSelect
