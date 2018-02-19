import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { CoinConvertor, Form, SelectBoxAccounts } from 'components/Form'

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
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  margin-bottom: 10px;
`

const ExchangeForm = props => {
  const { sourceCoin, targetCoin, max, handleSubmit, invalid, submitting } = props

  return (
    <Wrapper>
      <Header>
        <Text size='12px' weight={300}>
          <FormattedMessage id='scenes.exchange.shapeshift.firststep.step' defaultMessage='Step 1 of 2' />
        </Text>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Field name='accounts' component={SelectBoxAccounts} />
        </Row>
        <Row>
          <Text size='14px' weight={400}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.amount' defaultMessage='Enter amount:' />
          </Text>
          <Field name='amount' component={CoinConvertor} validate={[required]} sourceCoin={sourceCoin} targetCoin={targetCoin} max={max} />
        </Row>
        <Row>
          <Button type='submit' nature='primary' fullwidth disabled={invalid || submitting}>
            <FormattedMessage id='scenes.exchange.shapeshift.firststep.next' defaultMessage='Next' />
          </Button>
        </Row>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange', destroyOnUnmount: false })(ExchangeForm)
