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
const DetailRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`
const DetailRowText = styled(Text)`
  white-space: nowrap;
`

const FirstStep = () => (
  <div>
    <Text size='13px' color='error' weight={500} uppercase>
      <FormattedMessage id='modals.showbtcpriv.warning' defaultMessage='Warning' />
    </Text>
    <Text size='14px' style={spacing('mt-10')} weight={300}>
      <FormattedMessage id='modals.showbtcpriv.warning.message' defaultMessage="Don't share your private key with anyone. This may result in a loss of funds." />
    </Text>
  </div>
)

const SecondStep = ({ addr, balance, priv, format, formats, onChangeFormat }) => (
  <div style={flex('row')}>
    <div style={spacing('mr-25')}>
      <QRCodeReact value={priv} size={120} />
    </div>
    <DetailTable>
      <DetailRow>
        <DetailRowText size='14px' weight={400}>
          <FormattedMessage id='modals.showbtcpriv.balance' defaultMessage='Balance' />
        </DetailRowText>
        {':'}&nbsp;
        <CoinDisplay coin='BTC' size='14px'>
          {balance}
        </CoinDisplay>
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={400}>
          <FormattedMessage id='modals.showbtcpriv.address' defaultMessage='Address' />
        </DetailRowText>
        {':'}&nbsp;
        <Text size='14px' weight={300}>{addr}</Text>
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={400}>
          <FormattedMessage id='modals.showbtcpriv.priv_key' defaultMessage='Private Key' />
        </DetailRowText>
        {':'}&nbsp;
        {utils.bitcoin.formatPrivateKeyString(priv, format, addr).fold(
          error => (<Text size='14px' weight={300} color='error'>{error.message}</Text>),
          keyString => (<Text size='14px' weight={300}>{keyString}</Text>)
        )}
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={400}>
          <FormattedMessage id='modals.showbtcpriv.priv_key_format' defaultMessage='Private Key Format' />
        </DetailRowText>
        {':'}&nbsp;
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
      <FormattedMessage id='modals.showbtcpriv.title' defaultMessage='Private Key' />
    </ModalHeader>
    <ModalBody>
      {step === 0 ? <FirstStep /> : <SecondStep {...rest} />}
    </ModalBody>
    <ModalFooter align='right'>
      <Text cursor='pointer' size='small' weight={300} style={spacing('mr-15')} onClick={close}>
        <FormattedMessage id='modals.showbtcpriv.close' defaultMessage='Close' />
      </Text>
      {step === 0 && (
        <Button nature='primary' onClick={onContinue}>
          <FormattedMessage id='modals.showbtcpriv.continue' defaultMessage='Continue' />
        </Button>
      )}
    </ModalFooter>
  </Modal>
)

export default ShowBtcPrivateKeyTemplate
