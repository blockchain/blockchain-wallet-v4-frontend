import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { isEmpty, contains } from 'ramda'

import { model } from 'data'

import {
  Button,
  HeartbeatLoader,
  Icon,
  TooltipHost,
  ButtonGroup,
  Text
} from 'blockchain-info-components'
import { SubmitButton } from 'components/Exchange'
import { Form, NumberBoxDebounced } from 'components/Form'
import StringDisplay from 'components/Display/StringDisplay'
import SelectBox from './SelectBox'
import {
  AboveRegulationLimitMessage,
  MaximumAmountMessage,
  MinimumAmountMessage,
  InsufficientAmountMessage,
  InvalidAmountMessage
} from './validationMessages'
import Summary from './Summary'
import media from 'services/ResponsiveService'

const { EXCHANGE_FORM, formatPair } = model.components.exchange

const Wrapper = styled.div`
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
const AmountNumberBox = styled(NumberBoxDebounced)`
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
const ShapeshiftIcon = styled(Icon)`
  margin: auto;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['gray-5']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme['gray-1'] : props.theme['brand-secondary']};
  }
`
const ActiveCurrencyIndicator = styled.div`
  height: 12px;
  width: 12px;
  background-color: ${props =>
    props.active ? props.theme[props.coin] : props.theme['white']};
  border-radius: 7px;
  border: 1px solid;
  border-color: ${props =>
    props.active ? props.theme[props.coin] : props.theme['gray-3']};
  margin-right: 8px;
`
const FieldsWrapper = styled.div`
  padding: 30px;
  border: 1px solid ${props => props.theme['gray-2']}};
  margin-bottom: 45px;
`

const Success = props => {
  const {
    availablePairs,
    fromElements,
    toElements,
    hasOneAccount,
    disabled,
    dirty,
    sourceCoin,
    targetCoin,
    sourceActive,
    targetActive,
    coinActive,
    inputField,
    inputSymbol,
    complementaryAmount,
    complementarySymbol,
    formError,
    handleSubmit,
    handleSourceChange,
    handleTargetChange,
    handleAmountChange,
    swapBaseAndCounter
  } = props
  const swapDisabled = !contains(
    formatPair(targetCoin, sourceCoin),
    availablePairs
  )

  return (
    <Wrapper>
      <ColumnLeft>
        <Form onSubmit={handleSubmit}>
          <FieldsWrapper>
            <Row>
              <Cell>
                <ActiveCurrencyIndicator
                  active={sourceActive}
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
                <ActiveCurrencyIndicator
                  active={targetActive}
                  coin={targetCoin.toLowerCase()}
                />
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
                  <ShapeshiftIcon
                    name='shapeshift-switch'
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
                onChange={handleAmountChange}
                component={AmountNumberBox}
                disabled={disabled}
                step={coinActive ? '0.00000001' : '0.01'}
              />
              <CurrencyBox style={{ visibility: 'hidden' }}>
                {inputSymbol}
              </CurrencyBox>
            </AmountRow>
            <AmountRow>
              <ComplementaryAmountContaier>
                <StringDisplay>
                  {complementaryAmount.map(
                    amount => `${amount} ${complementarySymbol}`
                  )}
                </StringDisplay>
              </ComplementaryAmountContaier>
            </AmountRow>
            {formError && (
              <Row spaced>
                {formError === 'minimum' && <MinimumAmountMessage />}
                {formError === 'maximum' && <MaximumAmountMessage />}
                {formError === 'insufficient' && <InsufficientAmountMessage />}
                {formError === 'regulationlimit' && (
                  <AboveRegulationLimitMessage />
                )}
                {formError === 'invalid' && <InvalidAmountMessage />}
              </Row>
            )}
            <Row>
              <MinMaxButtonGroup>
                <Button fullwidth>
                  <FormattedMessage
                    id='scenes.exchange.exchangeform.min'
                    defaultMessage='MIN'
                  />
                </Button>
                <Button fullwidth>
                  <FormattedMessage
                    id='scenes.exchange.exchangeform.max'
                    defaultMessage='MAX'
                  />
                </Button>
              </MinMaxButtonGroup>
            </Row>
          </FieldsWrapper>
          <SubmitButton
            type='submit'
            nature='primary'
            disabled={!dirty || disabled || (dirty && !isEmpty(formError))}
          >
            {!disabled && (
              <FormattedMessage
                id='scenes.exchange.exchangeform.exchange'
                defaultMessage='Exchange {source} for {target}'
                values={{
                  source: sourceCoin,
                  target: targetCoin
                }}
              />
            )}
            {disabled && (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            )}
          </SubmitButton>
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
  destroyOnUnmount: false
})(Success)
