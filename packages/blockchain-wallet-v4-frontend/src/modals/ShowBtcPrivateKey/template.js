import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCodeReact from 'qrcode.react'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Modal, ModalHeader, ModalBody, ModalFooter, Text, Button, SelectInput } from 'blockchain-info-components'
import { spacing, flex } from 'services/StyleService'
import { utils } from 'blockchain-wallet-v4/src'

const DetailTable = styled.div`
  min-width: 0;
  > div { word-break: break-word; }
  > div:not(:first-child) { margin-top: 10px; }
`
const DetailRowText = styled(Text)`
  white-space: nowrap;
`

const FirstStep = () => (
  <div>
    <Text size='13px' color='error' weight={500} uppercase>
      <FormattedMessage id='modals.show_priv.warning' defaultMessage='Warning' />
    </Text>
    <Text size='14px' style={spacing('mt-10')} weight={300}>
      <FormattedMessage id='modals.show_priv.warning_message' defaultMessage='Granting others access to this Private Key gives them the ability to send bitcoin from this address. Exposing your Private Key to others is a security risk that may result in lost bitcoin. Do you wish to continue?' />
    </Text>
  </div>
)

const DetailRow = ({ id, defaultMessage, children }) => (
  <div style={flex('row')}>
    <DetailRowText size='14px' weight={400}>
      <FormattedMessage id={id} defaultMessage={defaultMessage} />
    </DetailRowText>
    {':'}&nbsp;
    {children}
  </div>
)

const SecondStep = ({ addr, balance, priv, format, formats, onChangeFormat }) => (
  <div style={flex('row')}>
    <div style={spacing('mr-25')}>
      <QRCodeReact value={priv} size={120} />
    </div>
    <DetailTable>
      <DetailRow id='modals.show_priv.balance' defaultMessage='Balance'>
        <CoinDisplay coin='BTC' size='14px'>
          {balance}
        </CoinDisplay>
      </DetailRow>
      <DetailRow id='modals.show_priv.address' defaultMessage='Address'>
        <Text size='14px' weight={300}>{addr}</Text>
      </DetailRow>
      <DetailRow id='modals.show_priv.priv_key' defaultMessage='Private Key'>
        {utils.bitcoin.formatPrivateKeyString(priv, format).fold(
          error => (<Text size='14px' weight={300} color='error'>{error.message}</Text>),
          keyString => (<Text size='14px' weight={300}>{keyString}</Text>)
        )}
      </DetailRow>
      <DetailRow id='modals.show_priv.priv_key_format' defaultMessage='Private Key Format'>
        <SelectInput
          label='Export Format'
          value={format}
          searchEnabled={false}
          onChange={onChangeFormat}
          elements={formats}
        />
      </DetailRow>
    </DetailTable>
  </div>
)

const ShowBtcPrivateKeyTemplate = ({ position, total, close, step, onContinue, ...rest }) => (
  <Modal size='large' position={position} total={total}>
    <ModalHeader icon='lock' closeButton={false}>
      <FormattedMessage id='modals.show_priv.title' defaultMessage='Private Key' />
    </ModalHeader>
    <ModalBody>
      {step === 0 ? <FirstStep /> : <SecondStep {...rest} />}
    </ModalBody>
    <ModalFooter align='right'>
      <Text cursor='pointer' size='small' weight={300} style={spacing('mr-15')} onClick={close}>
        <FormattedMessage id='modals.show_priv.close' defaultMessage='Close' />
      </Text>
      {step === 0 && (
        <Button nature='primary' onClick={onContinue}>
          <FormattedMessage id='modals.show_priv.continue' defaultMessage='Continue' />
        </Button>
      )}
    </ModalFooter>
  </Modal>
)

export default ShowBtcPrivateKeyTemplate
