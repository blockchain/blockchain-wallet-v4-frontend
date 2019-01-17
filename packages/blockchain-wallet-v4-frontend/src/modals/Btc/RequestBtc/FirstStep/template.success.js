import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { contains } from 'ramda'
import { required } from 'services/FormHelper'
import { invalidAmountMin, invalidAmountMax } from './validation'
import {
  Button,
  Separator,
  Text,
  TooltipIcon,
  TooltipHost,
  Banner
} from 'blockchain-info-components'
import {
  FiatConvertor,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBtcAddresses,
  TextArea,
  SelectBoxCoin
} from 'components/Form'
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
const BannerContainer = styled.div`
  margin-top: 5px;
  .link {
    cursor: pointer;
    text-decoration: underline;
    color: ${props => props.theme['brand-primary']};
  }
`

const FirstStep = props => {
  const {
    type,
    invalid,
    submitting,
    handleSubmit,
    receiveAddress,
    handleClickQRCode,
    handleOpenLockbox,
    importedAddresses,
    excludeLockbox
  } = props

  return (
    <Form onSubmit={handleSubmit}>
      <CoinSelector margin={'20px'}>
        <FormItem>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendbitcoin.firststep.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field
            name='coin'
            component={SelectBoxCoin}
            type='request'
            validate={[required]}
          />
        </FormItem>
      </CoinSelector>
      <FormGroup margin={'5px'}>
        <FormItem>
          <AddressFormLabel>
            <div>
              <FormattedMessage
                id='modals.requestbitcoin.firststep.share'
                defaultMessage='Copy & Share Address: '
              />
              <TooltipHost id='reqBitcoinShare'>
                <TooltipIcon name='question-in-circle' />
              </TooltipHost>
            </div>
            <QRText
              size='14px'
              weight={300}
              color='brand-secondary'
              onClick={handleClickQRCode}
            >
              <FormattedMessage
                id='modals.requestbitcoin.firststep.qrcode'
                defaultMessage='QR Code'
              />
            </QRText>
          </AddressFormLabel>
          <AddressContainer>
            <CopyClipboard address={receiveAddress} data-e2e='requestBtc' />
          </AddressContainer>
        </FormItem>
      </FormGroup>
      {type === 'LOCKBOX' && (
        <BannerContainer onClick={handleOpenLockbox}>
          <Banner type='alert'>
            <FormattedHTMLMessage
              id='modals.requestbitcoin.firststep.lockbox'
              defaultMessage='Please confirm this address on your lockbox device by opening your Bitcoin app. <span class="link">Click here</span> once the Bitcoin app has been opened.'
            />
          </Banner>
        </BannerContainer>
      )}
      <Separator margin={'20px 0'}>
        <Text size='14px' weight={300} uppercase>
          <FormattedMessage
            id='modals.requestbitcoin.firststep.or'
            defaultMessage='Or'
          />
        </Text>
      </Separator>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage
              id='modals.requestbitcoin.firststep.amount'
              defaultMessage='Enter Amount:'
            />
          </FormLabel>
          <Field
            name='amount'
            component={FiatConvertor}
            validate={[required, invalidAmountMin, invalidAmountMax]}
            coin='BTC'
            data-e2e='requestBtc'
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.requestbitcoin.firststep.to'
              defaultMessage='Receive To:'
            />
          </FormLabel>
          <Field
            name='to'
            component={SelectBoxBtcAddresses}
            excludeLockbox={excludeLockbox}
            includeAll={false}
            validate={[required]}
          />
          {contains(receiveAddress, importedAddresses) && (
            <BannerContainer>
              <Banner type='warning'>
                <FormattedMessage
                  id='modals.requestbitcoin.firststep.importedwarning'
                  defaultMessage='You are about to receive to a watch-only address. You can only spend these funds if you have access to the private key.'
                />
              </Banner>
            </BannerContainer>
          )}
        </FormItem>
      </FormGroup>
      <FormGroup margin={'20px'}>
        <FormItem>
          <FormLabel for='message'>
            <FormattedMessage
              id='modals.requestbitcoin.firststep.description'
              defaultMessage='Description:'
            />
          </FormLabel>
          <Field
            name='message'
            component={TextArea}
            validate={[required]}
            placeholder="What's this transaction for?"
            data-e2e='requestBtcDescription'
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          fullwidth
          disabled={submitting || invalid}
          data-e2e='requestBtcNextButton'
        >
          <FormattedMessage
            id='modals.requestbitcoin.firststep.next'
            defaultMessage='Next'
          />
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

export default reduxForm({ form: 'requestBitcoin', destroyOnUnmount: false })(
  FirstStep
)
