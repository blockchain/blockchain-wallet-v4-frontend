import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { isEmpty } from 'ramda'
import { Button, HeartbeatLoader, Icon, Link, Text, TextGroup, Tooltip } from 'blockchain-info-components'
import { Form } from 'components/Form'
import MinimumAmountLink from './MinimumAmountLink'
import MaximumAmountLink from './MaximumAmountLink'
import NumberBox from './NumberBox'
import SelectBox from './SelectBox'
import { MaximumAmountMessage, MinimumAmountMessage, InsufficientAmountMessage } from './validationMessages'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 20px 30px 10px 30px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: flex-start;
  width: 100%;
  height: ${props => props.height || 'auto'};
  margin-bottom: ${props => props.spaced ? '20px' : '5px'};
`
const Cell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => props.size === 'small' ? 'center' : 'flex-start'};
  width: ${props => props.size === 'small' ? '10%' : '45%'};
  height: 100%;
`
const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > * { margin-right: 2px; }
`
const AmountContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  ${props => props.hasNoBottomBorder && '& input { border-bottom: none; }'}
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
  background-color: ${props => props.theme['white']};
`
const ShapeshiftIcon = styled(Icon)`
  &:hover { color: ${props => props.theme['brand-secondary']}; }
`

const Success = props => {
  const { elements, enabled, hasOneAccount, currency, sourceCoin, targetCoin, formError, handleSwap, handleSubmit, dirty } = props

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Row justify='flex-end'>
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.step' defaultMessage='Step 1 of 2' />
          </Text>
        </Row>
        <Row>
          <Cell>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.from' defaultMessage='Exchange:' />
            </Text>
          </Cell>
          <Cell size='small' />
          <Cell>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.to' defaultMessage='Receive:' />
            </Text>
          </Cell>
        </Row>
        <Row height='50px' spaced>
          <Cell>
            <Field name='source' component={SelectBox} elements={elements} hasOneAccount={hasOneAccount} />
          </Cell>
          <Cell size='small'>
            <ShapeshiftIcon name='shapeshift-switch' size='28px' weight={500} cursor onClick={handleSwap} />
          </Cell>
          <Cell>
            <Field name='target' component={SelectBox} elements={elements} hasOneAccount={hasOneAccount} />
          </Cell>
        </Row>
        <Row justify='space-between'>
          <Text size='14px' weight={400}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.amount' defaultMessage='Enter amount:' />
          </Text>
          <Tooltip>
            <TextGroup inline>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.tooltip' defaultMessage='This quote may change depending on the market price at the time of your transaction.' />
              <Link size='12px' weight={300} href='https://info.shapeshift.io/about' target='_blank'>
                <FormattedMessage id='scenes.exchange.shapeshift.firststep.tooltip2' defaultMessage='Learn more' />
              </Link>
            </TextGroup>
          </Tooltip>
        </Row>
        <Row height='80px'>
          <Cell>
            <AmountContainer hasNoBottomBorder>
              <Field name='sourceAmount' component={NumberBox} />
              <CurrencyBox>{sourceCoin}</CurrencyBox>
            </AmountContainer>
            <AmountContainer>
              <Field name='sourceFiat' component={NumberBox} />
              <CurrencyBox>{currency}</CurrencyBox>
            </AmountContainer>
          </Cell>
          <Cell size='small'>
            {enabled
              ? <Icon name='right-arrow' size='24px' weight={500} />
              : <HeartbeatLoader width='20px' height='20px' />
            }
          </Cell>
          <Cell>
            <AmountContainer hasNoBottomBorder>
              <Field name='targetAmount' component={NumberBox} />
              <CurrencyBox>{targetCoin}</CurrencyBox>
            </AmountContainer>
            <AmountContainer>
              <Field name='targetFiat' component={NumberBox} />
              <CurrencyBox>{currency}</CurrencyBox>
            </AmountContainer>
          </Cell>
        </Row>
        {formError &&
        <Row spaced>
          {formError === 'minimum' && <MinimumAmountMessage />}
          {formError === 'maximum' && <MaximumAmountMessage />}
          {formError === 'insufficient' && <InsufficientAmountMessage />}
        </Row>
        }
        {!formError &&
          <Row spaced>
            <OptionsContainer>
              <Text weight={300} size='12px'>
                <FormattedMessage id='scenes.exchangebox.firststep.use1' defaultMessage='Use' />
              </Text>
              <MinimumAmountLink />
              <Text weight={300} size='12px'>
                <FormattedMessage id='scenes.exchangebox.firststep.use2' defaultMessage='| Use' />
              </Text>
              <MaximumAmountLink />
            </OptionsContainer>
          </Row>
        }
        <Row spaced>
          <Button type='submit' nature='primary' fullwidth disabled={!dirty || !enabled || (dirty && !isEmpty(formError))}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.next' defaultMessage='Next' />
          </Button>
        </Row>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange', destroyOnUnmount: false })(Success)
