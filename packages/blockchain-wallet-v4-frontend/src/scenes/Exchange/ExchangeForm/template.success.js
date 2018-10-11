import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { contains, isNil, gte } from 'ramda'

import { model } from 'data'
import media from 'services/ResponsiveService'
import { formatTextAmount } from 'services/ValidationHelper'

import {
  Button,
  HeartbeatLoader,
  Icon,
  TooltipHost,
  Text
} from 'blockchain-info-components'
import { Form, AutosizeTextBox } from 'components/Form'
import { ResizeableFontInputHOC } from 'components/ResizeableFontInputHOC'
import StringDisplay from 'components/Display/StringDisplay'
import SelectBox from './SelectBox'
import { getErrorMessage } from './validationMessages'
import Summary from './Summary'

const {
  EXCHANGE_FORM,
  NO_LIMITS_ERROR,
  REACHED_DAILY_ERROR,
  REACHED_WEEKLY_ERROR,
  REACHED_ANNUAL_ERROR,
  MINIMUM_NO_LINK_ERROR
} = model.components.exchange
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

const Cover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.6);
`

const ColumnLeft = styled.div`
  margin-right: 34px;
  max-width: 550px;
  width: 60%;
  ${media.mobile`
    margin-right: 0;
    margin-bottom: 20px;
    width: 100%;
  `};
`
const ColumnRight = styled.div`
  max-width: 450px;
  width: 100%;
  @media (min-width: 992px) {
    max-width: 345px;
    width: 40%;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 30px;
  width: 100%;
`
const SelectSourceRow = styled(Row)`
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const AmountRow = styled(Row)`
  position: relative;
  padding: 10px 30px;
  justify-content: center;
  border: 4px solid transparent;
`
const Cell = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${props => (props.center ? 'center' : 'flex-start')};
  width: ${props => (props.size === 'small' ? '10%' : '45%')};
  height: 100%;
`
const MinMaxButton = styled(Button)`
  width: 48%;
  font-size: 10px;
  justify-content: space-between;
  > * {
    color: ${props => props.theme['brand-primary']};
  }
`
const MinMaxValue = styled.div`
  font-weight: 600;
  font-size: 14px;
`
const AmountTextBox = styled(ResizeableFontInputHOC(AutosizeTextBox))`
  height: 86px;
  max-width: 100%;
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
    line-height: 86px;
    height: 86px;
    padding: 0;
    width: 100%;
    min-width: 45px;
    max-width: 100%;
    border: none;
    text-align: center;
    color: ${props => props.theme['gray-5']};
  }
`
const ComplementaryAmountContaier = styled.div`
  font-weight: 200;
  font-size: 20px;
  line-height: 24px;
  position: relative;
  font-family: 'Montserrat', Helvetica, sans-serif;
  justify-self: center;
  margin: auto;
  margin-top: 10px;
