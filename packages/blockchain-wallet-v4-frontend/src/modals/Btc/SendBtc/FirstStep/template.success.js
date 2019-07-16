import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import Bowser from 'bowser'
import styled from 'styled-components'

import { model } from 'data'
import {
  required,
  validBtcAddress,
  validBtcPrivateKey
} from 'services/FormHelper'
import {
  Banner,
  Button,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  FiatConverter,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  NumberBoxDebounced,
  SelectBoxBtcAddresses,
  SelectBoxCoin,
  SelectBox,
  TextBox,
  TextAreaDebounced
} from 'components/Form'
import {
  shouldError,
  shouldWarn,
  isAddressDerivedFromPriv,
  insufficientFunds,
  minimumAmount,
  maximumAmount,
  minimumFeePerByte,
  maximumFeePerByte,
  minimumOneSatoshi,
  invalidAmount
} from './validation'
import {
  Row,
  ColLeft,
  ColRight,
  CustomFeeAlertBanner,
  FeeFormContainer,
  FeeFormGroup,
  FeeFormLabel,
  FeeOptionsContainer,
  FeePerByteContainer
} from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'
import RegularFeeLink from './RegularFeeLink'
import PriorityFeeLink from './PriorityFeeLink'
import ComboDisplay from 'components/Display/ComboDisplay'

const WarningBanners = styled(Banner)`
  margin: -6px 0 12px;
  padding: 8px;
`
const SubmitFormGroup = styled(FormGroup)`
  margin-top: 16px;
`

