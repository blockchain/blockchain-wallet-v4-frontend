import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Modal from 'components/generic/Modal'
import { SecondaryButton } from 'components/generic/Button'
import { Link } from 'components/generic/Link'
import { Form } from 'components/generic/Form'
import { Text } from 'components/generic/Text'
import { Typography } from 'components/generic/Typography'
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
  const { show, handleClick, previous, fromAddress, toAddress, message, amount, fee } = props

  return (
    <Modal icon='icon-send' title='Confirm' size='large' show={show}>
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
            <ComboDisplay small light>{amount}</ComboDisplay>
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
            <CoinDisplay biggest red>{amount}</CoinDisplay>
            <CurrencyDisplay big light red>{amount}</CurrencyDisplay>
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
  show: PropTypes.bool.isRequired,
  previous: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  fromAddress: PropTypes.string.isRequired,
  toAddress: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired
}

export default SecondStep
