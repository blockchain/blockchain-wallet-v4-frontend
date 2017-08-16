import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Form, Link, Modal, SecondaryButton, Text, Typography } from 'blockchain-info-components'
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
    <Modal {...rest} icon='icon-send' title='Confirm' size='large'>
      <Form>
        <PaymentSendRow>
          <PaymentSendLabel>
            <Text id='modals.sendbitcoin.secondstep.from' text='From:' small capitalize />
          </PaymentSendLabel>
          <PaymentSendValue>
            <Typography small light>{fromAddress}</Typography>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <Text id='modals.sendbitcoin.secondstep.to' text='To:' small capitalize />
          </PaymentSendLabel>
          <PaymentSendValue>
            <Typography small light>{toAddress}</Typography>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <Text id='modals.sendbitcoin.secondstep.for' text='For:' small capitalize />
          </PaymentSendLabel>
          <PaymentSendValue>
            <Typography small light>{message}</Typography>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <Text id='modals.sendbitcoin.secondstep.payment' text='Payment:' small capitalize />
          </PaymentSendLabel>
          <PaymentSendValue>
            <ComboDisplay small light>{satoshis}</ComboDisplay>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendRow>
          <PaymentSendLabel>
            <Text id='modals.sendbitcoin.secondstep.fee' text='Fee:' small capitalize />
          </PaymentSendLabel>
          <PaymentSendValue>
            <ComboDisplay small light>{fee}</ComboDisplay>
          </PaymentSendValue>
        </PaymentSendRow>
        <PaymentSendContainer>
          <PaymentSendContent>
            <Typography big light>
              <Text id='modals.sendbitcoin.secondstep.total' text='Total' small red />
            </Typography>
            <CoinDisplay biggest red>{satoshis}</CoinDisplay>
            <CurrencyDisplay big light red>{satoshis}</CurrencyDisplay>
          </PaymentSendContent>
        </PaymentSendContainer>
        <Footer>
          <SecondaryButton fullwidth onClick={handleClick}>
            <Text id='modals.sendbitcoin.secondstep.send' text='Send bitcoin' small light uppercase white />
          </SecondaryButton>
          <Link onClick={previous}><Text id='scenes.sendbitcoin.secondstep.back' text='Go back' small light cyan /></Link>
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
