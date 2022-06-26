import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import SelectBoxCurrency from 'components/Form/SelectBoxCurrency'

export const SelectWrapper = styled.div`
  width: 120px;
  margin-top: 42px;
  & > div {
    background-color: ${(props) => props.theme.exchangeLogin};
  }
  .bc__menu {
    background-color: ${(props) => props.theme.exchangeLogin};
    border: none;
  }
  .bc__option {
    padding: 8px 0;
    background-color: ${(props) => props.theme.exchangeLogin};
    &.bc__option--is-focused.bc__option--is-selected,
    &.bc__option--is-focused,
    &.bc__option--is-selected {
      background-color: ${(props) => props.theme.exchangeLogin};
    }
  }
  .bc__control {
    border: none;
    background-color: ${(props) => props.theme.exchangeLogin};
    &.bc__control--is-focused {
      border: none;
    }
    &:hover {
      border: none;
    }
    &.bc__control--menu-is-open {
      background-color: ${({ theme }) => theme.exchangeLogin};
      border: none;
    }
  }
  .bc__value-container {
    padding: 0;
  }
`

const Selection = () => {
  return (
    <div data-e2e='prefsLocalCurrencyInput'>
      <SelectWrapper>
        <Field name='currency' component={SelectBoxCurrency} />
      </SelectWrapper>
    </div>
  )
}

export default reduxForm({ form: 'settingCurrency' })(Selection)
