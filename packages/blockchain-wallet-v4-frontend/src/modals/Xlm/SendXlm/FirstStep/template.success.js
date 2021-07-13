import React from 'react'
import { FormattedMessage } from 'react-intl'
import Bowser from 'bowser'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Banner, Button, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import ComboDisplay from 'components/Display/ComboDisplay'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxCoin,
  SelectBoxXlmAddresses,
  TextAreaDebounced,
  TextBox
} from 'components/Form'
import QRCodeCapture from 'components/QRCode/Capture'
import { CustodyToAccountMessage, Row } from 'components/Send'
import MnemonicRequiredForCustodySend from 'components/Send/RecoveryPhrase'
import UnstoppableDomains from 'components/UnstoppableDomains'
import { model } from 'data'
import { required, validXlmAddress } from 'services/forms'

import { ErrorBanner } from './ErrorBanner'
import { InfoBanner } from './InfoBanner'
import { NoAccountTemplate } from './NoAccountTemplate'
import { SelectBoxMemo } from './SelectBoxMemo'
import {
  accountCreationAmount,
  balanceReserveAmount,
  insufficientFunds,
  invalidAmount,
  shouldError,
  shouldWarn,
  validateMemo,
  validateMemoType
} from './validation'
import { XlmFiatConverter } from './XlmFiatConverter'

const SubmitFormGroup = styled(FormGroup)`
  margin-top: 16px;
`
const WarningBanners = styled(Banner)`
  margin: 8px 0;
  padding: 8px;
`
const MemoField = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  & > :first-child {
    flex: 2;
    input {
      border-right: none;
    }
  }
  & > :last-child {
    flex: 1;
    label {
      width: 300%;
    }
  }
