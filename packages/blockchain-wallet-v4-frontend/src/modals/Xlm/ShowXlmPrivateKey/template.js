import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button
} from 'blockchain-info-components'
import { spacing, flex } from 'services/StyleService'
import CoinDisplay from 'components/Display/CoinDisplay'
import QRCodeWrapper from 'components/QRCodeWrapper'

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
const DataRowText = styled(Text)`
  min-width: 0;
  word-wrap: break-word;
`

const FirstStep = () => (
  <div>
    <Text size='13px' color='error' weight={500} uppercase>
      <FormattedMessage
        id='modals.showxlmpriv.warning'
        defaultMessage='Warning'
      />
    </Text>
    <Text size='14px' style={spacing('mt-10')} weight={300}>
      <FormattedMessage
        id='modals.showxlmpriv.warning.message'
        defaultMessage="Don't share your private key with anyone. This may result in a loss of funds."
      />
    </Text>
  </div>
)

const SecondStep = ({ addr, balance, priv }) => (
  <div style={flex('row')}>
    <div style={spacing('mr-25')}>
      <QRCodeWrapper value={priv} size={120} />
    </div>
    <DetailTable>
      <DetailRow>
        <DetailRowText size='14px' weight={400}>
          <FormattedMessage
            id='modals.showxlmpriv.balance'
            defaultMessage='Balance'
          />
        </DetailRowText>
        {':'}
        &nbsp;
        <CoinDisplay coin='XLM' size='14px'>
          {balance}
        </CoinDisplay>
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={400}>
          <FormattedMessage
            id='modals.showxlmpriv.address'
            defaultMessage='Address'
          />
        </DetailRowText>
        {':'}
        &nbsp;
        <DataRowText
          size='14px'
          weight={300}
          data-e2e='xlmPrivateKeyModalAddress'
        >
          {addr}
        </DataRowText>
      </DetailRow>
      <DetailRow>
        <DetailRowText size='14px' weight={400}>
          <FormattedMessage
            id='modals.showxlmpriv.priv_key'
            defaultMessage='Private Key'
          />
        </DetailRowText>
        {':'}
        &nbsp;
        <DataRowText
          size='14px'
          weight={300}
          data-e2e='xlmPrivateKeyModalPrivKey'
        >
          {priv}
        </DataRowText>
      </DetailRow>
    </DetailTable>
  </div>
)

const ShowPrivateKeyTemplate = ({
  position,
  total,
  close,
  step,
  onContinue,
  ...rest
}) => (
  <Modal size='large' position={position} total={total}>
    <ModalHeader
      icon='lock'
      closeButton={false}
      data-e2e='xlmPrivateKeyModalHeader'
    >
      <FormattedMessage
        id='modals.showxlmpriv.title'
        defaultMessage='Private Key'
      />
    </ModalHeader>
    <ModalBody>
      {step === 0 ? <FirstStep /> : <SecondStep {...rest} />}
    </ModalBody>
    <ModalFooter align='right'>
      <Text
        cursor='pointer'
        size='small'
        weight={300}
        style={spacing('mr-15')}
        onClick={close}
        data-e2e='xlmPrivateKeyModalClose'
      >
        <FormattedMessage
          id='modals.showxlmpriv.close'
          defaultMessage='Close'
        />
      </Text>
      {step === 0 && (
        <Button
          nature='primary'
          onClick={onContinue}
          data-e2e='xlmPrivateKeyModalContinue'
        >
          <FormattedMessage
            id='modals.showxlmpriv.continue'
            defaultMessage='Continue'
          />
        </Button>
      )}
    </ModalFooter>
  </Modal>
)

export default ShowPrivateKeyTemplate
