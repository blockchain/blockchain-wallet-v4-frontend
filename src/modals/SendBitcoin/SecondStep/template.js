import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Form, Link, Modal, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/shared/CoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'
import ComboDisplay from 'components/shared/ComboDisplay'

const PaymentSendRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const PaymentSendLabel = styled.div`
  width: 150px;
`
const PaymentSendValue = styled.div`
  widtH: 100%;
`
const PaymentSendContainer = styled.div`
  background-color: #EFEFEF;
  margin: 5px 0;
`
const PaymentSendContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > * { padding: 10px 0; }
`
const Footer = styled.div`
  width: 100%;
  padding: 5px 0;
`

const SecondStep = (props) => {
  const { handleClick, previous, fromAddress, toAddress, message, satoshis, fee, ...rest } = props

  return (
    <Modal {...rest} icon='send' title='Confirm' size='large'>
      <Form>
        <PaymentSendRow>
          <PaymentSendLabel>
            <FormattedMessage id='modals.sendbitcoin.secondstep.from' defaultMessage='From:' />
          </PaymentSendLabel>
          <PaymentSendValue>
            <Text size='12px'>{fromAddress}</Text>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <FormattedMessage id='modals.sendbitcoin.secondstep.to' defaultMessage='To:' />
          </PaymentSendLabel>
          <PaymentSendValue>
            <Text size='12px'>{toAddress}</Text>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <FormattedMessage id='modals.sendbitcoin.secondstep.for' defaultMessage='For:' />
          </PaymentSendLabel>
          <PaymentSendValue>
            <Text size='12px'>{message}</Text>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <FormattedMessage id='modals.sendbitcoin.secondstep.payment' defaultMessage='Payment:' />
          </PaymentSendLabel>
          <PaymentSendValue>
            <ComboDisplay>{satoshis}</ComboDisplay>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <FormattedMessage id='modals.sendbitcoin.secondstep.fee' defaultMessage='Fee:' />
          </PaymentSendLabel>
          <PaymentSendValue>
            <ComboDisplay>{fee}</ComboDisplay>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendContainer>
          <PaymentSendContent>
            <FormattedMessage id='modals.sendbitcoin.secondstep.total' defaultMessage='Total' />
            <CoinDisplay>{satoshis}</CoinDisplay>
            <CurrencyDisplay>{satoshis}</CurrencyDisplay>
          </PaymentSendContent>
        </PaymentSendContainer>
        <Footer>
          <Button type='secondary' fullwidth onClick={handleClick}>
            <FormattedMessage id='modals.sendbitcoin.secondstep.send' defaultMessage='Send bitcoin' />
          </Button>
          <Link onClick={previous}>
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
