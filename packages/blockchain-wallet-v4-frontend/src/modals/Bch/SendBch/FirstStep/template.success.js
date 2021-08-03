import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Banner, Button, Image, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import ComboDisplay from 'components/Display/ComboDisplay'
import {
  CountdownTimer,
  FiatConverter,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxBchAddresses,
  SelectBoxCoin,
  TextAreaDebounced,
  TextBox
} from 'components/Form'
import QRCodeCapture from 'components/QRCode/Capture'
import { CustodyToAccountMessage, Row } from 'components/Send'
import MnemonicRequiredForCustodySend from 'components/Send/RecoveryPhrase'
import UnstoppableDomains from 'components/UnstoppableDomains'
import { model } from 'data'
import { required, validBchAddress } from 'services/forms'

import { insufficientFunds, invalidAmount, maximumAmount, shouldError } from './validation'

const SubmitFormGroup = styled(FormGroup)`
  margin-top: 16px;
`
const TimerContainer = styled.div`
  width: 66%;
  display: inline-block;
  float: right;
`
const CustomMerchantInput = styled(Field)`
  & > input {
    padding-right: 84px;
  }
`
const ImageInInputContainer = styled.div`
  position: absolute;
  margin-top: -35px;
  right: 10px;
`

const FirstStep = (props) => {
  const {
    amount,
    excludeHDWallets,
    from,
    handleBitPayInvoiceExpiration,
    handleSubmit,
    invalid,
    isMnemonicVerified,
    payPro,
    pristine,
    submitting,
    totalFee
  } = props
  const isPayPro = !!payPro
  const isFromCustody = from && from.type === 'CUSTODIAL'
  const disableCustodySend = isFromCustody && !isMnemonicVerified

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin='15px' style={{ zIndex: 3 }}>
        <FormItem width='40%'>
          <FormLabel htmlFor='coin'>
            <FormattedMessage id='modals.sendBch.firststep.currency' defaultMessage='Currency' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} type='send' validate={[required]} />
        </FormItem>
        <FormItem width='60%'>
          <FormLabel htmlFor='from'>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </FormLabel>
          <Field
            name='from'
            coin='BCH'
            includeAll={false}
            validate={[required]}
            component={SelectBoxBchAddresses}
            excludeHDWallets={excludeHDWallets}
            includeCustodial
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin='15px'>
        <FormItem>
          <FormLabel htmlFor='to'>
            <FormattedMessage id='modals.sendBch.firststep.towallet' defaultMessage='To' />
            {isPayPro && (
              <TimerContainer>
                <CountdownTimer
                  expiryDate={payPro.expiration}
                  handleExpiry={handleBitPayInvoiceExpiration}
                  hideTooltip
                  payProInvoice
                />
              </TimerContainer>
            )}
          </FormLabel>
          <Row>
            {!isPayPro ? (
              <>
                <Field
                  component={SelectBoxBchAddresses}
                  dataE2e='sendBchAddressInput'
                  exclude={from ? [from.label] : []}
                  includeAll={false}
                  includeExchangeAddress
                  isCreatable
                  isValidNewOption={() => false}
                  includeCustodial={!isFromCustody}
                  forceCustodialFirst
                  name='to'
                  noOptionsMessage={() => null}
                  openMenuOnClick={!!isFromCustody}
                  placeholder='Paste, scan, or select destination'
                  validate={isFromCustody ? [required] : [required, validBchAddress]}
                />
                <QRCodeCapture scanType='bchAddress' border={['top', 'bottom', 'right', 'left']} />
              </>
            ) : (
              <Field
                name='to'
                component={TextBox}
                input={{ value: `web+bitcoincash:?r=${payPro.paymentUrl}` }}
                disabled
              />
            )}
          </Row>
        </FormItem>
      </FormGroup>
      <UnstoppableDomains form={model.components.sendBch.FORM} />
      <FormGroup>
        <CustodyToAccountMessage coin='BCH' account={from} amount={amount} />
      </FormGroup>
      <FormGroup margin='15px'>
        <FormItem>
          <FormLabel htmlFor='amount'>
            <FormattedMessage id='copy.amount' defaultMessage='Amount' />
          </FormLabel>
          <Field
            name='amount'
            component={FiatConverter}
            validate={[required, invalidAmount, insufficientFunds, maximumAmount]}
            coin='BCH'
            marginTop='8px'
            data-e2e='sendBch'
            disabled={isPayPro}
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin='15px'>
        <FormItem>
          <FormLabel>
            <FormattedMessage id='modals.sendBch.firststep.desc' defaultMessage='Description' />
            <TooltipHost id='sendBch.firststep.share_tooltip'>
              <TooltipIcon name='info' size='12px' />
            </TooltipHost>
          </FormLabel>
          {!isPayPro ? (
            <Field
              name='description'
              component={TextAreaDebounced}
              placeholder="What's this transaction for? (optional)"
              data-e2e='sendBchDescription'
              disabled={isFromCustody}
              rows={3}
              fullwidth
              maxLength={100}
            />
          ) : (
            <>
              <CustomMerchantInput
                name='description'
                component={TextBox}
                placeholder="What's this transaction for? (optional)"
                rows={3}
                data-e2e='sendBtcDescription'
                maxLength={100}
              />
              <ImageInInputContainer>
                <Image name='bitpay-logo' height='24px' />
              </ImageInInputContainer>
            </>
          )}
        </FormItem>
      </FormGroup>
      <FormGroup inline margin={isPayPro ? '10px' : '30px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendBch.firststep.networkfee'
              defaultMessage='Network Fee'
            />
          </FormLabel>
          <ComboDisplay size='13px' coin='BCH' weight={500}>
            {totalFee}
          </ComboDisplay>
        </FormItem>
      </FormGroup>
      {isPayPro && invalid && (
        <Text size='13px' color='error' weight={500} style={{ textAlign: 'center' }}>
          <FormattedMessage
            id='modals.sendBch.firststep.bitpay.insufficientfunds'
            defaultMessage='Insufficient funds to complete BitPay transaction'
          />
        </Text>
      )}
      {isFromCustody && !isMnemonicVerified ? <MnemonicRequiredForCustodySend /> : null}
      <SubmitFormGroup>
        <Button
          type='submit'
          nature='primary'
          height='56px'
          size='18px'
          disabled={submitting || invalid || disableCustodySend || (!isPayPro && pristine)}
          data-e2e='bchSendContinue'
        >
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      </SubmitFormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  totalFee: PropTypes.string.isRequired
}

export default reduxForm({
  destroyOnUnmount: false,
  form: model.components.sendBch.FORM,
  shouldError
})(FirstStep)
