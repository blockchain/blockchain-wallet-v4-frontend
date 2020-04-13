import { Field } from 'redux-form'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import { Icon } from 'blockchain-info-components'
import { Props } from '../template.success'
import { SBPaymentMethodType } from 'core/types'
import { SelectBox } from 'components/Form'
import React, { PureComponent } from 'react'
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

class MethodSelect extends PureComponent<Props> {
  state = {}

  getType = (type: 'BANK_TRANSFER' | 'CARD') => {
    switch (type) {
      case 'BANK_TRANSFER':
        return 'Bank Wire Transfer'
      case 'CARD':
        return 'Credit or Debit Card'
    }
  }

  getIcon = (type: 'BANK_TRANSFER' | 'CARD'): keyof IcoMoonType => {
    switch (type) {
      case 'BANK_TRANSFER':
        return 'bank-filled'
      case 'CARD':
        return 'credit-card-filled'
    }
  }

  renderElements = () => {
    return [
      {
        group: '',
        items: this.props.paymentMethods.methods.map(value => ({
          text: this.getType(value.type),
          value
        }))
      }
    ]
  }

  renderDisplay = (props: { value: SBPaymentMethodType }, children) => {
    if (!props.value) return
    if (!this.props.formValues) return

    const icon = this.getIcon(props.value.type)
    const isItem = !children

    return (
      <DisplayContainer isItem={isItem}>
        <IconContainer>
          <Icon size='18px' color='blue600' name={icon} />
        </IconContainer>
        <Display>{children || this.getType(props.value.type)}</Display>
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

export default MethodSelect
