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
  TooltipIcon,
  TooltipHost,
  Text
} from 'blockchain-info-components'
import { Form, NumberBoxDebounced } from 'components/Form'
import MinimumAmountLink from './MinimumAmountLink'
import MaximumAmountLink from './MaximumAmountLink'
import SelectBox from './SelectBox'
import {
  AboveRegulationLimitMessage,
  MaximumAmountMessage,
  MinimumAmountMessage,
  InsufficientAmountMessage,
  InvalidAmountMessage
} from './validationMessages'
import media from 'services/ResponsiveService'

const { EXCHANGE_FORM, formatPair } = model.components.exchange
const { BASE, BASE_IN_FIAT, COUNTER, COUNTER_IN_FIAT } = model.rates.FIX_TYPES

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 20px 30px 10px 30px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};

  ${media.mobile`
    border: 0px;
    padding: 0;
  `};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: flex-start;
  width: 100%;
  height: ${props => props.height || 'auto'};
  margin-bottom: ${props => (props.spaced ? '20px' : '5px')};
`
const Cell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => (props.size === 'small' ? 'center' : 'flex-start')};
  width: ${props => (props.size === 'small' ? '10%' : '45%')};
  height: 100%;
`
const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > * {
    margin-right: 2px;
  }
`
const AmountContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  ${props => props.hasNoBottomBorder && '& input { border-bottom: none; }'};
`
const CurrencyBox = styled(Text)`
  position: absolute;
  right: 5px;
  top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 13px;
  font-weight: 300;
  transform: uppercase;
  background-color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['white']};
`
const ShapeshiftIcon = styled(Icon)`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${props =>
    props.disabled ? props.theme['gray-1'] : props.theme['gray-5']};
  &:hover {
    color: ${props =>
      props.disabled ? props.theme['gray-1'] : props.theme['brand-secondary']};
  }
`

const Success = ({
  availablePairs,
  fromElements,
  toElements,
  disabled,
  dirty,
  hasOneAccount,
  currency,
  sourceCoin,
  targetCoin,
  formError,
  useShapeshift,
  handleSwap,
  handleSubmit,
  handleSourceChange,
  handleTargetChange,
  handleSourceAmountChange,
  handleTargetAmountChange,
  handleSourceFiatAmountChange,
  handleTargetFiatAmountChange,
  handleSetFixedField
}) => {
  const swapDisabled = !contains(
    formatPair(targetCoin, sourceCoin),
    availablePairs
  )

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Row justify='flex-end'>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='scenes.exchange.shapeshift.firststep.step'
              defaultMessage='Step 1 of 2'
            />
          </Text>
        </Row>
        <Row>
          <Cell>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='scenes.exchange.shapeshift.firststep.from'
                defaultMessage='Exchange:'
              />
            </Text>
          </Cell>
          <Cell size='small' />
          <Cell>
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
              onChange={!useShapeshift && handleSourceChange}
              component={SelectBox}
              elements={fromElements}
              hasOneAccount={hasOneAccount}
              disabled={disabled}
            />
          </Cell>
          <Cell size='small'>
            <ShapeshiftIcon
              name='shapeshift-switch'
              size='28px'
              weight={500}
              cursor
              disabled={swapDisabled}
              onClick={() => {
                if (!disabled && !swapDisabled) handleSwap()
              }}
            />
          </Cell>
          <Cell>
            <Field
              name='target'
              onChange={!useShapeshift && handleTargetChange}
              component={SelectBox}
              elements={toElements}
              hasOneAccount={hasOneAccount}
              disabled={disabled}
            />
          </Cell>
        </Row>
        <Row justify='space-between'>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='scenes.exchange.shapeshift.firststep.amount'
              defaultMessage='Enter amount:'
            />
            <TooltipHost id='firststep.tooltip'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </Text>
        </Row>
        <Row height='80px'>
          <Cell>
            <AmountContainer hasNoBottomBorder>
              <Field
                name='sourceAmount'
                onChange={!useShapeshift && handleSourceAmountChange}
                onFocus={handleSetFixedField.bind(null, BASE)}
                component={NumberBoxDebounced}
                disabled={disabled}
                step='0.00000001'
              />
              <CurrencyBox disabled={disabled}>{sourceCoin}</CurrencyBox>
            </AmountContainer>
            <AmountContainer>
              <Field
                name='sourceFiat'
                onChange={!useShapeshift && handleSourceFiatAmountChange}
                onFocus={handleSetFixedField.bind(null, BASE_IN_FIAT)}
                component={NumberBoxDebounced}
                disabled={disabled}
              />
              <CurrencyBox disabled={disabled}>{currency}</CurrencyBox>
            </AmountContainer>
          </Cell>
          <Cell size='small'>
            {disabled ? (
              <HeartbeatLoader width='20px' height='20px' />
            ) : (
              <Icon name='right-arrow' size='24px' weight={500} />
            )}
          </Cell>
          <Cell>
            <AmountContainer hasNoBottomBorder>
              <Field
                name='targetAmount'
                onChange={!useShapeshift && handleTargetAmountChange}
                onFocus={handleSetFixedField.bind(null, COUNTER)}
                component={NumberBoxDebounced}
                disabled={disabled}
                step='0.00000001'
              />
              <CurrencyBox disabled={disabled}>{targetCoin}</CurrencyBox>
            </AmountContainer>
            <AmountContainer>
              <Field
                name='targetFiat'
                onChange={!useShapeshift && handleTargetFiatAmountChange}
                onFocus={handleSetFixedField.bind(null, COUNTER_IN_FIAT)}
                component={NumberBoxDebounced}
                disabled={disabled}
              />
              <CurrencyBox disabled={disabled}>{currency}</CurrencyBox>
            </AmountContainer>
          </Cell>
        </Row>
        {formError && (
          <Row spaced>
            {formError === 'minimum' && <MinimumAmountMessage />}
            {formError === 'maximum' && <MaximumAmountMessage />}
            {formError === 'insufficient' && <InsufficientAmountMessage />}
            {formError === 'regulationlimit' && <AboveRegulationLimitMessage />}
            {formError === 'invalid' && <InvalidAmountMessage />}
          </Row>
        )}
        {(!formError || formError === 'initial') && (
          <Row spaced>
            <OptionsContainer>
              <Text weight={300} size='12px'>
                <FormattedMessage
                  id='scenes.exchangebox.firststep.use1'
                  defaultMessage='Use'
                />
              </Text>
              <MinimumAmountLink />
              <Text weight={300} size='12px'>
                <FormattedMessage
                  id='scenes.exchangebox.firststep.use2'
                  defaultMessage='| Use'
                />
              </Text>
              <MaximumAmountLink />
            </OptionsContainer>
          </Row>
        )}
        <Row spaced>
          <Button
            type='submit'
            nature='primary'
            fullwidth
            disabled={!dirty || disabled || (dirty && !isEmpty(formError))}
          >
            <FormattedMessage
              id='scenes.exchange.shapeshift.firststep.next'
              defaultMessage='Next'
            />
          </Button>
        </Row>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({
  form: EXCHANGE_FORM,
  destroyOnUnmount: false
})(Success)