`

const FirstStep = (props) => {
  const {
    activeField,
    amount,
    balanceStatus,
    error,
    excludeLockbox,
    fee,
    from,
    handleSubmit,
    invalid,
    isDestinationChecked,
    isDestinationExchange,
    isMnemonicVerified,
    noAccount,
    pristine,
    submit,
    submitting,
    swapActions
  } = props
  const amountActive = activeField === 'amount'
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const isFromCustody = from && from.type === 'CUSTODIAL'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const isBrowserSupported = browser.satisfies(model.components.lockbox.supportedBrowsers)
  const disableLockboxSend = isFromLockbox && !isBrowserSupported
  const disableCustodySend = isFromCustody && !isMnemonicVerified

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin='15px' style={{ zIndex: 3 }}>
        <FormItem width='40%'>
          <FormLabel htmlFor='coin'>
            <FormattedMessage id='modals.sendxlm.firststep.currency' defaultMessage='Currency' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} type='send' validate={[required]} />
        </FormItem>
        <FormItem width='60%'>
          <FormLabel htmlFor='from'>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </FormLabel>
          <Field
            name='from'
            component={SelectBoxXlmAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
            includeCustodial
          />
        </FormItem>
      </FormGroup>
      {noAccount && <NoAccountTemplate swapActions={swapActions} />}
      {!noAccount && (
        <>
          {isFromLockbox && !disableLockboxSend && (
            <WarningBanners type='info'>
              <Text color='warning' size='13px'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.lockboxwarn'
                  defaultMessage='You will need to connect your Lockbox to complete this transaction.'
                />
              </Text>
            </WarningBanners>
          )}
          {disableLockboxSend && (
            <WarningBanners type='warning'>
              <Text color='warning' size='12px'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.blockbrowser'
                  defaultMessage='Sending Stellar from Lockbox can only be done while using the Brave, Chrome, Firefox or Opera browsers.'
                />
              </Text>
            </WarningBanners>
          )}
          <FormGroup margin={isFromCustody ? '15px' : '8px'}>
            <FormItem>
              <FormLabel htmlFor='to'>
                <FormattedMessage id='modals.sendxlm.firststep.sendto' defaultMessage='To' />
              </FormLabel>
              <Row>
                <Field
                  component={SelectBoxXlmAddresses}
                  dataE2e='sendXlmAddressInput'
                  exclude={from ? [from.label] : []}
                  includeAll={false}
                  includeExchangeAddress
                  isCreatable
                  isValidNewOption={() => false}
                  name='to'
                  noOptionsMessage={() => null}
                  includeCustodial={!isFromCustody}
                  forceCustodialFirst
                  placeholder='Paste, scan, or select destination'
                  validate={[required, validXlmAddress]}
                />
                {!isFromCustody && (
                  <QRCodeCapture
                    scanType='xlmAddress'
                    border={['top', 'bottom', 'right', 'left']}
                  />
                )}
              </Row>
            </FormItem>
          </FormGroup>
          <UnstoppableDomains form={model.components.sendXlm.FORM} />
          <FormGroup>
            <CustodyToAccountMessage coin='XLM' account={from} amount={amount} />
          </FormGroup>
          <FormGroup margin='15px'>
            <FormItem>
              <FormLabel htmlFor='amount'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.sendamountto'
                  defaultMessage='Amount'
                />
              </FormLabel>
              <Field
                name='amount'
                component={XlmFiatConverter}
                error={error}
                coin='XLM'
                validate={[required, invalidAmount, insufficientFunds]}
                data-e2e='sendXlm'
                marginTop='8px'
              />
            </FormItem>
          </FormGroup>
          {amountActive && !error && !isFromCustody && <InfoBanner {...props} />}
          {error && !isFromCustody && <ErrorBanner error={error} />}
          {!isFromCustody && (
            <FormGroup margin='15px'>
              <FormItem>
                <FormLabel htmlFor='memo'>
                  <FormattedMessage id='modals.sendxlm.firststep.txmemo' defaultMessage='Memo' />
                  <TooltipHost id='sendxlm.firststep.memotooltip'>
                    <TooltipIcon name='info' size='12px' />
                  </TooltipHost>
                </FormLabel>
                <MemoField>
                  <Field
                    name='memo'
                    errorBottom
                    validate={validateMemo}
                    component={TextBox}
                    placeholder='Enter text or ID for recipient (optional)'
                    data-e2e='sendXlmMemoText'
                    noLastPass
                  />
                  <Field
                    name='memoType'
                    errorBottom
                    validate={validateMemoType}
                    component={SelectBoxMemo}
                    data-e2e='sendXlmMemoType'
                  />
                </MemoField>
              </FormItem>
              {isDestinationExchange && (
                <WarningBanners type='warning' data-e2e='sendXlmToExchangeAddress'>
                  <Text color='warning' size='12px'>
                    <FormattedMessage
                      id='modals.sendxlm.firststep.sendtoexchange2'
                      defaultMessage='Sending XLM to an exchange often requires adding a memo. Failing to include a required memo may result in a loss of funds!'
                    />
                    <Link
                      href='https://support.blockchain.com/hc/en-us/articles/360018797312-Stellar-memos'
                      target='_blank'
                      size='11px'
                      weight={700}
                      altFont
                      color='red600'
                    >
                      <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
                    </Link>
                  </Text>
                </WarningBanners>
              )}
            </FormGroup>
          )}

          <FormGroup margin='15px'>
            <FormItem>
              <FormLabel htmlFor='description'>
                <FormattedMessage id='modals.sendxlm.firststep.desc' defaultMessage='Description' />
                <TooltipHost id='sendxlm.firststep.sharetooltip'>
                  <TooltipIcon name='info' size='12px' />
                </TooltipHost>
              </FormLabel>
              <Field
                name='description'
                disabled={isFromCustody}
                component={TextAreaDebounced}
                placeholder="What's this transaction for? (optional)"
                data-e2e='sendXlmDescription'
                fullwidth
                maxLength={100}
              />
            </FormItem>
          </FormGroup>
          <FormGroup inline margin='10px'>
            <FormItem>
              <Text size='16px' weight={500}>
                <FormattedMessage
                  id='modals.sendxlm.firststep.fee'
                  defaultMessage='Transaction Fee:'
                />
              </Text>
              <Text>
                <ComboDisplay size='13px' coin='XLM' weight={500}>
                  {fee}
                </ComboDisplay>
              </Text>
            </FormItem>
          </FormGroup>
          {isFromCustody && !isMnemonicVerified ? <MnemonicRequiredForCustodySend /> : null}
          <SubmitFormGroup>
            <Button
              /*
               * HACK: redux-form blurs on mousedown, and we change form
               * layout on blur preventing the onClick submit
               */
              height='56px'
              size='18px'
              onMouseDown={submit}
              nature='primary'
              disabled={
                pristine ||
                submitting ||
                invalid ||
                disableLockboxSend ||
                disableCustodySend ||
                !isDestinationChecked ||
                Remote.Loading.is(balanceStatus)
              }
              data-e2e='xlmSendContinue'
            >
              <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
            </Button>
          </SubmitFormGroup>
        </>
      )}
    </Form>
  )
}

FirstStep.propTypes = {
  effectiveBalance: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleToToggle: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  toToggled: PropTypes.bool.isRequired
}

const validate = (values, props) => {
  try {
    const errors = {}
    accountCreationAmount(errors, values, props)
    balanceReserveAmount(errors, values, props)
    return errors
  } catch (e) {
    // catching BigNumber constructor errors
  }
}

export default reduxForm({
  destroyOnUnmount: false,
  form: model.components.sendXlm.FORM,
  shouldError,
  shouldWarn,
  validate
})(FirstStep)
