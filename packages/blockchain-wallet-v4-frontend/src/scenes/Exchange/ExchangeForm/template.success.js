import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import { contains, head, last } from 'ramda'

import { model } from 'data'
import media from 'services/ResponsiveService'
import { formatTextAmount } from 'services/ValidationHelper'

import { Banner, Icon, Text } from 'blockchain-info-components'
import { Form, AutosizeTextBox } from 'components/Form'
import { ResizeableFontInputHOC } from 'components/ResizeableFontInputHOC'
import { Wrapper as BorderWrapper } from 'components/Exchange'
import { Row } from './Layout'
import CurrencySelect from './CurrencySelect'
import ComplementaryAmount from './ComplementaryAmount'
import DemoHeader from './DemoHeader'
import Error from './Error'
import LimitInfo from './LimitInfo'
import VerificationInfo from './VerificationInfo'
import MinMaxButtons from './MinMaxButtons'
import SubmitButton from './SubmitButton'
import Summary from './Summary'
import SwapReceiveSwitch from './SwapReceiveSwitch'

const { fiatActive, formatPair } = model.rates

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 160px;
  box-sizing: border-box;
  padding: 30px;

  ${media.mobile`
  `};

  ${({ isDemo }) =>
    isDemo ? "background-image: url('/img/exchange-demo-badge.png');" : ''};

  ${media.mobile`
    align-items: center;
    padding: 10px;
  `};
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  ${media.mobile`
    flex-direction: column;
  `};
`

const ColumnLeft = styled.div`
  margin-right: 34px;
  max-width: 450px;
  width: 60%;
  border-radius: 8px;
  align-self: stretch;
  ${media.mobile`
    margin-right: 0;
    margin-bottom: 20px;
    width: 100%;
  `};
`
const ColumnRight = styled.div`
  max-width: 350px;
  width: 100%;
  align-self: center;
  @media (min-width: 992px) {
    align-self: stretch;
    max-width: 345px;
    width: 40%;
  }
`
const AmountRow = styled(Row)`
  position: relative;
  padding: 16px 32px 0 32px;
  justify-content: center;
  border: 4px solid transparent;
`
const ComplementaryRow = styled(Row)`
  padding: 0 32px;
`

const AmountTextBox = styled(ResizeableFontInputHOC(AutosizeTextBox))`
  height: 86px;
  max-width: ${({ fiatActive }) => (fiatActive ? '100%' : '80%')};
  > div {
    border: none;
    height: 100%;
    padding: 0;
    display: flex !important;
    flex-direction: row;
    justify-content: center;
  }
  input {
    outline: 0;
    position: relative;
    font-weight: 300;
    font-size: 72px;
    line-height: 88px;
    height: 88px;
    padding: 0;
    width: 100%;
    min-width: 45px;
    max-width: 100%;
    border: none;
    text-align: center;
    font-family: Montserrat;
    color: ${props => props.theme['gray-5']};
    background-color: ${props => props.theme['white']};
  }
`
const CoinFiatSwapIcon = styled(Icon)`
  font-size: 24px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['brand-primary']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme['gray-1'] : props.theme['brand-secondary']};
  }
`
const FormWrapper = styled(BorderWrapper)`
  padding: 0;
  background-color: ${props => props.theme.white};
`
const CurrencyBox = styled(Text)`
  align-self: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 88px;
  font-size: 72px;
  font-weight: 300;
  background-color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['white']};
`
const LockboxWarning = styled(Row)`
  padding: 20px 30px 0;
`

const normalizeAmount = (value, prevValue, allValues, ...args) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, fiatActive(allValues.fix))
}

const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
  const amountRowNode = inputNode.closest('#amount-row')
  const currencyNode = isFiat
    ? head(amountRowNode.children)
    : last(amountRowNode.children)
  currencyNode.style.fontSize = `${fontSizeNumber * fontSizeRatio}px`
}

const Success = ({
  availablePairs,
  blockLockbox,
  complementaryField,
  complementarySymbol,
  currency,
  fiatActive,
  fix,
  inputField,
  inputSymbol,
  isDemo,
  sourceCoin,
  targetCoin,
  volume,
  handleAmountChange,
  handleInputBlur,
  handleInputFocus,
  handleSubmit,
  swapCoinAndFiat,
  swapFix
}) => {
  const swapDisabled = !contains(
    formatPair(targetCoin, sourceCoin),
    availablePairs
  )
  return (
    <Wrapper isDemo={isDemo}>
      {isDemo && <DemoHeader />}
      <Container>
        <ColumnLeft>
          <FormWrapper>
            <Form>
              <SwapReceiveSwitch
                fix={fix}
                sourceCoin={sourceCoin}
                targetCoin={targetCoin}
                swapFix={swapFix}
              />
              <CurrencySelect
                sourceCoin={sourceCoin}
                targetCoin={targetCoin}
                availablePairs={availablePairs}
              />
              {blockLockbox && (
                <LockboxWarning>
                  <Banner type='warning'>
                    <Text color='warning' size='12px'>
                      <FormattedMessage
                        id='scenes.exchange.exchangeform.blocklockbox'
                        defaultMessage='Sending from Lockbox can only be done while using the Chrome browser'
                      />
                    </Text>
                  </Banner>
                </LockboxWarning>
              )}
              <AmountRow id='amount-row'>
                {fiatActive && <CurrencyBox>{inputSymbol}</CurrencyBox>}
                <Field
                  name={inputField}
                  autoComplete='off'
                  noLastPass
                  placeholder='0'
                  onChange={handleAmountChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  normalize={normalizeAmount}
                  onUpdate={resizeSymbol.bind(null, fiatActive)}
                  component={AmountTextBox}
                  fiatActive={fiatActive}
                  maxFontSize='72px'
                  data-e2e='exchangeAmountInput'
                />
                {!fiatActive && <CurrencyBox>{inputSymbol}</CurrencyBox>}
              </AmountRow>
              <ComplementaryRow>
                <CoinFiatSwapIcon
                  style={{ visibility: 'hidden' }}
                  name='vertical-arrow-switch'
                  size='28px'
                  weight={500}
                  cursor
                  disabled
                />
                <ComplementaryAmount
                  isFiat={!fiatActive}
                  sourceCoin={sourceCoin}
                  targetCoin={targetCoin}
                  complementaryField={complementaryField}
                  complementarySymbol={complementarySymbol}
                />
                <CoinFiatSwapIcon
                  name='vertical-arrow-switch'
                  size='28px'
                  weight={500}
                  cursor
                  disabled={swapDisabled}
                  onClick={() => {
                    if (!swapDisabled) swapCoinAndFiat()
                  }}
                  data-e2e='exchangeCoinFiatSwapButton'
                />
              </ComplementaryRow>
              <Error />
              <MinMaxButtons />
              <SubmitButton
                blockLockbox={blockLockbox}
                volume={volume}
                handleSubmit={handleSubmit}
                isDemo={isDemo}
              />
              <LimitInfo />
            </Form>
          </FormWrapper>
          <VerificationInfo />
        </ColumnLeft>
        <ColumnRight>
          <Summary
            showDemoSummary={isDemo && (!volume || volume === '0')}
            sourceCoin={sourceCoin}
            targetCoin={targetCoin}
            currency={currency}
          />
        </ColumnRight>
      </Container>
    </Wrapper>
  )
}

export default Success
