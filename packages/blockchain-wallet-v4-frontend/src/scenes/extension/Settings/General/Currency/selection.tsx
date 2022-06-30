import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import SelectBoxCurrency from 'components/Form/SelectBoxCurrency'

const SelectWrapper = styled.div`
  margin-top: 42px;
  & > div {
    background-color: ${(props) => props.theme.exchangeLogin};
  }
  .bc__menu {
    background-color: ${(props) => props.theme.exchangeLogin};
    border: none;
  }
  .bc__option {
    padding: 0;
    margin: 0 0 54px;
    background-color: ${(props) => props.theme.exchangeLogin};
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: ${(props) => props.theme.white};

    &.bc__option--is-focused.bc__option--is-selected,
    &.bc__option--is-focused,
    &.bc__option--is-selected {
      background-color: ${(props) => props.theme.exchangeLogin};
      &:after {
        color: ${(props) => props.theme.white};
        background-color: ${(props) => props.theme.exchangeLogin};
        transform: translateY(-50%) scale(1.4);
      }
    }
  }
  .bc__single-value {
    font-weight: 600;
    color: ${({ theme }) => theme.white};
  }
  .bc__menu-list {
    margin: 2px;
  }
  .bc__control {
    border: none;
    background-color: ${(props) => props.theme.exchangeLogin};
    .bc__value-container {
      padding: 12px 16px;
    }
    &.bc__control--is-focused {
      border: none;
      background-color: ${(props) => props.theme.exchangeLogin};
    }
    &.bc__control--menu-is-open {
      .bc__value-container {
        border: 1px solid ${(props) => props.theme.grey700};
        border-radius: 8px;
      }
      .bc__indicator {
        display: none;
      }
      &:hover {
        border: none;
      }
    }
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
