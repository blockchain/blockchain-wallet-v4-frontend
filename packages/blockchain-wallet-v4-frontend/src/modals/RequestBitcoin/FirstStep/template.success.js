import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Separator, Text, Tooltip } from 'blockchain-info-components'
import { FiatConvertor, Form, FormGroup, FormItem, FormLabel, SelectBoxBitcoinAddresses, TextArea, SelectBoxCoin } from 'components/Form'
import CopyClipboard from 'components/CopyClipboard'

const AddressContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const AddressFormLabel = styled(FormLabel)`
  > div {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
`
const QRText = styled(Text)`
  cursor: pointer;
`
const CoinSelector = styled(FormGroup)`
  width: 50%;
`

const FirstStep = props => {
  const { submitting, invalid, handleSubmit, handleClickQRCode, receiveAddress } = props

  return (
    <Form onSubmit={handleSubmit}>
      <CoinSelector margin={'20px'}>
        <FormItem>
          <FormLabel for='coin'>
            <FormattedMessage id='modals.sendbitcoin.firststep.coin' defaultMessage='Currency:' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
      </CoinSelector>
      <FormGroup margin={'5px'}>
        <FormItem>
          <AddressFormLabel>
            <div>
              <FormattedMessage id='modals.requestbitcoin.firststep.share' defaultMessage='Copy & Share Address:&nbsp;' />
              <Tooltip>
                <FormattedMessage id='modals.requestbitcoin.firststep.share_tooltip' defaultMessage='Share this address with others, and they can send you BTC directly to your wallet. Your address changes with every payment. You can also create a request by attaching an amount below.' />
              </Tooltip>
            </div>
            <QRText size='14px' weight={300} color='brand-secondary' onClick={handleClickQRCode}>
              <FormattedMessage id='modals.requestbitcoin.firststep.qrcode' defaultMessage='QR Code' />
            </QRText>
          </AddressFormLabel>
          <AddressContainer>
            <CopyClipboard address={receiveAddress} />
          </AddressContainer>
        </FormItem>
      </FormGroup>
      <Separator margin={'20px 0'}>
        <Text size='14px' weight={300} uppercase>
          <FormattedMessage id='modals.requestbitcoin.firststep.or' defaultMessage='Or' />
        </Text>
      </Separator>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage id='modals.requestbitcoin.firststep.amount' defaultMessage='Enter Amount:' />
          </FormLabel>
          <Field name='amount' component={FiatConvertor} validate={[required]} coin='BTC' />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage id='modals.requestbitcoin.firststep.to' defaultMessage='Receive To:' />
          </FormLabel>
          <Field name='to' component={SelectBoxBitcoinAddresses} includeAll={false} validate={[required]} />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'20px'}>
        <FormItem>
          <FormLabel for='message'>
            <FormattedMessage id='modals.requestbitcoin.firststep.description' defaultMessage='Description:' />
          </FormLabel>
          <Field name='message' component={TextArea} validate={[required]} placeholder="What's this transaction for?" />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
          <FormattedMessage id='modals.requestbitcoin.firststep.next' defaultMessage='Next' />
        </Button>
      </FormGroup>
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

export default reduxForm({ form: 'requestBitcoin', destroyOnUnmount: false })(FirstStep)
