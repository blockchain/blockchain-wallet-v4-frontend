import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { IconChevronDown } from '@blockchain-com/icons'
import styled from 'styled-components'

import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { Text } from 'blockchain-info-components'

import { Continue, FundingHeading, ListItemContent } from '../SelectAccount'

const AmountListItem = styled(ListItemContent)`
  margin: 30px 0;
`

const AmountInputWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
`

const AmountInput = styled.input`
  width: 140px;
  background: transparent;
  color: ${(props) => props.theme.white};
  border: none;
  font-size: 40px;
  font-weight: 600;
  line-height: 50px;
  caret-color: ${(props) => props.theme.blue600};
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
  text-transform: uppercase;
`
const ExchangedValue = styled.div`
  margin-bottom: 90px;
  text-transform: uppercase;
  text-align: center;
  color: ${(props) => props.theme.grey400};
`
class CurrencyAmounts {
  public eth: number

  public usd: number

  constructor(eth = 0, usd = 0) {
    this.eth = eth
    this.usd = usd
  }
}

/** Exchanges currencies labels */
const CurrenciesExchangePairs: { [key: string]: string } = {
  eth: 'usd',
  usd: 'eth'
}

export const Amount = (props) => {
  /** Input value state */
  const [fundingAmount, setFundingAmount] = useState<string>('0')
  /** Currencies amount state according to exchange rate */
  const [currencyAmounts, setCurrencyAmounts] = useState(new CurrencyAmounts())
  /** Changes appropriate currencyAmount field, and changes visible label */
  const [fundingCurrency, setFundingCurrency] = useState<string>('usd')
  const exchangeRate = props.rate.data

  const changeCurrency = () => {
    setFundingCurrency(CurrenciesExchangePairs[fundingCurrency])
  }

  const exchangeCurrency = () => {
    if (fundingCurrency === 'usd') {
      return parseInt((Number(fundingAmount) / exchangeRate).toFixed(4))
    }
    return parseInt((Number(fundingAmount) * exchangeRate).toFixed(4))
  }

  useEffect(() => {
    setCurrencyAmounts((currencies: CurrencyAmounts) => {
      currencies[fundingCurrency] = fundingAmount
      currencies[CurrenciesExchangePairs[fundingCurrency]] = exchangeCurrency()
      return { ...currencies }
    })
  }, [fundingAmount])

  const RightAlignedText = styled(Text)`
    text-align: right;
  `

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
      <ExchangedValue>{`${exchangeCurrency()} ${
        CurrenciesExchangePairs[fundingCurrency]
      }`}</ExchangedValue>
      <AmountListItem>
        <Text size='16px' lineHeight='24px'>
          Gas Fee
        </Text>
        <RightAlignedText size='16px' lineHeight='24px'>
          {`${0.0001} ETH`}
        </RightAlignedText>
        <Text />
        <RightAlignedText size='14px' lineHeight='20px'>
          {`${2} USD`}
        </RightAlignedText>
      </AmountListItem>
      <AmountListItem>
        <Text size='16px' lineHeight='24px'>
          Total
        </Text>
        <RightAlignedText size='16px' lineHeight='24px'>
          {`${currencyAmounts.eth} ETH`}
        </RightAlignedText>
        <Text />
        <RightAlignedText size='14px' lineHeight='20px'>
          {`${currencyAmounts.usd} USD`}
        </RightAlignedText>
      </AmountListItem>
      <div style={{ display: 'flex' }}>
        <Continue to='/extension/funding/select-account'>
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
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
