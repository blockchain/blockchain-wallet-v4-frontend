import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import Bowser from 'bowser'
import styled from 'styled-components'

import { model } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { required, validXlmAddress } from 'services/FormHelper'
import {
  Banner,
  Button,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxCoin,
  SelectBoxXlmAddresses,
  TextBox,
  TextAreaDebounced
} from 'components/Form'
import {
  accountCreationAmount,
  balanceReserveAmount,
  invalidAmount,
  insufficientFunds,
  shouldError,
  shouldWarn,
  validateMemo,
  validateMemoType
} from './validation'
import { Row } from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'
import ComboDisplay from 'components/Display/ComboDisplay'
import { NoAccountTemplate } from './NoAccountTemplate'
import { ErrorBanner } from './ErrorBanner'
import { XlmFiatConverter } from './XlmFiatConverter'
import { InfoBanner } from './InfoBanner'
import { SelectBoxMemo } from './SelectBoxMemo'

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
    div {
      display: none;
    }
  }
  & > :last-child {
    flex: 1;
    label {
      width: 300%;
    }
  }
`

const FirstStep = props => {
  const {
    activeField,
    balanceStatus,
    error,
    excludeLockbox,
    fee,
    from,
    handleSubmit,
    invalid,
    isDestinationChecked,
    isDestinationExchange,
    noAccount,
    pristine,
    submit,
    submitting
  } = props
  const amountActive = activeField === 'amount'
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
              id='modals.sendxlm.firststep.currency'
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
              id='modals.sendxlm.firststep.fromwallet'
              defaultMessage='From'
            />
          </FormLabel>
          <Field
            name='from'
            component={SelectBoxXlmAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
          />
        </FormItem>
      </FormGroup>
      {noAccount && <NoAccountTemplate />}
      {!noAccount && (
        <React.Fragment>
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
          <FormGroup margin={'15px'}>
            <FormItem>
              <FormLabel for='to'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.sendto'
                  defaultMessage='To'
                />
              </FormLabel>
              <Row>
                <Field
                  name='to'
                  placeholder='Paste, scan, or select destination'
                  component={SelectBoxXlmAddresses}
                  dataE2e='sendXlmAddressInput'
                  validate={[required, validXlmAddress]}
                  exclude={[from.label]}
                  openMenuOnClick={false}
                  includeAll={false}
                  isCreatable
                  noOptionsMessage={() => null}
                  isValidNewOption={() => false}
                />
                <QRCodeCapture
                  scanType='xlmAddress'
                  border={['top', 'bottom', 'right']}
                />
              </Row>
            </FormItem>
          </FormGroup>
          <FormGroup margin={'15px'}>
            <FormItem>
              <FormLabel for='amount'>
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
              />
            </FormItem>
          </FormGroup>
          {amountActive && !error && <InfoBanner {...props} />}
          {error && <ErrorBanner error={error} />}
          <FormGroup margin={'15px'}>
            <FormItem>
              <FormLabel for='memo'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.txmemo'
                  defaultMessage='Memo'
                />
                <TooltipHost id='sendxlm.firststep.memotooltip'>
                  <TooltipIcon name='question-in-circle' size='12px' />
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
              <WarningBanners
                type='warning'
                data-e2e='sendXlmToExchangeAddress'
              >
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
                    color='red'
                  >
                    <FormattedMessage
                      id='modals.sendxlm.firststep.sendtoexchangelearn'
                      defaultMessage='Learn More'
                    />
                  </Link>
                </Text>
              </WarningBanners>
            )}
          </FormGroup>

          <FormGroup margin={'15px'}>
            <FormItem>
              <FormLabel for='description'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.desc'
                  defaultMessage='Description'
                />
                <TooltipHost id='sendxlm.firststep.sharetooltip'>
                  <TooltipIcon name='question-in-circle' size='12px' />
                </TooltipHost>
              </FormLabel>
              <Field
                name='description'
                component={TextAreaDebounced}
                placeholder="What's this transaction for? (optional)"
                fullwidth
                data-e2e='sendXlmDescription'
              />
            </FormItem>
          </FormGroup>
          <FormGroup inline margin={'10px'}>
            <FormItem>
              <Text size='16px' weight={500}>
                <FormattedMessage
                  id='modals.sendxlm.firststep.fee'
                  defaultMessage='Transaction Fee:'
                />
              </Text>
              <Text>
                <ComboDisplay size='13px' coin='XLM'>
                  {fee}
                </ComboDisplay>
              </Text>
            </FormItem>
          </FormGroup>
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
                !isDestinationChecked ||
                Remote.Loading.is(balanceStatus)
              }
              data-e2e='xlmSendContinue'
            >
              <FormattedMessage
                id='modals.sendxlm.firststep.continue'
                defaultMessage='Continue'
              />
            </Button>
          </SubmitFormGroup>
        </React.Fragment>
      )}
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  fee: PropTypes.string.isRequired,
  effectiveBalance: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  toToggled: PropTypes.bool.isRequired,
  handleToToggle: PropTypes.func.isRequired
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
  form: model.components.sendXlm.FORM,
  shouldError,
  shouldWarn,
  validate,
  destroyOnUnmount: false
})(FirstStep)
