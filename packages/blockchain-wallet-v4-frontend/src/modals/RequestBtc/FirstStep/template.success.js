import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Separator, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, SelectBoxBitcoinAddresses, TextArea, SelectBoxCoin } from 'components/Form'
import CopyClipboard from 'components/CopyClipboard'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const QRCodeButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 36px;
  background-color: ${props => props.theme['brand-secondary']};
  color: ${props => props.theme['white']};
  font-weight: 300;
  cursor: pointer;
`
const CoinSelector = styled.div`
  width: 50%;
  margin-bottom: 20px;
`

const FirstStep = props => {
  const { submitting, invalid, handleSubmit, handleClickQRCode, receiveAddress } = props

  return (
    <Form onSubmit={handleSubmit}>
      <CoinSelector>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.sendbtc.firststep.coin' defaultMessage='Currency:' />
        </Text>
        <Field name='coin' component={SelectBoxCoin} validate={[required]} />
      </CoinSelector>
      <Text size='14px' weight={500}>
        <FormattedMessage id='modals.requestbtc.firststep.share' defaultMessage='Copy & share address:' />
        <Tooltip>
          <FormattedMessage id='modals.requestbtc.firststep.share_tooltip1' defaultMessage='Share this address with others, and they can send you BTC directly to your wallet.' />
          <FormattedMessage id='modals.requestbtc.firststep.share_tooltip2' defaultMessage='Your address changes with every payment.' />
          <FormattedMessage id='modals.requestbtc.firststep.share_tooltip3' defaultMessage='You can also create a request by attaching an amount below.' />
        </Tooltip>
      </Text>
      <AddressContainer>
        <CopyClipboard address={receiveAddress} />
        <QRCodeButton onClick={handleClickQRCode}>
          <FormattedMessage id='modals.requestbtc.firststep.qrcode' defaultMessage='QR Code' />
        </QRCodeButton>
      </AddressContainer>
      <Separator>
        <Text size='14px' weight={300} uppercase>
          <FormattedMessage id='modals.requestbtc.firststep.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <Text size='14px' weight={500} capitalize>
        <FormattedMessage id='modals.requestbtc.firststep.amount' defaultMessage='Enter amount:' />
      </Text>
      <Field name='amount' component={FiatConvertor} validate={[required]} coin='BTC' />
      <Text size='14px' weight={500} capitalize>
        <FormattedMessage id='modals.requestbtc.firststep.to' defaultMessage='Receive to:' />
      </Text>
      <Field name='to' component={SelectBoxBitcoinAddresses} validate={[required]} props={{ includeAll: false }} />
      <Text size='14px' weight={500} capitalize>
        <FormattedMessage id='modals.requestbtc.firststep.description' defaultMessage='Description:' />
      </Text>
      <Field name='message' component={TextArea} validate={[required]} placeholder="What's this transaction for?" />
      <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
        <FormattedMessage id='modals.requestbtc.firststep.next' defaultMessage='Next' />
      </Button>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  receiveAddress: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClickQRCode: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestBtc', destroyOnUnmount: false })(FirstStep)
