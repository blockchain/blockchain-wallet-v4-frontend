import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { contains } from 'ramda'

import { model } from 'data'
import media from 'services/ResponsiveService'
import { formatAmount } from 'services/ValidationHelper'

import {
  Button,
  HeartbeatLoader,
  Icon,
  TooltipHost,
  ButtonGroup,
  Text
} from 'blockchain-info-components'
import { ExchangeButton } from 'components/Exchange'
import { Form, TextBox } from 'components/Form'
import StringDisplay from 'components/Display/StringDisplay'
import SelectBox from './SelectBox'
import { getErrorMessage } from './validationMessages'
import Summary from './Summary'

const {
  EXCHANGE_FORM,
  NO_LIMITS_ERROR,
  MAXIMUM_NO_LINK_ERROR,
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
  background-color: rgba(255, 255, 255, 0.1);
`

const ColumnLeft = styled.div`
  margin-right: 34px;
  @media (min-width: 992px) {
    width: 60%;
  }
  ${media.mobile`
    margin-right: 0;
  `};
`
const ColumnRight = styled.div`
  @media (min-width: 992px) {
    width: 40%;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${props => (props.spaced ? '70px' : '8px')};
`
const AmountRow = styled(Row)`
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
  width: calc(100% - 20px);
`
const Cell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: ${props => (props.size === 'small' ? '10%' : '45%')};
  height: 100%;
`
const MinMaxButtonGroup = styled(ButtonGroup)`
  width: 100%;
  margin: 0;
  > * {
    color: ${props => props.theme['brand-primary']};
  }
`
const MinMaxButton = styled(Button)`
  font-size: 10px;
  justify-content: space-between;
`
const MinMaxValue = styled.div`
  font-weight: 600;
  font-size: 14px;
`
const AmountTextBox = styled(TextBox)`
  height: 86px;
  input {
    position: relative;
    font-weight: 400;
    font-size: 72px;
    line-height: 86px;
    height: 86px;
    padding: 0;
    width: 100%;
    border: none;
    text-align: center;
  }
`
const ComplementaryAmountContaier = styled.div`
  position: relative;
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-weight: 300;
  font-size: 20px;
  line-height: 24px;
  justify-self: center;
  margin: auto;
  margin-top: 10px;
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
  font-weight: 400;
  transform: uppercase;
  background-color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['white']};
`
const CoinSwapIcon = styled(Icon)`
  margin: auto;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['gray-6']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme['gray-1'] : props.theme['brand-secondary']};
  }
`
const CoinFiatSwapIcon = styled(Icon)`
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
  padding: 30px;
  border: 1px solid ${props => props.theme['gray-2']}};
  margin-bottom: 45px;
`
const ErrorRow = styled(Row)`
  justify-content: center;
  min-height: 15px;
`

const normalizeAmount = (value, prevValue, allValues, ...args) => {
  if (isNaN(Number(value))) return prevValue
  return formatAmount(value, fiatActive(allValues.fix))
}

const Success = props => {
  const {
    disabled,
    dirty,
    asyncValidating,
    error,
    submitting,
    canUseExchange,
    availablePairs,
    fromElements,
    toElements,
    hasOneAccount,
    sourceCoin,
    targetCoin,
    sourceActive,
    targetActive,
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
    swapFix,
    swapBaseAndCounter,
    swapCoinAndFiat,
    useMin,
    useMax
  } = props
  const swapDisabled = !contains(
    formatPair(targetCoin, sourceCoin),
    availablePairs
  )
  const minMaxDisabled = contains(error, [
    NO_LIMITS_ERROR,
    MAXIMUM_NO_LINK_ERROR,
    MINIMUM_NO_LINK_ERROR
  ])

  return (
    <Wrapper>
      {!canUseExchange && <Cover />}
      <ColumnLeft>
        <Form onSubmit={handleSubmit}>
          <FieldsWrapper>
            <Row>
              <Cell>
                <ActiveCurrencyButton
                  onClick={() => {
                    if (!disabled && !sourceActive) swapFix()
                  }}
                  checked={sourceActive}
                  coin={sourceCoin.toLowerCase()}
                />
                <Text size='14px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.firststep.from'
                    defaultMessage='Exchange:'
                  />
                </Text>
              </Cell>
              <Cell size='small' />
              <Cell>
                {
                  <ActiveCurrencyButton
                    onClick={() => {
                      if (!disabled && !targetActive) swapFix()
                    }}
                    checked={targetActive}
                    coin={targetCoin.toLowerCase()}
                  />
                }
                <Text size='14px' weight={400}>
                  <FormattedMessage
                    id='scenes.exchange.shapeshift.firststep.to'
                    defaultMessage='Receive:'
                  />
                </Text>
              </Cell>
            </Row>
            <Row height='50px' spaced>
              <Cell>
                <Field
                  name='source'
                  onChange={handleSourceChange}
                  component={SelectBox}
                  elements={fromElements}
                  hasOneAccount={hasOneAccount}
                  disabled={disabled}
                />
              </Cell>
              <TooltipHost id='exchange.changeinput'>
                <Cell size='small'>
                  <CoinSwapIcon
                    name='arrow-switch'
                    size='28px'
                    weight={500}
                    cursor
                    disabled={swapDisabled}
                    onClick={() => {
                      if (!disabled && !swapDisabled) swapBaseAndCounter()
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
                  hasOneAccount={hasOneAccount}
                  disabled={disabled}
                />
              </Cell>
            </Row>
            <AmountRow>
              <CurrencyBox>{inputSymbol}</CurrencyBox>
              <Field
                name={inputField}
                autoComplete='off'
                onChange={handleAmountChange}
                normalize={normalizeAmount}
                component={AmountTextBox}
              />
              <CurrencyBox style={{ visibility: 'hidden' }}>
                {inputSymbol}
              </CurrencyBox>
            </AmountRow>
            <AmountRow>
              <CoinFiatSwapIcon
                style={{ visibility: 'hidden' }}
                name='vertical-arrow-switch'
                size='28px'
                weight={500}
                cursor
                disabled={true}
              />
              <ComplementaryAmountContaier>
                <StringDisplay>
                  {complementaryAmount.map(
                    amount => `${amount} ${complementarySymbol}`
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
                  if (!disabled && !swapDisabled) swapCoinAndFiat()
                }}
              />
            </AmountRow>
            <ErrorRow spaced>{error && getErrorMessage(error)}</ErrorRow>
            <Row>
              <MinMaxButtonGroup>
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
                  <MinMaxValue>{!minMaxDisabled && min}</MinMaxValue>
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
                  <MinMaxValue>{!minMaxDisabled && max}</MinMaxValue>
                </MinMaxButton>
              </MinMaxButtonGroup>
            </Row>
          </FieldsWrapper>
          <ExchangeButton
            type='submit'
            nature='primary'
            disabled={
              disabled ||
              asyncValidating ||
              submitting ||
              !dirty ||
              (dirty && error)
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
          </ExchangeButton>
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
