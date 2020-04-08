import { AutosizeTextBox, Form } from 'components/Form'
import { Banner, Icon, Text } from 'blockchain-info-components'
import { Wrapper as BorderWrapper, Note } from 'components/Exchange'
import { Cell, Row } from './Layout'
import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { formatTextAmount } from 'services/ValidationHelper'
import { head, includes, last } from 'ramda'
import { model } from 'data'
import { ResizeableFontInputHOC } from 'components/ResizeableFontInputHOC'
import ComplementaryAmount from './ComplementaryAmount'
import CurrencySelect from './CurrencySelect'
import Error from './Error'
import LimitInfo from './LimitInfo'
import media from 'services/ResponsiveService'
import MinMaxButtons from './MinMaxButtons'
import Notifications from './Notifications'
import RatesBox from './RatesBox'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import SubmitButton from './SubmitButton'
import Summary from './Summary'

const { fiatActive, formatPair } = model.rates

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;

  ${media.mobile`
    border: 0px;
    padding: 0;
    flex-direction: column;
  `};
`

const ColumnLeft = styled.div`
  margin-right: 34px;
  max-width: 450px;
  width: 60%;
  border-radius: 8px;
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
    align-self: flex-start;
    max-width: 345px;
    width: 40%;
  }
`
const SwapReceiveRow = styled(Row)`
  padding: 22px 32px 0 32px;
`
const SwapReceiveGap = styled(Cell)`
  min-width: 50px;
`
const AmountRow = styled(Row)`
  position: relative;
  padding: 4px 32px 0 32px;
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
    font-weight: 400;
    font-size: 72px;
    line-height: 88px;
    height: 88px;
    padding: 0;
    width: 100%;
    min-width: 45px;
    max-width: 100%;
    border: none;
    text-align: center;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${props => props.theme.grey700};
    background-color: ${props => props.theme.white};
  }
`
const CoinFiatSwapIcon = styled(Icon)`
  font-size: 24px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme.grey000 : props.theme.blue900};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme.grey000 : props.theme.blue600};
  }
`
const ActiveCurrencyButton = styled.div`
  cursor: pointer;
  height: 11px;
  width: 11px;
  background-color: ${props => props.checked && props.theme[props.coin]};
  border-radius: 8px;
  margin-right: 8px;
  border: 1px solid
    ${props =>
      props.checked ? props.theme[props.coin] : props.theme['grey500']};
`
const FormWrapper = styled(BorderWrapper)`
  padding: 0;
`
const CurrencyBox = styled(Text)`
  align-self: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 88px;
  font-size: 72px;
  font-weight: 400;
  background-color: ${props =>
    props.disabled ? props.theme.grey000 : props.theme.white};
`
const ClickableText = styled(Text)`
  cursor: pointer;
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
  initialize,
  inputField,
  inputSymbol,
  sourceActive,
  sourceCoin,
  targetActive,
  targetCoin,
  volume,
  handleAmountChange,
  handleInputBlur,
  handleInputFocus,
  handleSubmit,
  swapCoinAndFiat,
  swapFix
}) => {
  const swapDisabled = !includes(
    formatPair(targetCoin, sourceCoin),
    availablePairs
  )

  useEffect(() => {
    return initialize()
  }, [])

  return (
    <Wrapper>
      <ColumnLeft>
        <FormWrapper>
          <Form>
            <SwapReceiveRow>
              <Cell>
                <ActiveCurrencyButton
                  data-e2e='exchangeExchangeRadioButton'
                  onClick={() => {
                    if (!sourceActive) swapFix()
                  }}
                  checked={sourceActive}
                  coin={sourceCoin.toLowerCase()}
                />
                <ClickableText
                  data-e2e='exchangeExchangeRadioText'
                  onClick={() => {
                    if (!sourceActive) swapFix()
                  }}
                  size='14px'
                  weight={500}
                >
                  <FormattedMessage
                    id='scenes.exchange.exchangeform.swap'
                    defaultMessage='Swap'
                  />
                </ClickableText>
              </Cell>
              <SwapReceiveGap size='small' />
              <Cell>
                {
                  <ActiveCurrencyButton
                    data-e2e='exchangeReceiveRadioButton'
                    onClick={() => {
                      if (!targetActive) swapFix()
                    }}
                    checked={targetActive}
                    coin={targetCoin.toLowerCase()}
                  />
                }
                <ClickableText
                  data-e2e='exchangeReceiveRadioText'
                  onClick={() => {
                    if (!targetActive) swapFix()
                  }}
                  size='14px'
                  weight={500}
                >
                  <FormattedMessage
                    id='scenes.exchange.exchangeform.to'
                    defaultMessage='Receive'
                  />
                </ClickableText>
              </Cell>
            </SwapReceiveRow>
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
                      id='scenes.exchange.exchangeform.blockbrowser'
                      defaultMessage='Sending from Lockbox can only be done while using the Brave, Chrome, Firefox or Opera browsers.'
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
            />
            <LimitInfo />
          </Form>
        </FormWrapper>
        <Notifications sourceCoin={sourceCoin} targetCoin={targetCoin} />
      </ColumnLeft>
      <ColumnRight>
        <Summary
          sourceCoin={sourceCoin}
          targetCoin={targetCoin}
          currency={currency}
        />
        <RatesBox
          sourceCoin={sourceCoin}
          targetCoin={targetCoin}
          currency={currency}
        />
        <Note>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.note'
            defaultMessage='All amounts are correct at this time but may change depending on the market price and network congestion at the time of your transaction.'
          />
        </Note>
      </ColumnRight>
    </Wrapper>
  )
}

export default Success
