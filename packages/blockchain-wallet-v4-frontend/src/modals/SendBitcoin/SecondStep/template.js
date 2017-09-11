import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Modal, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import CoinDisplay from 'components/CoinDisplay'
import CurrencyDisplay from 'components/CurrencyDisplay'
import ComboDisplay from 'components/ComboDisplay'

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
  padding: 5px 0;

  & > :last-child { margin-top: 10px; }
`

const SecondStep = (props) => {
  const { handleClick, previous, fromAddress, toAddress, message, satoshis, fee, ...rest } = props

  return (
    <Modal {...rest} icon='send' title='Confirm' size='large'>
      <Form>
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.secondstep.from' defaultMessage='From:' />
          </Text>
          <Text size='16px' weight={300}>{fromAddress}</Text>
        </Row>
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.secondstep.to' defaultMessage='To:' />
          </Text>
          <Text size='16px' weight={300}>{toAddress}</Text>
        </Row>
        { message &&
          <Row>
            <Text size='16px' weight={500}>
              <FormattedMessage id='modals.sendbitcoin.secondstep.for' defaultMessage='For:' />
            </Text>
            <Text size='16px' weight={300}>{message}</Text>
          </Row>
        }
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.secondstep.payment' defaultMessage='Payment:' />
          </Text>
          <Text size='16px' weight={300}>
            <ComboDisplay>{satoshis}</ComboDisplay>
          </Text>
        </Row>
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendbitcoin.secondstep.fee' defaultMessage='Fee:' />
          </Text>
          <Text size='16px' weight={300}>
            <ComboDisplay>{fee}</ComboDisplay>
          </Text>
        </Row>
        <Summary>
          <Text size='16px' weight={300} color='transferred'>
            <FormattedMessage id='modals.sendbitcoin.secondstep.total' defaultMessage='Total' />
          </Text>
          <Text size='40px' weight={600} color='transferred'>
            <CoinDisplay>{total}</CoinDisplay>
          </Text>
          <Text size='20px' weight={300} color='transferred'>
            <CurrencyDisplay>{total}</CurrencyDisplay>
          </Text>
        </Summary>
        <Footer>
          <Button nature='secondary' fullwidth uppercase onClick={handleClick}>
            <FormattedMessage id='modals.sendbitcoin.secondstep.send' defaultMessage='Send bitcoin' />
          </Button>
          <Link onClick={previous} size='13px' weight={300}>
            <FormattedMessage id='scenes.sendbitcoin.secondstep.back' defaultMessage='Go back' />
          </Link>
        </Footer>
      </Form>
    </Modal>
  )
}

SecondStep.propTypes = {
  previous: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  fromAddress: PropTypes.string.isRequired,
  toAddress: PropTypes.string.isRequired,
  message: PropTypes.string,
  satoshis: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired
}

export default SecondStep
