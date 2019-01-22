import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as bowser from 'bowser'
import styled from 'styled-components'

import { model } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { required, validXlmAddress } from 'services/FormHelper'
import {
  Banner,
  Button,
  Text,
  Icon,
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
import { Row, AddressButton } from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'
import ComboDisplay from 'components/Display/ComboDisplay'
import { NoAccountTemplate } from './NoAccountTemplate'
import { ErrorBanner } from './ErrorBanner'
import { XlmFiatConvertor } from './XlmFiatConvertor'
import { InfoBanner } from './InfoBanner'
import { SelectBoxMemo } from './SelectBoxMemo'
import { removeWhitespace } from 'services/FormHelper/normalizers'

const WarningBanners = styled(Banner)`
  margin: -6px 0 12px;
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
    pristine,
    invalid,
    submitting,
    fee,
    destination,
    toToggled,
    enableToggle,
    noAccount,
    from,
    balanceStatus,
    handleToToggle,
    error,
    handleSubmit,
    submit,
    excludeLockbox
  } = props
  const amountActive = activeField === 'amount'
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const disableLockboxSend =
    isFromLockbox && !(bowser.name === 'Chrome' || bowser.name === 'Chromium')

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendxlm.firststep.coin'
              defaultMessage='Currency:'
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
              id='modals.sendxlm.firststep.from'
              defaultMessage='From:'
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
          {isFromLockbox && (
            <WarningBanners type='info'>
              <Text color='warning' size='13px'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.warndevice'
                  defaultMessage='You will need to connect your Lockbox to complete to this transaction.'
                />
              </Text>
            </WarningBanners>
          )}
          {disableLockboxSend && (
            <WarningBanners type='warning'>
              <Text color='warning' size='12px'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.warnbrowswer'
                  defaultMessage='Sending Stellar from Lockbox can only be done while using the Chrome browser!'
                />
              </Text>
            </WarningBanners>
          )}
          <FormGroup margin={'15px'}>
            <FormItem>
              <FormLabel for='to'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.to'
                  defaultMessage='To:'
                />
              </FormLabel>
              <Row>
                {toToggled && (
                  <Field
                    name='to'
                    component={SelectBoxXlmAddresses}
                    menuIsOpen={!destination}
                    exclude={[from.label]}
                    validate={[required]}
                    includeAll={false}
                    hideIndicator
                    hideErrors
                  />
                )}
                {!toToggled && (
                  <Field
                    name='to'
                    placeholder='Paste or scan an address, or select a destination'
                    component={TextBox}
                    normalize={removeWhitespace}
                    validate={[required, validXlmAddress]}
                    autoFocus
                    data-e2e='sendXlmToAddress'
                  />
                )}
                <QRCodeCapture
                  scanType='xlmAddress'
                  border={
                    enableToggle
                      ? ['top', 'bottom']
                      : ['top', 'bottom', 'right']
                  }
                />
                {enableToggle ? (
                  !toToggled ? (
                    <AddressButton onClick={() => handleToToggle()}>
                      <Icon name='down-arrow' size='11px' cursor />
                    </AddressButton>
                  ) : (
                    <AddressButton onClick={() => handleToToggle()}>
                      <Icon name='pencil' size='13px' cursor />
                    </AddressButton>
                  )
                ) : null}
              </Row>
            </FormItem>
          </FormGroup>
          <FormGroup margin={'15px'}>
            <FormItem>
              <FormLabel for='amount'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.amount'
                  defaultMessage='Enter amount:'
                />
              </FormLabel>
              <Field
                name='amount'
                component={XlmFiatConvertor}
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
              <FormLabel for='description'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.description'
                  defaultMessage='Description: '
                />
                <TooltipHost id='sendxlm.firststep.sharetooltip'>
                  <TooltipIcon name='question-in-circle' />
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
          <FormGroup margin={'15px'}>
            <FormItem>
              <FormLabel for='memo'>
                <FormattedMessage
                  id='modals.sendxlm.firststep.memo'
                  defaultMessage='Memo: '
                />
                <TooltipHost id='sendxlm.firststep.memotooltip'>
                  <TooltipIcon name='question-in-circle' />
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
          </FormGroup>
          <FormGroup inline margin={'10px'}>
            <FormItem>
              <Text size='16px' weight={500}>
                <FormattedMessage
                  id='modals.sendxlm.firststep.fee'
                  defaultMessage='Transaction Fee:'
                />
              </Text>
              <Text size='16px' weight={300}>
                <ComboDisplay coin='XLM'>{fee}</ComboDisplay>
              </Text>
            </FormItem>
          </FormGroup>
          <FormGroup>
            <Button
              /*
               * HACK: redux-form blurs on mousedown, and we change form
               * layout on blur preventing the onClick submit
               */
              onMouseDown={submit}
              nature='primary'
              disabled={
                pristine ||
                submitting ||
                invalid ||
                disableLockboxSend ||
                Remote.Loading.is(balanceStatus)
              }
            >
              <FormattedMessage
                id='modals.sendxlm.firststep.continue'
                defaultMessage='Continue'
              />
            </Button>
          </FormGroup>
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
