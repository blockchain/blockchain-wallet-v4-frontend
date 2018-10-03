import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import {
  required,
  validBitcoinAddress,
  validBitcoinPrivateKey
} from 'services/FormHelper'
import {
  Button,
  Icon,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  FiatConvertor,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  NumberBoxDebounced,
  SelectBoxBitcoinAddresses,
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
  AddressButton,
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

const FirstStep = props => {
  const { invalid, submitting, pristine, ...rest } = props
  const {
    from,
    watchOnly,
    destination,
    toToggled,
    enableToggle,
    feePerByteToggled,
    feePerByteElements,
    regularFeePerByte,
    priorityFeePerByte,
    isPriorityFeePerByte,
    totalFee,
    ...rest2
  } = rest
  const { handleFeePerByteToggle, handleToToggle, handleSubmit } = rest2

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendbtc.firststep.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
        <FormItem width={'60%'}>
          <FormLabel for='from'>
            <FormattedMessage
              id='modals.sendbtc.firststep.from'
              defaultMessage='From:'
            />
          </FormLabel>
          <Field
            name='from'
            component={SelectBoxBitcoinAddresses}
            validate={[required]}
            includeAll={false}
          />
          {watchOnly && (
            <Row>
              <Field
                name='priv'
                placeholder='Please enter your private key...'
                component={TextBox}
                validate={[
                  required,
                  validBitcoinPrivateKey,
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
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendbtc.firststep.to'
              defaultMessage='To:'
            />
          </FormLabel>
          <Row>
            {toToggled && (
              <Field
                name='to'
                component={SelectBoxBitcoinAddresses}
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
                validate={[required, validBitcoinAddress]}
                autoFocus
              />
            )}
            <QRCodeCapture
              scanType='btcAddress'
              border={
                enableToggle ? ['top', 'bottom'] : ['top', 'bottom', 'right']
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
              id='modals.sendbtc.firststep.amount'
              defaultMessage='Enter Amount:'
            />
          </FormLabel>
          <Field
            name='amount'
            component={FiatConvertor}
            validate={[
              required,
              invalidAmount,
              insufficientFunds,
              minimumAmount,
              maximumAmount
            ]}
            coin='BTC'
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel>
            <FormattedMessage
              id='modals.sendbtc.firststep.description'
              defaultMessage='Description: '
            />
            <TooltipHost id='sendbtc.firststep.sharetooltip'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            component={TextAreaDebounced}
            placeholder="What's this transaction for?"
            rows={3}
          />
        </FormItem>
      </FormGroup>
      <FeeFormGroup inline margin={'10px'}>
        <ColLeft>
          <FeeFormContainer toggled={feePerByteToggled}>
            <FeeFormLabel>
              <FormattedMessage
                id='modals.sendbtc.firststep.fee'
                defaultMessage='Transaction fee:'
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
                />
              </FeePerByteContainer>
            )}
          </FeeFormContainer>
        </ColLeft>
        <ColRight>
          <ComboDisplay size='14px' coin='BTC'>
            {totalFee}
          </ComboDisplay>
          <Link
            size='13px'
            weight={300}
            capitalize
            onClick={handleFeePerByteToggle}
          >
            {feePerByteToggled ? (
              <FormattedMessage
                id='modals.sendbtc.firststep.cancel'
                defaultMessage='Cancel'
              />
            ) : (
              <FormattedMessage
                id='modals.sendbtc.firststep.edit'
                defaultMessage='Customize fee'
              />
            )}
          </Link>
        </ColRight>
      </FeeFormGroup>
      <FormGroup margin={'15px'}>
        <Text size='13px' weight={300}>
          {!isPriorityFeePerByte && (
            <FormattedMessage
              id='modals.sendbtc.firststep.estimated'
              defaultMessage='Estimated confirmation time 1+ hour'
            />
          )}
          {isPriorityFeePerByte && (
            <FormattedMessage
              id='modals.sendbtc.firststep.estimated2'
              defaultMessage='Estimated confirmation time 0-60 minutes'
            />
          )}
        </Text>
      </FormGroup>
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          disabled={submitting || invalid || pristine}
        >
          <FormattedMessage
            id='modals.sendbtc.firststep.continue'
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
  toToggled: PropTypes.bool.isRequired,
  feePerByteToggled: PropTypes.bool.isRequired,
  feePerByteElements: PropTypes.array.isRequired,
  regularFeePerByte: PropTypes.number.isRequired,
  priorityFeePerByte: PropTypes.number.isRequired,
  isPriorityFeePerByte: PropTypes.bool.isRequired,
  handleFeePerByteToggle: PropTypes.func.isRequired,
  handleToToggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  totalFee: PropTypes.string
}

export default reduxForm({
  form: 'sendBtc',
  destroyOnUnmount: false,
  shouldError,
  shouldWarn
})(FirstStep)
