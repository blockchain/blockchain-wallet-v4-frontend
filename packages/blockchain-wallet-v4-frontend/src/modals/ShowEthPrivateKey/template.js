import React from 'react'
import { FormattedMessage } from 'react-intl'
import QRCodeReact from 'qrcode.react'
import { merge } from 'ramda'
import { Modal, ModalHeader, ModalBody, ModalFooter, Text, Button } from 'blockchain-info-components'
import { spacing, flex } from 'services/StyleService'
import CoinDisplay from 'components/Display/CoinDisplay'

const FirstStep = () => (
  <div>
    <Text size='13px' color='error' weight={500} uppercase>
      <FormattedMessage id='modals.show_eth_priv.warning' defaultMessage='Warning' />
    </Text>
    <Text size='14px' style={spacing('mt-10')} weight={300}>
      <FormattedMessage id='modals.show_eth_priv.warning_message' defaultMessage='Granting others access to this Private Key gives them the ability to send ether from this address. Exposing your Private Key to others is a security risk that may result in lost ether. Do you wish to continue?' />
    </Text>
  </div>
)

const DetailRow = ({ id, defaultMessage, children }) => (
  <div style={merge(flex('row'), spacing('mt-10'))}>
    <Text size='14px' weight={400}>
      <FormattedMessage id={id} defaultMessage={defaultMessage} />
    </Text>
    {':'}&nbsp;
    {children}
  </div>
)

const SecondStep = ({ addr, balance, priv }) => (
  <div style={flex('row')}>
    <div style={spacing('mr-25')}>
      <QRCodeReact value={priv} size={120} />
    </div>
    <div>
      <DetailRow id='modals.show_eth_priv.address' defaultMessage='Address'>
        <Text size='14px' weight={300}>{addr}</Text>
      </DetailRow>
      <DetailRow id='modals.show_eth_priv.balance' defaultMessage='Balance'>
        <Text size='14px' weight={300}>
          <CoinDisplay coin='ETH'>
            {balance}
          </CoinDisplay>
        </Text>
      </DetailRow>
      <DetailRow id='modals.show_eth_priv.priv_key' defaultMessage='Private Key'>
        <Text size='14px' weight={300}>{priv}</Text>
      </DetailRow>
    </div>
  </div>
)

const ShowEthPrivateKeyTemplate = ({ position, total, close, step, onContinue, ...rest }) => (
  <Modal size='large' position={position} total={total}>
    <ModalHeader icon='lock' closeButton={false}>
      <FormattedMessage id='modals.show_eth_priv.title' defaultMessage='Private Key' />
    </ModalHeader>
    <ModalBody>
      {step === 0 ? <FirstStep /> : <SecondStep {...rest} />}
    </ModalBody>
    <ModalFooter align='right'>
      <Text cursor='pointer' size='small' weight={300} style={spacing('mr-15')} onClick={close}>
        <FormattedMessage id='modals.show_eth_priv.close' defaultMessage='Close' />
      </Text>
      {step === 0 && (
        <Button nature='primary' onClick={onContinue}>
          <FormattedMessage id='modals.show_eth_priv.continue' defaultMessage='Continue' />
        </Button>
      )}
    </ModalFooter>
  </Modal>
)

export default ShowEthPrivateKeyTemplate