`
const CoinSwapIcon = styled(Icon)`
  font-size: 18px;
  margin: 0 15px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['gray-6']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme['gray-1'] : props.theme['brand-secondary']};
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
const ActiveCurrencyButton = styled.div`
  cursor: pointer;
  height: 12px;
  width: 12px;
  background-color: ${props => props.checked && props.theme[props.coin]};
  border-radius: 8px;
  border: ${props => props.checked && '2px solid'}
    ${props => props.theme['white']};
  border-color: ;
  margin-right: 8px;
  box-shadow: 0 0 0 1px ${props => props.theme[props.coin]};
`
const FieldsWrapper = styled.div`
  border: 1px solid ${props => props.theme['gray-1']}};
`
const ErrorRow = styled(Row)`
  justify-content: center;
  min-height: 15px;
  padding: 0px;
`
const ButtonRow = styled(Row)`
  border: 1px solid ${props => props.theme['gray-1']}};
  border-top: none;
`
const CurrencyBox = styled(Text)`
  align-self: flex-start;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 38px;
  font-size: ${props => (props.coinActive ? '20px' : '32px')};
  font-weight: 300;
  transform: uppercase;
  background-color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['white']};
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const normalizeAmount = (value, prevValue, allValues, ...args) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, fiatActive(allValues.fix))
}

export const formatAmount = (isFiat, symbol, value) =>
  isFiat ? `${symbol}${value}` : `${value} ${symbol}`

const Success = props => {
  const {
    dirty,
    asyncValidating,
    error,
    submitting,
    canUseExchange,
    disabled,
    availablePairs,
    fromElements,
    toElements,
    sourceCoin,
    targetCoin,
    sourceActive,
    targetActive,
    fiatActive,
    inputField,
    inputSymbol,
    complementaryAmount,
    complementarySymbol,
    min,
    max,
    handleSubmit,
    handleSourceChange,
    handleTargetChange,
    handleAmountChange,
    handleInputFocus,
    handleInputBlur,
    swapFix,
    swapBaseAndCounter,
    swapCoinAndFiat,
    useMin,
    useMax,
    volume,
    showError,
    txError
  } = props
  const swapDisabled = !contains(
    formatPair(targetCoin, sourceCoin),
    availablePairs
  )
  const minMaxDisabled =
    contains(error, [
      NO_LIMITS_ERROR,
      MINIMUM_NO_LINK_ERROR,
      REACHED_DAILY_ERROR,
      REACHED_WEEKLY_ERROR,
      REACHED_ANNUAL_ERROR
    ]) ||
    gte(min, max) ||
    isNil(min) ||
    isNil(max)

  return (
    <Wrapper>
      {!canUseExchange && <Cover />}
      <ColumnLeft>
        <Form onSubmit={handleSubmit}>
          <FieldsWrapper>
            <SelectSourceRow height='50px' spaced>
              <Cell>
                <Field
                  name='source'
                  onChange={handleSourceChange}
                  component={SelectBox}
                  elements={fromElements}
                />
              </Cell>
              <TooltipHost id='exchange.changeinput'>
                <Cell size='small'>
                  <CoinSwapIcon
                    name='arrow-switch'
                    size='24px'
                    weight={500}
                    cursor
                    disabled={swapDisabled}
                    onClick={() => {
                      if (!swapDisabled) swapBaseAndCounter()
                    }}
                  />
                </Cell>
              </TooltipHost>
              <Cell>
                <Field
                  name='target'
                  onChange={handleTargetChange}
                  component={SelectBox}
                  elements={toElements}
                />
              </Cell>
            </SelectSourceRow>
            <Row>
              <Cell center>
                <ActiveCurrencyButton
                  onClick={() => {
                    if (!sourceActive) swapFix()
                  }}
                  checked={sourceActive}
                  coin={sourceCoin.toLowerCase()}
                />
                <ClickableText
                  onClick={() => {
                    if (!sourceActive) swapFix()
                  }}
                  size='14px'
                  weight={400}
                >
                  <FormattedMessage
                    id='scenes.exchange.exchangeform.from'
                    defaultMessage='Exchange'
                  />
                </ClickableText>
              </Cell>
              <Cell size='small' />
              <Cell center>
                {
                  <ActiveCurrencyButton
                    onClick={() => {
                      if (!targetActive) swapFix()
                    }}
                    checked={targetActive}
                    coin={targetCoin.toLowerCase()}
                  />
                }
                <ClickableText
                  onClick={() => {
                    if (!targetActive) swapFix()
                  }}
                  size='14px'
                  weight={400}
                >
                  <FormattedMessage
                    id='scenes.exchange.exchangeform.to'
                    defaultMessage='Receive'
                  />
                </ClickableText>
              </Cell>
            </Row>
            <AmountRow>
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
                component={AmountTextBox}
                maxFontSize='72px'
              />
              {!fiatActive && <CurrencyBox>{inputSymbol}</CurrencyBox>}
            </AmountRow>
            <AmountRow>
              <CoinFiatSwapIcon
                style={{ visibility: 'hidden' }}
                name='vertical-arrow-switch'
                size='28px'
                weight={500}
                cursor
                disabled
              />
              <ComplementaryAmountContaier>
                <StringDisplay>
                  {complementaryAmount.map(amount =>
                    formatAmount(!fiatActive, complementarySymbol, amount)
                  )}
                </StringDisplay>
              </ComplementaryAmountContaier>
              <CoinFiatSwapIcon
                name='vertical-arrow-switch'
                size='28px'
                weight={500}
                cursor
                disabled={swapDisabled}
                onClick={() => {
                  if (!swapDisabled) swapCoinAndFiat()
                }}
              />
            </AmountRow>
            <ErrorRow>
              {(showError || txError) &&
                (error || txError) &&
                getErrorMessage(txError || error)(props)}
            </ErrorRow>
            <Row>
              <MinMaxButton
                fullwidth
                disabled={minMaxDisabled}
                onClick={useMin}
              >
                <FormattedMessage
                  id='scenes.exchange.exchangeform.min'
                  defaultMessage='MIN'
                />
                &nbsp;
                <MinMaxValue>
                  {!minMaxDisabled &&
                    formatAmount(fiatActive, inputSymbol, min)}
                </MinMaxValue>
              </MinMaxButton>
              <MinMaxButton
                fullwidth
                disabled={minMaxDisabled}
                onClick={useMax}
              >
                <FormattedMessage
                  id='scenes.exchange.exchangeform.max'
                  defaultMessage='MAX'
                />
                &nbsp;
                <MinMaxValue>
                  {!minMaxDisabled &&
                    formatAmount(fiatActive, inputSymbol, max)}
                </MinMaxValue>
              </MinMaxButton>
            </Row>
          </FieldsWrapper>
          <ButtonRow>
            <Button
              type='submit'
              nature='primary'
              fullwidth
              disabled={
                disabled ||
                asyncValidating ||
                submitting ||
                !dirty ||
                volume === '0' ||
                !volume ||
                (volume && error) ||
                txError
              }
            >
              {!disabled && !asyncValidating && !submitting ? (
                <FormattedMessage
                  id='scenes.exchange.exchangeform.exchange'
                  defaultMessage='Exchange {source} for {target}'
                  values={{
                    source: sourceCoin,
                    target: targetCoin
                  }}
                />
              ) : (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              )}
            </Button>
          </ButtonRow>
        </Form>
      </ColumnLeft>
      <ColumnRight>
        <Summary {...props} />
      </ColumnRight>
    </Wrapper>
  )
}

export default reduxForm({
  form: EXCHANGE_FORM,
  destroyOnUnmount: false,
  enableReinitialize: true
})(Success)
