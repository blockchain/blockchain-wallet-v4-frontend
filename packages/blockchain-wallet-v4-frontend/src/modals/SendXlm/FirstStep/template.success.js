import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as bowser from 'bowser'
import styled from 'styled-components'
import { path } from 'ramda'

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
  FiatConvertor,
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
  ACCOUNT_CREATION_ERROR,
  accountCreationAmount,
  invalidAmount,
  insufficientFunds,
  maximumAmount,
  shouldError,
  shouldWarn
} from './validation'
import { ShouldCreateAccountMessage } from './validationMessages'
import { Row, AddressButton } from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'
import ComboDisplay from 'components/Display/ComboDisplay'

const BrowserWarning = styled(Banner)`
  margin: -4px 0 8px;
`

const XlmFiatConvertor = ({ meta, ...rest }) => {
  if (path(['error', 'message'], meta) === ACCOUNT_CREATION_ERROR) {
    meta.error = <ShouldCreateAccountMessage amount={meta.error.amount} />
  }
  return <FiatConvertor meta={meta} {...rest} />
}

const FirstStep = props => {
  const {
    pristine,
    invalid,
    submitting,
    fee,
    unconfirmedTx,
    destination,
    isContract,
    toToggled,
    enableToggle,
    from,
    balanceStatus,
    handleToToggle,
    handleSubmit
  } = props
  const disableLockboxSend =
    from &&
    from.type === 'LOCKBOX' &&
    !(bowser.name === 'Chrome' || bowser.name === 'Chromium')

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
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
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
          />
        </FormItem>
      </FormGroup>
      {disableLockboxSend && (
        <BrowserWarning type='warning'>
          <Text color='warning' size='12px'>
            <FormattedMessage
              id='modals.sendxlm.firststep.lockboxwarn'
              defaultMessage='Sending Stellar from Lockbox can only be done while using the Chrome browser'
            />
          </Text>
        </BrowserWarning>
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
                validate={[required, validXlmAddress]}
                autoFocus
              />
            )}
            <QRCodeCapture
              scanType='xlmAddress'
              border={
                enableToggle ? ['top', 'bottom'] : ['top', 'bottom', 'right']
              }
            />
            {enableToggle ? (
              !toToggled ? (
                <AddressButton onClick={handleToToggle}>
                  <Icon name='down-arrow' size='11px' cursor />
                </AddressButton>
              ) : (
                <AddressButton onClick={handleToToggle}>
                  <Icon name='pencil' size='13px' cursor />
                </AddressButton>
              )
            ) : null}
          </Row>
          {unconfirmedTx && (
            <Text color='error' size='12px' weight={300}>
              <FormattedMessage
                id='modals.sendxlm.unconfirmedtransactionmessage'
                defaultMessage='Please wait until your previous transaction confirms.'
              />
            </Text>
          )}
          {isContract && (
            <Text color='error' size='12px' weight={300}>
              <FormattedMessage
                id='modals.sendxlm.contractaddr'
                defaultMessage='Sending to contract addresses is disabled.'
              />
            </Text>
          )}
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
            disabled={unconfirmedTx}
            component={XlmFiatConvertor}
            coin='XLM'
            validate={[
              required,
              invalidAmount,
              insufficientFunds,
              maximumAmount
            ]}
          />
        </FormItem>
      </FormGroup>
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
            placeholder="What's this transaction for?"
            fullwidth
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
          <Text size='16px' weight={300}>
            <ComboDisplay coin='XLM'>{fee}</ComboDisplay>
          </Text>
        </FormItem>
      </FormGroup>
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          uppercase
          disabled={
            pristine ||
            submitting ||
            invalid ||
            isContract ||
            Remote.Loading.is(balanceStatus)
          }
        >
          <FormattedMessage
            id='modals.sendxlm.firststep.continue'
            defaultMessage='Continue'
          />
        </Button>
      </FormGroup>
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
  handleToToggle: PropTypes.func.isRequired,
  unconfirmedTx: PropTypes.bool
}

const validate = (values, props) => {
  const errors = {}
  accountCreationAmount(errors, values, props)

  return errors
}

export default reduxForm({
  form: model.components.sendXlm.FORM,
  shouldError,
  shouldWarn,
  validate,
  destroyOnUnmount: false
})(FirstStep)
