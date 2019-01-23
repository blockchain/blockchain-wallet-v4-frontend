import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import * as bowser from 'bowser'
import styled from 'styled-components'

import { model } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { required, validEtherAddress } from 'services/FormHelper'
import {
  Banner,
  Button,
  Text,
  Icon,
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
  SelectBoxEthAddresses,
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
  CustomFeeAlertBanner,
  FeeFormContainer,
  FeeFormGroup,
  FeeFormLabel,
  AddressButton,
  FeeOptionsContainer,
  FeePerByteContainer
} from 'components/Send'
import QRCodeCapture from 'components/QRCodeCapture'
import ComboDisplay from 'components/Display/ComboDisplay'
import RegularFeeLink from './RegularFeeLink'
import PriorityFeeLink from './PriorityFeeLink'
import { removeWhitespace } from 'services/FormHelper/normalizers'

const WarningBanners = styled(Banner)`
  margin: -6px 0 12px;
  padding: 8px;
`
const FirstStep = props => {
  const {
    pristine,
    invalid,
    submitting,
    fee,
    handleSubmit,
    unconfirmedTx,
    destination,
    isContract,
    toToggled,
    feeToggled,
    enableToggle,
    handleToToggle,
    from,
    feeElements,
    regularFee,
    priorityFee,
    handleFeeToggle,
    balanceStatus,
    excludeLockbox
  } = props
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const disableLockboxSend =
    isFromLockbox && !(bowser.name === 'Chrome' || bowser.name === 'Chromium')

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
              id='modals.sendEther.firststep.from'
              defaultMessage='From:'
            />
          </FormLabel>
          <Field
            name='from'
            component={SelectBoxEthAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
          />
        </FormItem>
      </FormGroup>
      {isFromLockbox && (
        <WarningBanners type='info'>
          <Text color='warning' size='13px'>
            <FormattedMessage
              id='modals.sendeth.firststep.warndevice'
              defaultMessage='You will need to connect your Lockbox to complete to this transaction.'
            />
          </Text>
        </WarningBanners>
      )}
      {disableLockboxSend && (
        <WarningBanners type='warning'>
          <Text color='warning' size='12px'>
            <FormattedMessage
              id='modals.sendeth.firststep.warnbrowswer'
              defaultMessage='Sending Ether from Lockbox can only be done while using the Chrome browser!'
            />
          </Text>
        </WarningBanners>
      )}
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendeth.firststep.to'
              defaultMessage='To:'
            />
          </FormLabel>
          <Row>
            {toToggled && (
              <Field
                name='to'
                component={SelectBoxEthAddresses}
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
                validate={[required, validEtherAddress]}
                autoFocus
              />
            )}
            <QRCodeCapture
              scanType='ethAddress'
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
              id='modals.sendeth.firststep.amount'
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
            data-e2e='sendEth'
          />
        </FormItem>
      </FormGroup>
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='description'>
            <FormattedMessage
              id='modals.sendeth.firststep.description'
              defaultMessage='Description: '
            />
            <TooltipHost id='sendeth.firststep.sharetooltip'>
              <TooltipIcon name='question-in-circle' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            component={TextAreaDebounced}
            placeholder="What's this transaction for? (optional)?"
            data-e2e='sendEthDescription'
            fullwidth
          />
        </FormItem>
      </FormGroup>
      <FeeFormGroup inline margin={'10px'}>
        <ColLeft>
          <FeeFormContainer toggled={feeToggled}>
            <FeeFormLabel>
              <FormattedMessage
                id='modals.sendeth.firststep.fee'
                defaultMessage='Transaction Fee:'
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
                id='modals.sendeth.firststep.cancel'
                defaultMessage='Cancel'
              />
            ) : (
              <FormattedMessage
                id='modals.sendeth.firststep.edit'
                defaultMessage='Customize fee'
              />
            )}
          </Link>
        </ColRight>
      </FeeFormGroup>
      {feeToggled ? (
        <CustomFeeAlertBanner type='alert'>
          <Text size='12px'>
            <FormattedMessage
              id='modals.sendeth.firststep.customfeeinfo'
              defaultMessage='This feature is recommended for advanced users only. By choosing a custom fee, you risk overpaying or your transaction never being confirmed.'
            />
          </Text>
        </CustomFeeAlertBanner>
      ) : null}
      <FormGroup>
        <Button
          type='submit'
          nature='primary'
          disabled={
            pristine ||
            submitting ||
            invalid ||
            isContract ||
            Remote.Loading.is(balanceStatus)
          }
        >
          <FormattedMessage
            id='modals.sendeth.firststep.continue'
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

export default reduxForm({
  form: model.components.sendEth.FORM,
  shouldError,
  shouldWarn,
  destroyOnUnmount: false
})(FirstStep)
