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
  padding: 5px 0;

  & > * { width: 150px; }
  & > :last-child { width: 100%; }
`
const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['gray-1']};
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
  const { previousStep, handleSubmit, fromAddress, toAddress, message, fee, satoshis, total } = props

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendbch.secondstep.from' defaultMessage='From:' />
        </Text>
        <Text size='16px' weight={300}>{fromAddress}</Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendbch.secondstep.to' defaultMessage='To:' />
        </Text>
        <Text size='16px' weight={300}>{toAddress}</Text>
      </Row>
      { message &&
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendbch.secondstep.for' defaultMessage='For:' />
          </Text>
          <Text size='16px' weight={300}>{message}</Text>
        </Row>
      }
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendbch.secondstep.payment' defaultMessage='Payment:' />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin='BCH'>{satoshis}</ComboDisplay>
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendbch.secondstep.fee' defaultMessage='Fee:' />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin='BCH'>{fee}</ComboDisplay>
        </Text>
      </Row>
      <Summary>
        <Text size='16px' weight={300} color='transferred'>
          <FormattedMessage id='modals.sendbch.secondstep.total' defaultMessage='Total' />
        </Text>
        <CoinDisplay coin='BCH' size='30px' weight={600} color='transferred'>{total}</CoinDisplay>
        <FiatDisplay coin='BCH' size='20px' weight={300} color='transferred'>{total}</FiatDisplay>
      </Summary>
      <Footer>
        <Button type='submit' nature='primary' fullwidth uppercase>
          <FormattedMessage id='modals.sendbch.secondstep.send' defaultMessage='Send Bitcoin Cash' />
        </Button>
        <Link onClick={previousStep} size='13px' weight={300}>
          <FormattedMessage id='scenes.sendbch.secondstep.back' defaultMessage='Go Back' />
        </Link>
      </Footer>
    </Form>
  )
}

export default reduxForm({ form: 'sendBch', destroyOnUnmount: false })(SecondStep)
