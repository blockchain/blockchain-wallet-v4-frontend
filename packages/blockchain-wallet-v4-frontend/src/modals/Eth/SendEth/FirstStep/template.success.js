import React from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import Bowser from 'bowser'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Banner, Button, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import ComboDisplay from 'components/Display/ComboDisplay'
import {
  FiatConverter,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  NumberBoxDebounced,
  SelectBox,
  SelectBoxCoin,
  SelectBoxEthAddresses,
  TextAreaDebounced
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
import { required, validEthAddress } from 'services/forms'

import LowBalanceWarning from './LowBalanceWarning'
import LowEthWarningForErc20 from './LowEthWarningForErc20'
import MinFeeForRetryInvalid from './MinFeeForRetryInvalid'
import PriorityFeeLink from './PriorityFeeLink'
import RegularFeeLink from './RegularFeeLink'
import {
  insufficientFunds,
  invalidAmount,
  maximumAmount,
  maximumFee,
  minimumFee,
  shouldError,
  shouldWarn
} from './validation'

const WarningBanners = styled(Banner)`
  margin: -6px 0 12px;
  padding: 8px;
`
const SubmitFormGroup = styled(FormGroup)`
  margin-top: 16px;
`
const StyledRow = styled(Row)`
  .bc__control input {
    max-width: 350px;
  }
`

const FirstStep = (props) => {
  const {
    amount,
    balanceStatus,
    coin,
    excludeLockbox,
    fee,
    feeElements,
    feeToggled,
    from,
    handleFeeToggle,
    handleSubmit,
    hasErc20Balance,
    invalid,
    isContractChecked,
    isMnemonicVerified,
    isRetryAttempt,
    isSufficientEthForErc20,
    minFeeRequiredForRetry,
    priorityFee,
    pristine,
    regularFee,
    submitting,
    unconfirmedTx
  } = props
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const isFromCustody = from && from.type === 'CUSTODIAL'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const isBrowserSupported = browser.satisfies(model.components.lockbox.supportedBrowsers)
  const disableLockboxSend = isFromLockbox && !isBrowserSupported
  const disableDueToLowEth = coin !== 'ETH' && !isSufficientEthForErc20 && !isFromCustody
  const disableRetryAttempt =
    isRetryAttempt && new BigNumber(fee).isLessThanOrEqualTo(minFeeRequiredForRetry)
  const disableCustodySend = isFromCustody && !isMnemonicVerified

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin='15px' style={{ zIndex: 3 }}>
        <FormItem width='40%'>
          <FormLabel HtmlFor='coin'>
            <FormattedMessage id='modals.sendether.firststep.currency' defaultMessage='Currency' />
          </FormLabel>
          <Field name='coin' component={SelectBoxCoin} type='send' validate={[required]} />
        </FormItem>
        <FormItem width='60%'>
          <FormLabel HtmlFor='from'>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </FormLabel>
          <Field
            name='from'
            component={SelectBoxEthAddresses}
            disabled={isRetryAttempt}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
            includeCustodial
            coin={coin}
          />
        </FormItem>
      </FormGroup>
      {isFromLockbox && !disableLockboxSend && (
        <WarningBanners type='info'>
          <Text color='warning' size='13px'>
            <FormattedMessage
              id='modals.sendeth.firststep.lockboxwarn'
              defaultMessage='You will need to connect your Lockbox to complete this transaction.'
            />
          </Text>
        </WarningBanners>
      )}
      {disableLockboxSend && (
        <WarningBanners type='warning'>
          <Text color='warning' size='12px'>
            <FormattedMessage
              id='modals.sendeth.firststep.browserwarn'
              defaultMessage='Sending Ether from Lockbox can only be done while using the Brave, Chrome, Firefox or Opera browsers.'
            />
          </Text>
        </WarningBanners>
      )}
      <FormGroup margin='8px'>
        <FormItem>
          <FormLabel HtmlFor='to'>
            <FormattedMessage id='modals.sendeth.firststep.tocoin' defaultMessage='To' />
          </FormLabel>
          <StyledRow>
            <Field
              coin={coin}
              component={SelectBoxEthAddresses}
              dataE2e='sendEthAddressInput'
              disabled={isRetryAttempt}
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
              validate={[required, validEthAddress]}
            />
            {isRetryAttempt ? null : (
              <QRCodeCapture scanType='ethAddress' border={['top', 'bottom', 'right', 'left']} />
            )}
          </StyledRow>
          {unconfirmedTx && !isRetryAttempt && (
            <Text color='error' size='12px' weight={400}>
              <FormattedMessage
                id='modals.sendeth.unconfirmedtransactionmessage'
                defaultMessage='Please wait until your previous transaction confirms.'
              />
            </Text>
          )}
        </FormItem>
      </FormGroup>
      <UnstoppableDomains form={model.components.sendEth.FORM} />
      <FormGroup>
        <CustodyToAccountMessage coin={coin} account={from} amount={amount} />
      </FormGroup>
      <FormGroup margin='15px'>
        <FormItem>
          <FormLabel HtmlFor='amount'>
            <FormattedMessage id='copy.amount' defaultMessage='Amount' />
          </FormLabel>
          <Field
            name='amount'
            disabled={unconfirmedTx}
            component={FiatConverter}
            coin={coin}
            validate={[required, invalidAmount, insufficientFunds, maximumAmount]}
            data-e2e={`${coin}Send`}
            marginTop='8px'
          />
        </FormItem>
      </FormGroup>
      {hasErc20Balance && coin === 'ETH' && !isFromCustody && (
        <LowBalanceWarning
          effectiveBalance={props.effectiveBalance}
          totalBalance={props.from.balance}
        />
      )}
      <FormGroup margin='15px'>
        <FormItem>
          <FormLabel HtmlFor='description'>
            <FormattedMessage id='modals.sendeth.firststep.desc' defaultMessage='Description' />
            <TooltipHost id='sendeth.firststep.description'>
              <TooltipIcon name='info' size='12px' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            disabled={isFromCustody}
            component={TextAreaDebounced}
            placeholder="What's this transaction for? (optional)"
            data-e2e={`${coin}SendDescription`}
            fullwidth
            maxLength={100}
          />
        </FormItem>
      </FormGroup>
      {!isFromCustody ? (
        <FeeFormGroup inline margin='10px'>
          <ColLeft>
            <FeeFormContainer toggled={feeToggled}>
              <FeeFormLabel>
                <FormattedMessage
                  id='modals.sendeth.firststep.networkfee'
                  defaultMessage='Network Fee'
                />
                <span>&nbsp;</span>
                {!feeToggled && <Field name='fee' component={SelectBox} elements={feeElements} />}
                {feeToggled && (
                  <FeeOptionsContainer>
                    <RegularFeeLink fee={regularFee} coin={coin} />
                    <span>&nbsp;</span>
                    <PriorityFeeLink fee={priorityFee} coin={coin} />
                  </FeeOptionsContainer>
                )}
              </FeeFormLabel>
              {feeToggled && (
                <FeePerByteContainer style={{ marginTop: '10px' }}>
                  <Field
                    data-e2e={`${coin}CustomFeeInput`}
                    coin={coin}
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
            <ComboDisplay size='13px' weight={500} coin='ETH'>
              {fee}
            </ComboDisplay>
            <Link
              size='12px'
              weight={400}
              capitalize
              onClick={handleFeeToggle}
              data-e2e={`${coin}CustomizeFeeLink`}
            >
              {feeToggled ? (
                <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
              ) : (
                <FormattedMessage
                  id='modals.sendeth.firststep.customizefee'
                  defaultMessage='Customize Fee'
                />
              )}
            </Link>
          </ColRight>
        </FeeFormGroup>
      ) : (
        <FeeFormGroup margin='10px'>
          <FormLabel>
            <FormattedMessage
              id='modals.sendeth.firststep.networkfee'
              defaultMessage='Network Fee'
            />
          </FormLabel>
          <ComboDisplay size='13px' weight={600} coin={coin}>
            {fee}
          </ComboDisplay>
        </FeeFormGroup>
      )}
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
      {disableRetryAttempt && <MinFeeForRetryInvalid />}
      {disableDueToLowEth && <LowEthWarningForErc20 coin={coin} />}
      {isFromCustody && !isMnemonicVerified ? <MnemonicRequiredForCustodySend /> : null}
      <SubmitFormGroup>
        <Button
          type='submit'
          nature='primary'
          height='56px'
          size='18px'
          disabled={
            pristine ||
            submitting ||
            invalid ||
            !amount ||
            !isContractChecked ||
            disableDueToLowEth ||
            disableRetryAttempt ||
            disableCustodySend ||
            Remote.Loading.is(balanceStatus)
          }
          data-e2e={`${coin}SendContinue`}
        >
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      </SubmitFormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  coin: PropTypes.string.isRequired,
  effectiveBalance: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line
  handleToToggle: PropTypes.func.isRequired,
  hasErc20Balance: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  unconfirmedTx: PropTypes.bool
}

export default reduxForm({
  destroyOnUnmount: false,
  form: model.components.sendEth.FORM,
  shouldError,
  shouldWarn
})(FirstStep)
