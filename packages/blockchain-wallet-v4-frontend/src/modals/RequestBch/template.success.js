import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import QRCodeReact from 'qrcode.react'

import { required } from 'services/FormHelper'
import { Button, Modal, ModalHeader, ModalBody, Separator, Text, Tooltip } from 'blockchain-info-components'
import { Form, SelectBoxBitcoinAddresses, SelectBoxCoin } from 'components/Form'
import CopyClipboard from 'components/CopyClipboard'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const CoinSelector = styled.div`
  width: 40%;
  margin-bottom: 20px;
`
const AddressSelector = styled.div`
  width: 55%;
  margin-bottom: 20px;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 30px 0;
`
const ScanMessage = styled.div`
  padding-bottom: 20px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const RequestBch = props => {
  const { submitting, invalid, handleSubmit, receiveAddress } = props

  return (
    <Modal size='large' position={props.position} total={props.total}>
      <ModalHeader icon='request' onClose={props.closeAll}>
        <FormattedMessage id='modals.requestbch.title' defaultMessage='Request Bitcoin Cash' />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <CoinSelector>
              <Text size='14px' weight={500}>
                <FormattedMessage id='modals.sendbch.coin' defaultMessage='Currency:' />
              </Text>
              <Field name='coin' component={SelectBoxCoin} validate={[required]} />
            </CoinSelector>
            <AddressSelector>
              <Text size='14px' weight={500} capitalize>
                <FormattedMessage id='modals.requestbitcoin.firststep.to' defaultMessage='Receive to:' />
              </Text>
              <Field name='to' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ includeAll: false }} />
            </AddressSelector>
          </Row>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.requestbch.share' defaultMessage='Copy & share address:' />
            <Tooltip>
              <FormattedMessage id='modals.requestbch.share_tooltip1' defaultMessage='Share this address with others, and they can send you Bitcoin Cash directly to your wallet.' />
              <FormattedMessage id='modals.requestbch.share_tooltip2' defaultMessage='Your address changes with every payment.' />
              <FormattedMessage id='modals.requestbch.share_tooltip3' defaultMessage='You can also create a request by attaching an amount below.' />
            </Tooltip>
          </Text>
          <AddressContainer>
            <CopyClipboard address={receiveAddress} />
          </AddressContainer>
          <Separator>
            <Text size='14px' weight={300} uppercase>
              <FormattedMessage id='modals.requestbch.or' defaultMessage='Or' />
            </Text>
          </Separator>
          <QRCodeContainer>
            <ScanMessage>
              <Text size='14px'>
                <FormattedMessage id='modals.requestbch.scan' defaultMessage='Scan QR Code:' />
                <Tooltip>
                  <FormattedMessage id='modals.requestbch.scan_tooltip' defaultMessage='Ask the sender to scan this QR code with their Bitcoin cash wallet' />
                </Tooltip>
              </Text>
            </ScanMessage>
            <QRCodeReact value={receiveAddress} size={150} />
          </QRCodeContainer>
          <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
            <FormattedMessage id='modals.requestbch.done' defaultMessage='Done' />
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

RequestBch.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  receiveAddress: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestBch', destroyOnUnmount: false })(RequestBch)
