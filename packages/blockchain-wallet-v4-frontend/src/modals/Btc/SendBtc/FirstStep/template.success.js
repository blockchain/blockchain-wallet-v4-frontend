import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Banner,
  Button,
  Image,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import ComboDisplay from 'components/Display/ComboDisplay'
import {
  CountdownTimer,
  FiatConverter,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  NumberBoxDebounced,
  SelectBox,
  SelectBoxBtcAddresses,
  SelectBoxCoin,
  TextAreaDebounced,
  TextBox
} from 'components/Form'
import QRCodeCapture from 'components/QRCode/Capture'
import {
  ColLeft,
  ColRight,
  CustodyToAccountMessage,
  CustomFeeAlertBanner,
  FeeFormContainer,
  FeeFormGroup,
  FeeFormLabel,
  FeeOptionsContainer,
  FeePerByteContainer,
  Row
} from 'components/Send'
import MnemonicRequiredForCustodySend from 'components/Send/RecoveryPhrase'
import UnstoppableDomains from 'components/UnstoppableDomains'
import { model } from 'data'
import { required, validBtcAddress } from 'services/forms'

import PriorityFeeLink from './PriorityFeeLink'
import RegularFeeLink from './RegularFeeLink'
import {
  insufficientFunds,
  invalidAmount,
  maximumAmount,
  maximumFeePerByte,
  minimumAmount,
  minimumFeePerByte,
  minimumOneSatoshi,
  shouldError,
  shouldWarn
} from './validation'

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
    handleBitPayInvoiceExpiration,
    handleFeePerByteToggle,
    handleSubmit,
    invalid,
    pristine,
    submitting,
    ...rest
  } = props

  const {
    amount,
    autofilled,
    excludeHDWallets,
    feePerByte,
    feePerByteElements,
    feePerByteToggled,
    from,
    isMnemonicVerified,
    payPro,
    priorityFeePerByte,
    regularFeePerByte,
    totalFee
  } = rest
  const isPayPro = !!payPro
  const isFromCustody = from && from.type === 'CUSTODIAL'
  const disableCustodySend = isFromCustody && !isMnemonicVerified

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin='15px' style={{ zIndex: 3 }}>
        <FormItem width='40%'>
          <FormLabel htmlFor='coin'>
            <FormattedMessage id='modals.sendbtc.firststep.currency' defaultMessage='Currency' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} type='send' validate={[required]} />
        </FormItem>
        <FormItem width='60%'>
          <FormLabel htmlFor='from'>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </FormLabel>
          <Field
            name='from'
            includeAll={false}
            validate={[required]}
            component={SelectBoxBtcAddresses}
            excludeHDWallets={excludeHDWallets}
            includeCustodial
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={isFromCustody ? '15px' : '8px'}>
        <FormItem>
          <FormLabel htmlFor='to'>
            <FormattedMessage id='modals.sendbtc.firststep.towallet' defaultMessage='To' />
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
                  component={SelectBoxBtcAddresses}
                  dataE2e='sendBtcAddressInput'
                  exclude={from ? [from.label] : []}
                  includeAll={false}
                  includeExchangeAddress
                  isCreatable
                  isValidNewOption={() => false}
                  includeCustodial={!isFromCustody}
                  forceCustodialFirst
                  name='to'
                  noOptionsMessage={() => null}
                  placeholder='Paste, scan, or select destination'
                  validate={[required, validBtcAddress]}
                />
                <QRCodeCapture scanType='btcAddress' border={['top', 'bottom', 'right', 'left']} />
              </>
            ) : (
              <Field
                name='to'
                component={TextBox}
                input={{ value: `bitcoin:?r=${payPro.paymentUrl}` }}
                disabled
              />
            )}
          </Row>
        </FormItem>
      </FormGroup>
      <UnstoppableDomains form={model.components.sendBtc.FORM} />
      <FormGroup>
        <CustodyToAccountMessage coin='BTC' account={from} amount={amount} />
      </FormGroup>
      <FormGroup margin='15px'>
        <FormItem>
          <FormLabel htmlFor='amount'>
            <FormattedMessage id='copy.amount' defaultMessage='Amount' />
          </FormLabel>
          <Field
            name='amount'
            component={FiatConverter}
            validate={[required, invalidAmount, insufficientFunds, minimumAmount, maximumAmount]}
            coin='BTC'
            data-e2e='sendBtc'
            disabled={isPayPro}
            marginTop='8px'
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin='15px'>
        <FormItem>
          <FormLabel>
            <FormattedMessage id='modals.sendbtc.firststep.desc' defaultMessage='Description' />
            <TooltipHost id='sendbtc.firststep.sharetooltip'>
              <TooltipIcon name='info' size='12px' />
            </TooltipHost>
          </FormLabel>
          {!isPayPro ? (
            <Field
              name='description'
              disabled={isFromCustody}
              component={TextAreaDebounced}
              placeholder="What's this transaction for? (optional)"
              rows={3}
              data-e2e='sendBtcDescription'
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
      {!isPayPro && !isFromCustody ? (
        <>
          <FeeFormGroup inline margin='10px'>
            <ColLeft>
              <FeeFormContainer toggled={feePerByteToggled}>
                <FeeFormLabel>
                  <FormattedMessage
                    id='modals.sendbtc.firststep.networkfee'
                    defaultMessage='Network Fee'
                  />
                  <span>&nbsp;</span>
                  {!feePerByteToggled && (
                    <Field name='feePerByte' component={SelectBox} elements={feePerByteElements} />
                  )}
                  {feePerByteToggled && (
                    <FeeOptionsContainer>
                      <RegularFeeLink fee={regularFeePerByte} />
                      <span>&nbsp;</span>
                      <PriorityFeeLink fee={priorityFeePerByte} />
                    </FeeOptionsContainer>
                  )}
                </FeeFormLabel>
                {feePerByteToggled && (
                  <FeePerByteContainer style={{ marginTop: '10px' }}>
                    <Field
                      name='feePerByte'
                      component={NumberBoxDebounced}
                      validate={[required, minimumOneSatoshi]}
                      warn={[minimumFeePerByte, maximumFeePerByte]}
                      errorBottom
                      errorLeft
                      unit='sat/byte'
                      data-e2e='sendBtcCustomFeeInput'
                    />
                  </FeePerByteContainer>
                )}
              </FeeFormContainer>
            </ColLeft>
            <ColRight>
              <ComboDisplay size='13px' weight={600} coin='BTC'>
                {totalFee}
              </ComboDisplay>
              <Link
                size='12px'
                weight={400}
                capitalize
                onClick={handleFeePerByteToggle}
                data-e2e='sendBtcCustomFeeLink'
              >
                {feePerByteToggled ? (
                  <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
                ) : (
                  <FormattedMessage
                    id='modals.sendbtc.firststep.customizefee'
                    defaultMessage='Customize Fee'
                  />
                )}
              </Link>
            </ColRight>
          </FeeFormGroup>
          {feePerByteToggled && (
            <CustomFeeAlertBanner type='alert'>
              <Text size='12px'>
                <FormattedMessage
                  id='modals.sendbtc.firststep.customfeeinfo'
                  defaultMessage='This feature is recommended for advanced users only. By choosing a custom fee, you risk overpaying or your transaction never being confirmed.'
                />
              </Text>
            </CustomFeeAlertBanner>
          )}
        </>
      ) : (
        <FeeFormGroup margin='10px'>
          <FormLabel>
            <FormattedMessage
              id='modals.sendbtc.firststep.networkfee'
              defaultMessage='Network Fee'
            />
          </FormLabel>
          <ComboDisplay size='13px' weight={600} coin='BTC'>
            {totalFee}
          </ComboDisplay>
        </FeeFormGroup>
      )}
      <FormGroup margin='15px'>
        {feePerByte > regularFeePerByte ? (
          <Text size='13px' weight={400} data-e2e='btcSendEstTimeMinutes'>
            <FormattedMessage
              defaultMessage='Estimated confirmation time 0-60 minutes'
              id='modals.sendbtc.firststep.estimated2'
            />
          </Text>
        ) : (
          <Text size='13px' weight={400} data-e2e='btcSendEstTimeHourPlus'>
            <FormattedMessage
              id='modals.sendbtc.firststep.estimated'
              defaultMessage='Estimated confirmation time 1+ hour'
            />
          </Text>
        )}
      </FormGroup>
      {isPayPro && invalid && (
        <Text size='13px' color='error' weight={500} style={{ textAlign: 'center' }}>
          <FormattedMessage
            id='modals.sendbtc.firststep.bitpay.insufficientfunds'
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
          data-e2e='sendBtcContinue'
          disabled={
            submitting || invalid || disableCustodySend || (!isPayPro && pristine && !autofilled)
          }
        >
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      </SubmitFormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  feePerByteElements: PropTypes.arrayOf.isRequired,
  feePerByteToggled: PropTypes.bool.isRequired,
  handleFeePerByteToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  priorityFeePerByte: PropTypes.number.isRequired,
  regularFeePerByte: PropTypes.number.isRequired,
  submitting: PropTypes.bool.isRequired,
  totalFee: PropTypes.string
}

export default reduxForm({
  destroyOnUnmount: false,
  form: model.components.sendBtc.FORM,
  shouldError,
  shouldWarn
})(FirstStep)
