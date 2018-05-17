import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import ComboDisplay from 'components/Display/ComboDisplay'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;

  & > * { width: 150px; }
  & > :last-child { width: 100%; }
  &:first-child { padding-top: 0px; }
`
const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['gray-1']};
  padding: 10px 0;
  margin: 5px 0;
  margin-bottom: 25px;
  
  & > * { padding: 10px 0; }
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > :first-child { margin-bottom: 15px; }
`

const Success = props => {
  const { message, fromAddress, toAddress, amount, fee, total, coin, handleSubmit, handleBack } = props

  return (
    <div>
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
      {message &&
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendbch.secondstep.note' defaultMessage='Note:' />
          </Text>
          <Text size='16px' weight={300}>{message}</Text>
        </Row>
      }
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendbch.secondstep.payment' defaultMessage='Payment:' />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{amount}</ComboDisplay>
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendbch.secondstep.fee' defaultMessage='Fee:' />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{fee}</ComboDisplay>
        </Text>
      </Row>
      <Summary>
        <Text size='16px' weight={300} color='sent'>
          <FormattedMessage id='modals.sendbch.secondstep.total' defaultMessage='Total' />
        </Text>
        <CoinDisplay coin={coin} size='30px' weight={600} color='sent'>{total}</CoinDisplay>
        <FiatDisplay coin={coin} size='20px' weight={300} color='sent'>{total}</FiatDisplay>
      </Summary>
      <Footer>
        <Button onClick={handleSubmit} nature='primary' fullwidth uppercase>
          <FormattedMessage id='modals.sendbch.secondstep.send' defaultMessage='Send Bitcoin Cash' />
        </Button>
        <Link onClick={handleBack} size='13px' weight={300}>
          <FormattedMessage id='scenes.sendconfirm.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </div>
  )
}

export default Success
