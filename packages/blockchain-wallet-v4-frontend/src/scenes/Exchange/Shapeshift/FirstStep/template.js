import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { CoinConvertor, Form, SelectBoxesAccounts } from 'components/Form'

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
  margin-bottom: 30px;
`
const AccountLabels = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;

  & > :first-child { width: 55%; }
  & > :last-child { width: 45%; }
`
const AmountLabels = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;

`

const FirstStep = (props) => {
  const { sourceCoin, targetCoin, sourceAmount, handleSubmit, invalid, submitting } = props

  return (
    <Wrapper>
      <Header>
        <Text size='12px' weight={300}>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.step' defaultMessage='Step 1 of 2' />
        </Text>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <AccountLabels>
            <Text size='16px' weight={500}>
              <FormattedMessage id='scenes.exchange.exchangebox.firststep.from' defaultMessage='Exchange:' />
            </Text>
            <Text size='16px' weight={500}>
              <FormattedMessage id='scenes.exchange.exchangebox.firststep.to' defaultMessage='Receive:' />
            </Text>
          </AccountLabels>
          <Field name='accounts' component={SelectBoxesAccounts} validate={[required]} />
        </Row>
        <Row>
          <AmountLabels>
            <Text size='16px' weight={500}>
              <FormattedMessage id='scenes.exchange.exchangebox.firststep.amount' defaultMessage='Enter amount:' />
            </Text>
          </AmountLabels>
          <Field name='amount' component={CoinConvertor} validate={[required]} sourceCoin={sourceCoin} targetCoin={targetCoin} sourceAmount={sourceAmount} />
        </Row>
        <Row>
          <Button type='submit' nature='primary' fullwidth disabled={invalid || submitting}>
            <FormattedMessage id='scenes.exchange.exchangebox.firststep.next' defaultMessage='Next' />
          </Button>
        </Row>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchange', destroyOnUnmount: false })(FirstStep)
