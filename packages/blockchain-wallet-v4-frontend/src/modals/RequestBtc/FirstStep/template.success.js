import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
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
`

const FirstStep = props => {
  const {
    submitting,
    invalid,
    handleSubmit,
    handleClickQRCode,
    receiveAddress,
    importedAddresses
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
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
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
            includeAll={false}
            validate={[required]}
          />
          {contains(receiveAddress, importedAddresses) ? (
            <BannerContainer>
              <Banner type='warning'>
                <FormattedMessage
                  id='modals.requestbitcoin.firststep.importedwarning'
                  defaultMessage='You are about to receive to a watch-only address. You can only spend these funds if you have access to the private key.'
                />
              </Banner>
            </BannerContainer>
          ) : null}
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
            data-e2e='requestBtc_description'
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          fullwidth
          uppercase
          disabled={submitting || invalid}
          data-e2e='requestBtc_next_button'
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
