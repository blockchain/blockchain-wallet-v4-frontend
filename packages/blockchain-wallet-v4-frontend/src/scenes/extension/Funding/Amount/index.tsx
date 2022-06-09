import React, { Dispatch, SetStateAction, useState } from 'react'
import { IconChevronDown } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { Continue, FundingHeading, ListItemContent } from '../SelectAccount'

const AmountInputWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
`

const AmountInput = styled.input`
  width: 140px;
  background: transparent;
  color: white;
  border: none;
  font-size: 40px;
  font-weight: 600;
  line-height: 50px;
  caret-color: #65a5ff;
  text-align: center;
  &:focus {
    outline: none;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`
const AmountCurrency = styled.span`
  position: absolute;
  right: 20px;
  width: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  cursor: pointer;
  white-space: nowrap;
`
const ExchangedValue = styled.div`
  text-align: center;
  margin-bottom: 90px;
  color: #98a1b2;
`

enum CurrencyExchangeLabel {
  'ETH' = 'USD',
  'USD' = 'ETH'
}

/** TODO: remove after connection to api */
class MockGasFee {
  public label: string

  public eth: string

  public usd: string

  constructor(label, eth, usd) {
    this.label = label
    this.eth = eth
    this.usd = usd
  }
}

export const Amount = () => {
  const [fundingAmount, setFundingAmount] = useState<string>('0')
  const [fundingCurrency, setFundingCurrency] = useState<string>('USD')
  const MOCK_CURRENCY_MULTIPLIER = 2400

  const mockedFees = [
    new MockGasFee('Gas Fee', '5.3655 ETH', '5.3655 USD'),
    new MockGasFee('Total', '5.3655 ETH', '5.3655 USD')
  ]

  const changeCurrency = () => {
    setFundingCurrency(CurrencyExchangeLabel[fundingCurrency])
  }

  const exchangeCurrency = () => {
    if (fundingCurrency === 'USD') {
      return `${Number(fundingAmount) / MOCK_CURRENCY_MULTIPLIER} ETH`
    }
    return `${Number(fundingAmount) * MOCK_CURRENCY_MULTIPLIER} USD`
  }

  return (
    <>
      <FundingHeading>Enter amount</FundingHeading>
      <AmountInputWrapper>
        <AmountInput
          type='number'
          value={fundingAmount}
          onChange={(e) => setFundingAmount(e.target.value)}
        />
        <AmountCurrency onClick={changeCurrency}>
          {`${fundingCurrency} `}
          <IconChevronDown />
        </AmountCurrency>
      </AmountInputWrapper>
      <ExchangedValue>{exchangeCurrency()}</ExchangedValue>
      {mockedFees.map((gasFee: MockGasFee) => (
        <ListItemContent style={{ margin: '30px 0' }} key={gasFee.label}>
          <Text size='16px' lineHeight='24px' color='#fff'>
            {gasFee.label}
          </Text>
          <Text size='16px' lineHeight='24px' color='#fff' style={{ textAlign: 'right' }}>
            {gasFee.eth}
          </Text>
          <Text />
          <Text size='14px' lineHeight='20px' style={{ textAlign: 'right' }}>
            {gasFee.usd}
          </Text>
        </ListItemContent>
      ))}
      <div style={{ display: 'flex' }}>
        <Continue
          to='/extension/funding/select-account'
          style={{ background: 'none', color: '#65A5FF', marginRight: '10px' }}
        >
          Cancel
        </Continue>
        <Continue to='/extension/funding/success'>Confirm</Continue>
      </div>
    </>
  )
}
