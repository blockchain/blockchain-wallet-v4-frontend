import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Image,
  Modal,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 435px;
  padding: 48px 32px 0 32px;
  box-sizing: border-box;
  text-align: center;
`
const Title = styled(Text)`
  margin-bottom: 16px;
  font-size: 26px;
  b {
    font-weight: 500;
    color: ${props => props.theme.success};
  }
`
const Message = styled(Text)`
  margin-bottom: 24px;
  font-size: 18px;
`
const TopImage = styled(Image)`
  width: 20%;
  margin-bottom: 24px;
  margin-top: 14px;
`
const FooterButton = styled(Button)`
  height: 50px;
  font-size: 18px;
  font-weight: 500;
  margin-top: 50px;
  padding: 16px 0;
`

export const BitPayInvoiceExpired = ({ close, position, total }) => (
  <Modal size='small' position={position} total={total}>
    <ModalHeader onClose={close} />
    <Body data-e2e='bitpayInvoiceExpired'>
      <TopImage name='close-error' />
      <Title size='20px' color='blue900'>
        <FormattedHTMLMessage
          defaultMessage='BitPay Invoice Expired'
          id='modals.bitpayexpired.invoice_expired'
        />
      </Title>
      <Message>
        <FormattedMessage
          defaultMessage='An invoice is only valid for 15 minutes. Return to the merchant if you would like to resubmit a payment.'
          id='modals.bitpayexpired.expired_msg'
        />
      </Message>
      <FooterButton nature='primary' size='20px' fullwidth onClick={close}>
        <FormattedMessage
          defaultMessage='OK'
          id='modals.support.contact_support'
        />
      </FooterButton>
    </Body>
  </Modal>
)

export default BitPayInvoiceExpired
