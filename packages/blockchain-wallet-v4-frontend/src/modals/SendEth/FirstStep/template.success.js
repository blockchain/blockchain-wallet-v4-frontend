import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { Remote } from 'blockchain-wallet-v4/src'
import { required, validEtherAddress } from 'services/FormHelper'
import {
  Button,
  Text,
  TooltipHost,
  TooltipIcon,
  Link
} from 'blockchain-info-components'
import {
  FiatConvertor,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  NumberBoxDebounced,
  SelectBox,
  SelectBoxCoin,
  TextBox,
  TextAreaDebounced
} from 'components/Form'
import {
  invalidAmount,
  insufficientFunds,
  maximumAmount,
  shouldError,
  shouldWarn,
  minimumFee,
  maximumFee
} from './validation'
import {
  Row,
  ColLeft,
  ColRight,
  FeeFormContainer,
  FeeFormGroup,
  FeeFormLabel,
  FeeOptionsContainer,
  FeePerByteContainer
} from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'
import ComboDisplay from 'components/Display/ComboDisplay'
import RegularFeeLink from './RegularFeeLink'
import PriorityFeeLink from './PriorityFeeLink'

const FirstStep = props => {
  const {
    pristine,
    invalid,
    submitting,
    fee,
    handleSubmit,
    unconfirmedTx,
    isContract,
    feeToggled,
    feeElements,
    regularFee,
    priorityFee,
    handleFeeToggle,
    balanceStatus
  } = props

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendether.firststep.coin'
              defaultMessage='Currency:'
            />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} validate={[required]} />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendether.firststep.to'
              defaultMessage='To:'
            />
          </FormLabel>
          <Row>
            <Field
              disabled={unconfirmedTx}
              name='to'
              placeholder='Paste or scan an address'
              component={TextBox}
              validate={[required, validEtherAddress]}
            />
            {!unconfirmedTx && (
              <QRCodeCapture
                scanType='ethAddress'
                border={['top', 'bottom', 'right']}
              />
            )}
          </Row>
          {unconfirmedTx && (
            <Text color='error' size='12px' weight={300}>
              <FormattedMessage
                id='modals.sendeth.unconfirmedtransactionmessage'
                defaultMessage='Please wait until your previous transaction confirms.'
              />
            </Text>
          )}
          {isContract && (
            <Text color='error' size='12px' weight={300}>
              <FormattedMessage
                id='modals.sendeth.contractaddr'
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
              id='modals.sendether.firststep.amount'
              defaultMessage='Enter amount:'
            />
          </FormLabel>
          <Field
            name='amount'
            disabled={unconfirmedTx}
            component={FiatConvertor}
            coin='ETH'
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
              id='modals.sendether.firststep.description'
              defaultMessage='Description: '
            />
            <TooltipHost id='sendether.firststep.sharetooltip'>
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
      <FeeFormGroup inline margin={'10px'}>
        <ColLeft>
          <FeeFormContainer toggled={feeToggled}>
            <FeeFormLabel>
              <FormattedMessage
                id='modals.sendether.firststep.fee'
                defaultMessage='Transaction fee (Gas Price):'
              />
              <span>&nbsp;</span>
              {!feeToggled && (
                <Field
                  name='fee'
                  component={SelectBox}
                  elements={feeElements}
                />
              )}
              {feeToggled && (
                <FeeOptionsContainer>
                  <RegularFeeLink fee={regularFee} />
                  <span>&nbsp;</span>
                  <PriorityFeeLink fee={priorityFee} />
                </FeeOptionsContainer>
              )}
            </FeeFormLabel>
            {feeToggled && (
              <FeePerByteContainer>
                <Field
                  name='fee'
                  component={NumberBoxDebounced}
                  validate={[required, minimumFee]}
                  warn={[maximumFee]}
                  errorBottom
                  errorLeft
                  unit='Gwei'
                />
              </FeePerByteContainer>
            )}
          </FeeFormContainer>
        </ColLeft>
        <ColRight>
          <ComboDisplay size='14px' coin='ETH'>
            {fee}
          </ComboDisplay>
          <Link size='13px' weight={300} capitalize onClick={handleFeeToggle}>
            {feeToggled ? (
              <FormattedMessage
                id='modals.sendether.firststep.cancel'
                defaultMessage='Cancel'
              />
            ) : (
              <FormattedMessage
                id='modals.sendether.firststep.edit'
                defaultMessage='Customize fee'
              />
            )}
          </Link>
        </ColRight>
      </FeeFormGroup>
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
            id='modals.sendether.firststep.continue'
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
  unconfirmedTx: PropTypes.bool
}

export default reduxForm({
  form: 'sendEth',
  shouldError,
  shouldWarn,
  destroyOnUnmount: false
})(FirstStep)
