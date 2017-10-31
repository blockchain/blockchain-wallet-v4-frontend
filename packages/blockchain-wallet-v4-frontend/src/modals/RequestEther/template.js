import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import QRCodeReact from 'qrcode.react'

import { required } from 'services/FormHelper'
import { Button, Modal, ModalHeader, ModalBody, Separator, Text, Tooltip } from 'blockchain-info-components'
import { Form, SelectBoxCoin } from 'components/Form'
import CopyClipboard from 'components/CopyClipboard'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 30px 0;
`
const CoinSelector = styled.div`
  width: 50%;
  margin-bottom: 20px;
`
const ScanMessage = styled.div`
  padding-bottom: 20px;
`

const RequestEther = (props) => {
  const { position, closeAll, ...rest } = props
  const { onSubmit, receiveAddress } = rest

  return (
    <Modal size='large' position={position}>
      <ModalHeader icon='request' onClose={closeAll}>
        <FormattedMessage id='modals.requestether.title' defaultMessage='Request' />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onSubmit}>
          <CoinSelector>
            <Text size='14px' weight={500}>
              <FormattedMessage id='modals.requestether.coin' defaultMessage='Currency:' />
            </Text>
            <Field name='coin' component={SelectBoxCoin} validate={[required]} />
          </CoinSelector>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.requestether.share' defaultMessage='Copy & share address:' />
            <Tooltip>
              <FormattedMessage id='modals.requestether.share_tooltip' defaultMessage='Share this address with others, and they can send you ETH directly to your wallet. Your request address will not change.' />
            </Tooltip>
          </Text>
          <AddressContainer>
            <CopyClipboard address={receiveAddress} />
          </AddressContainer>
          <Separator>
            <Text size='14px' weight={300} uppercase>
              <FormattedMessage id='modals.requestether.or' defaultMessage='Or' />
            </Text>
          </Separator>
          <QRCodeContainer>
            <ScanMessage>
              <Text size='14px'>
                <FormattedMessage id='modals.requestether.scan' defaultMessage='Scan QR Code:' />
                <Tooltip>
                  <FormattedMessage id='modals.requestether.scan_tooltip' defaultMessage='Ask the sender to scan this QR code with their ether wallet' />
                </Tooltip>
              </Text>
            </ScanMessage>
            <QRCodeReact value={receiveAddress} size={150} />
          </QRCodeContainer>
          <Button type='submit' nature='primary' fullwidth uppercase>
            <FormattedMessage id='modals.requestether.done' defaultMessage='Done' />
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

RequestEther.propTypes = {
  position: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired,
  receiveAddress: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  coin: PropTypes.string.isRequired
}

export default reduxForm({ form: 'requestEther', destroyOnUnmount: false })(RequestEther)
