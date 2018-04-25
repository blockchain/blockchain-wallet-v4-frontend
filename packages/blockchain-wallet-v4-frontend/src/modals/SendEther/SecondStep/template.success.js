import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import ComboDisplay from 'components/Display/ComboDisplay'

const Wrapper = styled.div``
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;

  & > * { width: 150px; }
  & > :last-child { width: 100%; }
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

  & > :first-child { margin-bottom: 5px; }
`

const Success = props => {
  const { coin, fromAddress, toAddress, message, amount, fee, total, handleBack, handleSubmit } = props

  return (
    <Wrapper>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendeth.secondstep.from' defaultMessage='From:' />
        </Text>
        <Text size='16px' weight={300}>{fromAddress}</Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendeth.secondstep.to' defaultMessage='To:' />
        </Text>
        <Text size='16px' weight={300}>{toAddress}</Text>
      </Row>
      {message &&
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendeth.secondstep.note' defaultMessage='Note:' />
          </Text>
          <Text size='16px' weight={300}>{message}</Text>
        </Row>
      }
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendeth.secondstep.payment' defaultMessage='Payment:' />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{amount}</ComboDisplay>
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage id='modals.sendeth.secondstep.fee' defaultMessage='Fee:' />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{fee}</ComboDisplay>
        </Text>
      </Row>
      <Summary>
        <Text size='16px' weight={300} color='sent'>
          <FormattedMessage id='modals.sendeth.secondstep.total' defaultMessage='Total' />
        </Text>
        <CoinDisplay coin={coin} size='30px' weight={600} color='sent'>{total}</CoinDisplay>
        <FiatDisplay coin={coin} size='20px' weight={300} color='sent'>{total}</FiatDisplay>
      </Summary>
      <Footer>
        <Button onClick={handleSubmit} nature='primary' fullwidth uppercase>
          <FormattedMessage id='modals.sendeth.secondstep.send' defaultMessage='Send Ether' />
        </Button>
        <Link onClick={handleBack} size='13px' weight={300}>
          <FormattedMessage id='scenes.sendconfirm.back' defaultMessage='Go Back' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default Success
