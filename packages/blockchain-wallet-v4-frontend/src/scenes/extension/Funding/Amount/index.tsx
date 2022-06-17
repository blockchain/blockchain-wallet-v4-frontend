import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { IconChevronDown } from '@blockchain-com/icons'
import styled from 'styled-components'

import { getRatesSelector } from '@core/redux/data/misc/selectors'
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
  margin-bottom: 90px;
  text-transform: uppercase;
  text-align: center;
  color: #98a1b2;
`
class CurrencyAmounts {
  public eth: number

  public usd: number

  constructor(eth = 0, usd = 0) {
    this.eth = eth
    this.usd = usd
  }
}

enum Currencies {
  'eth' = 'usd',
  'usd' = 'eth'
}

export const Amount = (props) => {
  const [fundingAmount, setFundingAmount] = useState<string>('0')
  const [currencyAmounts, setCurrencyAmounts] = useState(new CurrencyAmounts())
  const [fundingCurrency, setFundingCurrency] = useState<string>('usd')
  const {
    rate: {
      data: { price }
    }
  } = props

  const changeCurrency = () => {
    setFundingCurrency(Currencies[fundingCurrency])
  }

  const exchangeCurrency = () => {
    if (fundingCurrency === Currencies.eth) {
      return +(Number(fundingAmount) / price).toFixed(4)
    }
    return +(Number(fundingAmount) * price).toFixed(4)
  }

  useEffect(() => {
    setCurrencyAmounts((currencies: CurrencyAmounts) => {
      currencies[fundingCurrency] = fundingAmount
      currencies[Currencies[fundingCurrency]] = exchangeCurrency()
      return { ...currencies }
    })
  }, [fundingAmount])

  return (
    <>
      <FundingHeading>Enter amount</FundingHeading>
      <AmountInputWrapper>
        <AmountInput
          type='number'
          value={fundingAmount}
          onChange={(e) => setFundingAmount(e.target.value)}
        />
        <AmountCurrency onClick={changeCurrency} style={{ textTransform: 'uppercase' }}>
          {`${fundingCurrency} `}
          <IconChevronDown />
        </AmountCurrency>
      </AmountInputWrapper>
      <ExchangedValue>{`${exchangeCurrency()} ${Currencies[fundingCurrency]}`}</ExchangedValue>
      <ListItemContent style={{ margin: '30px 0' }}>
        <Text size='16px' lineHeight='24px' color='#fff'>
          Gas Fee
        </Text>
        <Text size='16px' lineHeight='24px' color='#fff' style={{ textAlign: 'right' }}>
          {`${0.0001} ETH`}
        </Text>
        <Text />
        <Text size='14px' lineHeight='20px' style={{ textAlign: 'right' }}>
          {`${2} USD`}
        </Text>
      </ListItemContent>
      <ListItemContent style={{ margin: '30px 0' }}>
        <Text size='16px' lineHeight='24px' color='#fff'>
          Total
        </Text>
        <Text size='16px' lineHeight='24px' color='#fff' style={{ textAlign: 'right' }}>
          {`${currencyAmounts.eth} ETH`}
        </Text>
        <Text />
        <Text size='14px' lineHeight='20px' style={{ textAlign: 'right' }}>
          {`${currencyAmounts.usd} USD`}
        </Text>
      </ListItemContent>
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

const mapStateToProps = (state) => ({
  rate: getRatesSelector('ETH', state)
})

export default connect(mapStateToProps, null)(Amount)
