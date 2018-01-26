import React from 'react'
import styled from 'styled-components'
import { reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import ComboDisplay from 'components/Display/ComboDisplay'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > * { width: 150px; }
  & > :last-child { width: 100%; }
`
const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['gray-2']};
  margin: 5px 0;
  
  & > * { padding: 10px 0; }
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > :first-child { margin-bottom: 5px; }
`

const SecondStep = props => {
  const { previousStep, handleSubmit, from, to, message, amount, fee } = props

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendether.secondstep.from' defaultMessage='From:' />
        </Text>
        <Text size='16px' weight={300}>{from.address}</Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendether.secondstep.to' defaultMessage='To:' />
        </Text>
        <Text size='16px' weight={300}>{to}</Text>
      </Row>
      {message &&
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendether.secondstep.for' defaultMessage='For:' />
          </Text>
          <Text size='16px' weight={300}>{message}</Text>
        </Row>
      }
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendether.secondstep.payment' defaultMessage='Payment:' />
        </Text>
        <ComboDisplay coin='ETH' size='16px' weight={300}>{amount}</ComboDisplay>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendether.secondstep.fee' defaultMessage='Fee:' />
        </Text>
        <ComboDisplay coin='ETH' size='16px' weight={300}>{fee}</ComboDisplay>
      </Row>
      <Summary>
        <Text size='16px' weight={300} color='transferred'>
          <FormattedMessage id='modals.sendether.secondstep.total' defaultMessage='Total' />
        </Text>
        <CoinDisplay coin='ETH' size='34px' weight={600} color='transferred'>{amount}</CoinDisplay>
        <FiatDisplay coin='ETH' size='20px' weight={300} color='transferred'>{amount}</FiatDisplay>
      </Summary>
      <Footer>
        <Button type='submit' nature='primary' fullwidth uppercase>
          <FormattedMessage id='modals.sendether.secondstep.send' defaultMessage='Send ether' />
        </Button>
        <Link onClick={previousStep} size='13px' weight={300}>
          <FormattedMessage id='scenes.sendether.secondstep.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </Form>
  )
}

export default reduxForm({ form: 'sendBitcoin', destroyOnUnmount: false })(SecondStep)
