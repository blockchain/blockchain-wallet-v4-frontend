import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Text, Button } from 'blockchain-info-components'

const XPubTextBox = styled.div`
  background-color: ${props => props.theme['white-blue']};
  padding: 10px;
  font-family: "Courier New", monospace;
  margin-bottom: 20px;
  font-size: 10pt;
  color: #4B4D4E;
  word-break: break-all;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const FirstStep = () => (
  <div>
    <Text size='13px' color='error' weight={500} uppercase>
      <FormattedMessage id='modals.xpub.warning' defaultMessage='Warning' />
    </Text>
    <Text size='14px' style={{ marginTop: 10 }} weight={300}>
      <FormattedMessage id='modals.xpub.warning_message' defaultMessage='You should only give this Extended Public Key (xPub) to those you trust. With this information, they may be able to keep track of your payments, and may be able to disrupt your access to your wallet.' />
    </Text>
  </div>
)

const SecondStep = ({ xpub }) => (
  <div>
    <XPubTextBox>{xpub}</XPubTextBox>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <QRCodeReact value={xpub} size={200} />
    </div>
  </div>
)

const ShowXPubTemplate = ({ position, total, close, step, xpub, onContinue }) => (
  <Modal size='large' position={position} total={total}>
    <ModalHeader icon='lock' closeButton={false}>
      <FormattedMessage id='modals.xpub.title' defaultMessage='Extended Public Key' />
    </ModalHeader>
    <ModalBody>
      {step === 0 ? <FirstStep /> : <SecondStep xpub={xpub} />}
    </ModalBody>
    <ModalFooter align='right'>
      <ClickableText size='small' weight={300} style={{ marginRight: 15 }} onClick={close}>
        <FormattedMessage id='modals.xpub.close' defaultMessage='Close' />
      </ClickableText>
      {step === 0 && (
        <Button nature='primary' onClick={onContinue}>
          <FormattedMessage id='modals.xpub.continue' defaultMessage='Continue' />
        </Button>
      )}
    </ModalFooter>
  </Modal>
)

export default ShowXPubTemplate
