import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SelectInput,
  Text
} from 'blockchain-info-components'
import { utils } from 'blockchain-wallet-v4/src'
import CoinDisplay from 'components/Display/CoinDisplay'
import QRCodeWrapper from 'components/QRCode/Wrapper'
import { flex, spacing } from 'services/styles'

const DropdownWrapper = styled.div`
  position: relative;
  width: 60%;
  height: auto;
  background-color: ${props => props.theme.white};
`

const DetailTable = styled.div`
  min-width: 0;
  > div {
    word-break: break-word;
  }
  > div:not(:first-child) {
    margin-top: 10px;
  }
`
const DetailRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`
const DetailRowText = styled(Text)`
  white-space: nowrap;
`
const KeyText = styled(Text)`
  min-width: 0;
  word-wrap: break-word;
`

const KeySelectInput = styled(SelectInput)`
  flex: 1;
`

const FirstStep = () => (
  <div>
    <Text size='13px' color='error' weight={500} uppercase>
      <FormattedMessage
        id='modals.showbtcpriv.warning'
        defaultMessage='Warning'
      />
    </Text>
    <Text size='14px' style={spacing('mt-10')} weight={400}>
      <FormattedMessage
        id='modals.showbtcpriv.warning.message'
        defaultMessage="Don't share your private key with anyone. This may result in a loss of funds."
      />
    </Text>
  </div>
)

const SecondStep = ({
  addr,
  balance,
  format,
  formats,
  onChangeFormat,
  priv
}) => (
  <div style={flex('row')}>
    <div style={spacing('mr-25')}>
      <QRCodeWrapper value={priv} size={120} />
    </div>
    <DetailTable>
      <DetailRow>
        <DetailRowText size='14px' weight={500}>
          <FormattedMessage id='copy.balance' defaultMessage='Balance' />
        </DetailRowText>
        {':'}
        &nbsp;
        <CoinDisplay coin='BTC' size='14px'>
          {balance}
        </CoinDisplay>
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={500}>
          <FormattedMessage id='copy.address' defaultMessage='Address' />
        </DetailRowText>
        {':'}
        &nbsp;
        <Text size='14px' weight={400} data-e2e='btcAddressValue'>
          {addr}
        </Text>
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={500}>
          <FormattedMessage
            id='copy.private_key'
            defaultMessage='Private Key'
          />
        </DetailRowText>
        {':'}
        &nbsp;
        {utils.btc.formatPrivateKeyString(priv, format, addr).fold(
          error => (
            <Text size='14px' weight={400} color='error'>
              {error.message}
            </Text>
          ),
          keyString => (
            <KeyText size='14px' weight={400} data-e2e='btcPrivateKeyValue'>
              {keyString}
            </KeyText>
          )
        )}
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={500}>
          <FormattedMessage
            id='modals.showbtcpriv.priv_key_format'
            defaultMessage='Private Key Format'
          />
        </DetailRowText>
        {':'}
        &nbsp;
        <DropdownWrapper data-e2e='dropdownSelect'>
          <KeySelectInput
            label='Export Format'
            value={format}
            searchEnabled={false}
            onChange={onChangeFormat}
            elements={formats}
          />
        </DropdownWrapper>
      </DetailRow>
    </DetailTable>
  </div>
)

const ShowBtcPrivateKeyTemplate = ({
  close,
  onContinue,
  position,
  step,
  total,
  ...rest
}) => (
  <Modal size='large' position={position} total={total}>
    <ModalHeader icon='lock' closeButton={false}>
      <FormattedMessage id='copy.private_key' defaultMessage='Private Key' />
    </ModalHeader>
    <ModalBody>
      {step === 0 ? <FirstStep /> : <SecondStep {...rest} />}
    </ModalBody>
    <ModalFooter align='right'>
      <Text
        cursor='pointer'
        size='small'
        weight={400}
        style={spacing('mr-15')}
        onClick={close}
        data-e2e='btcPrivateKeyCloseButton'
      >
        <FormattedMessage id='buttons.close' defaultMessage='Close' />
      </Text>
      {step === 0 && (
        <Button
          nature='primary'
          onClick={onContinue}
          data-e2e='btcPrivateKeyContinueButton'
        >
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      )}
    </ModalFooter>
  </Modal>
)

export default ShowBtcPrivateKeyTemplate
