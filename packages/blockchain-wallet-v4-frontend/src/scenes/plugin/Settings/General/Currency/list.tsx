import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'
import styled from 'styled-components'

import { selectors } from 'data'

export const CurrenciesList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 30px;
  padding-left: 0;
  list-style: none;
  overflow-y: scroll;
  height: 320px;
`

export const CurrencySelectButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.white};
  cursor: pointer;
`

export const CurrecyItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  span {
    &:last-child {
      font-size: 14px;
      line-height: 20px;
      color: ${(props) => props.theme.grey400};
    }
  }
`
const StyledSearch = styled.input`
  padding: 12px 16px;
  margin-bottom: 17px auto 32px;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  border: 1px solid ${(props) => props.theme.grey700};
  color: ${(props) => props.theme.white};
  outline: none;
`

const List = (props) => {
  const currencies = [
    { text: 'Australian Dollar', value: 'AUD' },
    { text: 'Argentine Peso', value: 'ARS' },
    { text: 'Brazil Real', value: 'BRL' },
    { text: 'Canadian Dollar', value: 'CAD' },
    { text: 'Chilean Peso', value: 'CLP' },
    { text: 'Chinese Yuan', value: 'CNY' },
    { text: 'Danish Krone', value: 'DKK' },
    { text: 'Euros', value: 'EUR' },
    { text: 'Pounds', value: 'GBP' },
    { text: 'Hong Kong Dollar', value: 'HKD' },
    { text: 'Icelandic Króna', value: 'ISK' },
    { text: 'Indian Rupee', value: 'INR' },
    { text: 'Japanese Yen', value: 'JPY' },
    { text: 'New Taiwan Dollar', value: 'TWD' },
    { text: 'New Zealand Dollar', value: 'NZD' },
    { text: 'Polish Zloty', value: 'PLN' },
    { text: 'Russian Ruble', value: 'RUB' },
    { text: 'Singapore Dollar', value: 'SGD' },
    { text: 'South Korean Won', value: 'KRW' },
    { text: 'Swedish Krona', value: 'SEK' },
    { text: 'Swiss Franc', value: 'CHF' },
    { text: 'Thai Baht', value: 'THB' },
    { text: 'U.S. Dollar', value: 'USD' }
  ]
  const [searchedCurrency, setSearchedCurrency] = useState('')
  const { input } = props
  const { onChange } = input
  const selectedCurrency = useSelector(selectors.core.settings.getCurrency)
  const searchCurrency = (e) => {
    setSearchedCurrency(e.target.value.toLowerCase())
  }

  const selectCurrency = (value) => {
    onChange(value)
  }

  return (
    <>
      <StyledSearch
        type='text'
        value={searchedCurrency}
        onChange={searchCurrency}
        placeholder='Search currency'
      />
      <CurrenciesList>
        {currencies
          .filter(
            (currency) =>
              currency.value.toLowerCase().includes(searchedCurrency) ||
              currency.text.toLowerCase().includes(searchedCurrency)
          )
          .map((currency) => (
            <li key={currency.value}>
              <CurrencySelectButton onClick={() => selectCurrency(currency.value)}>
                <CurrecyItemWrapper>
                  <span>{currency.text}</span>
                  <span>{currency.value}</span>
                </CurrecyItemWrapper>
                {currency.value === selectedCurrency.data && (
                  <Icon color='white800' label='IconCheckCircle' size='md'>
                    <IconCheckCircle />
                  </Icon>
                )}
              </CurrencySelectButton>
            </li>
          ))}
      </CurrenciesList>
    </>
  )
}

export default List