const FirstStep = props => {
  const {
    invalid,
    submitting,
    pristine,
    handleFeePerByteToggle,
    handleToToggle,
    handleSubmit,
    ...rest
  } = props
  const {
    from,
    watchOnly,
    feePerByte,
    feePerByteToggled,
    feePerByteElements,
    regularFeePerByte,
    priorityFeePerByte,
    totalFee,
    excludeLockbox,
    excludeHDWallets
  } = rest
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const isBrowserSupported = browser.satisfies(
    model.components.lockbox.supportedBrowsers
  )
  const disableLockboxSend = isFromLockbox && !isBrowserSupported

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendbtc.firststep.currency'
              defaultMessage='Currency'
            />
          </FormLabel>
          <Field
            name='coin'
            component={SelectBoxCoin}
            type='send'
            validate={[required]}
          />
        </FormItem>
        <FormItem width={'60%'}>
          <FormLabel for='from'>
            <FormattedMessage
              id='modals.sendbtc.firststep.fromwallet'
              defaultMessage='From'
            />
          </FormLabel>
          <Field
            name='from'
            includeAll={false}
            validate={[required]}
            component={SelectBoxBtcAddresses}
            excludeHDWallets={excludeHDWallets}
            excludeLockbox={excludeLockbox}
          />
          {watchOnly && (
            <Row>
              <Field
                name='priv'
                placeholder='Please enter your private key...'
                component={TextBox}
                validate={[
                  required,
                  validBtcPrivateKey,
                  isAddressDerivedFromPriv
                ]}
                autoFocus
                errorBottom
              />
              <QRCodeCapture
                scanType='btcPriv'
                border={['top', 'bottom', 'right']}
              />
            </Row>
          )}
        </FormItem>
      </FormGroup>
      {isFromLockbox && !disableLockboxSend && (
        <WarningBanners type='info'>
          <Text color='warning' size='13px'>
            <FormattedMessage
              id='modals.sendbtc.firststep.lockboxwarn'
              defaultMessage='You will need to connect your Lockbox to complete this transaction.'
            />
          </Text>
        </WarningBanners>
      )}
      {disableLockboxSend && (
        <WarningBanners type='warning'>
          <Text color='warning' size='13px'>
            <FormattedMessage
              id='modals.sendbtc.firststep.browserwarn'
              defaultMessage='Sending Bitcoin from Lockbox can only be done while using the Brave, Chrome, Firefox or Opera browsers.'
            />
          </Text>
        </WarningBanners>
      )}
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendbtc.firststep.towallet'
              defaultMessage='To'
            />
          </FormLabel>
          <Row>
            <Field
              name='to'
              placeholder='Paste, scan, or select destination'
              component={SelectBoxBtcAddresses}
              dataE2e='sendBtcAddressInput'
              validate={[required, validBtcAddress]}
              exclude={[from.label]}
              openMenuOnClick={false}
              includeAll={false}
              isCreatable
              noOptionsMessage={() => null}
              isValidNewOption={() => false}
            />
            <QRCodeCapture
              scanType='btcAddress'
              border={['top', 'bottom', 'right']}
            />
          </Row>
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='amount'>
            <FormattedMessage
              id='modals.sendbtc.firststep.sendamount'
              defaultMessage='Amount'
            />
          </FormLabel>
          <Field
            name='amount'
            component={FiatConverter}
            validate={[
              required,
              invalidAmount,
              insufficientFunds,
              minimumAmount,
              maximumAmount
            ]}
            coin='BTC'
            data-e2e='sendBtc'
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendbtc.firststep.desc'
              defaultMessage='Description'
            />
            <TooltipHost id='sendbtc.firststep.sharetooltip'>
              <TooltipIcon name='question-in-circle' size='12px' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            component={TextAreaDebounced}
            placeholder="What's this transaction for? (optional)"
            rows={3}
            data-e2e='sendBtcDescription'
          />
        </FormItem>
      </FormGroup>
      <FeeFormGroup inline margin={'10px'}>
        <ColLeft>
          <FeeFormContainer toggled={feePerByteToggled}>
            <FeeFormLabel>
              <FormattedMessage
                id='modals.sendbtc.firststep.networkfee'
                defaultMessage='Network Fee'
              />
              <span>&nbsp;</span>
              {!feePerByteToggled && (
                <Field
                  name='feePerByte'
                  component={SelectBox}
                  elements={feePerByteElements}
                />
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
              <FeePerByteContainer>
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
          <ComboDisplay size='13px' coin='BTC'>
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
              <FormattedMessage
                id='modals.sendbtc.firststep.cancel'
                defaultMessage='Cancel'
              />
            ) : (
              <FormattedMessage
                id='modals.sendbtc.firststep.customizefee'
                defaultMessage='Customize Fee'
              />
            )}
          </Link>
        </ColRight>
      </FeeFormGroup>
      {feePerByteToggled ? (
        <CustomFeeAlertBanner type='alert'>
          <Text size='12px'>
            <FormattedMessage
              id='modals.sendbtc.firststep.customfeeinfo'
              defaultMessage='This feature is recommended for advanced users only. By choosing a custom fee, you risk overpaying or your transaction never being confirmed.'
            />
          </Text>
        </CustomFeeAlertBanner>
      ) : null}
      <FormGroup margin={'15px'}>
        {feePerByte > regularFeePerByte ? (
          <Text size='13px' weight={400} data-e2e='btcSendEstTimeMinutes'>
            <FormattedMessage
              id='modals.sendbtc.firststep.estimated2'
              defaultMessage='Estimated confirmation time 0-60 minutes'
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
      <SubmitFormGroup>
        <Button
          type='submit'
          nature='primary'
          height='56px'
          size='18px'
          data-e2e='sendBtcContinue'
          disabled={submitting || invalid || pristine || disableLockboxSend}
        >
          <FormattedMessage
            id='modals.sendbtc.firststep.continue'
            defaultMessage='Continue'
          />
        </Button>
      </SubmitFormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  feePerByteToggled: PropTypes.bool.isRequired,
  feePerByteElements: PropTypes.array.isRequired,
  regularFeePerByte: PropTypes.number.isRequired,
  priorityFeePerByte: PropTypes.number.isRequired,
  handleFeePerByteToggle: PropTypes.func.isRequired,
  handleToToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  totalFee: PropTypes.string
}

export default reduxForm({
  form: model.components.sendBtc.FORM,
  destroyOnUnmount: false,
  shouldError,
  shouldWarn
})(FirstStep)
