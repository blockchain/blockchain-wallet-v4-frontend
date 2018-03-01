import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { isAboveShapeshiftMinimum, isBelowShapeshiftMaximum, isBelowEffectiveBalance } from './services'
import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import CoinConvertor from './CoinConvertor'
import SelectBoxAccounts from './SelectBoxAccounts'
import MinimumMaximum from './MinimumMaximum'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px 30px 10px 30px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  margin-bottom: 10px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 45%;
  flex-grow: 2;
`
const ContainerMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 10%;
  min-width: 50px;
  flex-grow: 1;

  & > :first-child:hover { color: ${props => props.theme['brand-primary']}; }
`
const shouldValidate = ({ values, nextProps, props, initialRender, structure }) => {
  if (initialRender) { return true }
  return initialRender ||
    !structure.deepEqual(values, nextProps.values) ||
    props.effectiveBalance !== nextProps.effectiveBalance ||
    props.coins !== nextProps.coins
}

const ExchangeForm = props => {
  const { handleSubmit, invalid, submitting, ...rest } = props

  return (
    <Wrapper>
      <Header>
        <Text size='12px' weight={300}>
          <FormattedMessage id='scenes.exchange.shapeshift.firststep.exchangeform.step' defaultMessage='Step 1 of 2' />
        </Text>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Container>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.exchangeform.from' defaultMessage='Exchange:' />
            </Text>
          </Container>
          <ContainerMiddle />
          <Container>
            <Text size='14px' weight={400}>
              <FormattedMessage id='scenes.exchange.shapeshift.firststep.exchangeform.to' defaultMessage='Receive:' />
            </Text>
          </Container>
        </Row>
        <Row>
          <Field name='accounts' component={SelectBoxAccounts} {...rest} />
        </Row>
        <Row>
          <Text size='14px' weight={400}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.exchangeform.amount' defaultMessage='Enter amount:' />
          </Text>
        </Row>
        <Row>
          <Field name='amount' component={CoinConvertor} validate={[required, isAboveShapeshiftMinimum, isBelowShapeshiftMaximum, isBelowEffectiveBalance]} {...rest} />
        </Row>
        <Row>
          <MinimumMaximum {...rest} />
        </Row>
        <Row>
          <Button type='submit' nature='primary' fullwidth disabled={invalid || submitting}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.exchangeform.next' defaultMessage='Next' />
          </Button>
        </Row>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange', destroyOnUnmount: false, shouldValidate })(ExchangeForm)
