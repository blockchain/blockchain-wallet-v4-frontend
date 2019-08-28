import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import Bowser from 'bowser'
import styled from 'styled-components'

import { model } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { required, validEthAddress } from 'services/FormHelper'
import {
  Banner,
  Button,
  Text,
  TooltipHost,
  TooltipIcon,
  Link
} from 'blockchain-info-components'
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
import {
  invalidAmount,
  insufficientFunds,
  maximumAmount,
  shouldError,
  shouldWarn,
  minimumFee,
  maximumFee
} from './validation'
import LowBalanceWarning from './LowBalanceWarning'
import LowEthWarningForErc20 from './LowEthWarningForErc20'
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
import ComboDisplay from 'components/Display/ComboDisplay'
import RegularFeeLink from './RegularFeeLink'
import PriorityFeeLink from './PriorityFeeLink'

const WarningBanners = styled(Banner)`
  margin: -6px 0 12px;
  padding: 8px;
`
const SubmitFormGroup = styled(FormGroup)`
  margin-top: 16px;
`

const FirstStep = props => {
  const {
    coin,
    pristine,
    invalid,
    submitting,
    fee,
    handleSubmit,
    unconfirmedTx,
    isContract,
    isContractChecked,
    feeToggled,
    from,
    feeElements,
    regularFee,
    priorityFee,
    handleFeeToggle,
    balanceStatus,
    excludeLockbox,
    hasErc20Balance,
    isSufficientEthForErc20
  } = props
  const isFromLockbox = from && from.type === 'LOCKBOX'
  const browser = Bowser.getParser(window.navigator.userAgent)
  const isBrowserSupported = browser.satisfies(
    model.components.lockbox.supportedBrowsers
  )
  const disableLockboxSend = isFromLockbox && !isBrowserSupported
  const disableDueToLowEth = coin !== 'ETH' && !isSufficientEthForErc20

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'40%'}>
          <FormLabel for='coin'>
            <FormattedMessage
              id='modals.sendether.firststep.currency'
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
              id='modals.sendEther.firststep.fromwallet'
              defaultMessage='From'
            />
          </FormLabel>
          <Field
            name='from'
            component={SelectBoxEthAddresses}
            includeAll={false}
            validate={[required]}
            excludeLockbox={excludeLockbox}
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
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='to'>
            <FormattedMessage
              id='modals.sendeth.firststep.tocoin'
              defaultMessage='To'
            />
          </FormLabel>
          <Row>
            <Field
              name='to'
              coin={coin}
              placeholder='Paste, scan, or select destination'
              validate={[required, validEthAddress]}
              component={SelectBoxEthAddresses}
              dataE2e='sendEthAddressInput'
              exclude={[from.label]}
              openMenuOnClick={false}
              includeAll={false}
              isCreatable
              noOptionsMessage={() => null}
              isValidNewOption={() => false}
            />
            <QRCodeCapture
              scanType='ethAddress'
              border={['top', 'bottom', 'right']}
            />
          </Row>
          {unconfirmedTx && (
            <Text color='error' size='12px' weight={400}>
              <FormattedMessage
                id='modals.sendeth.unconfirmedtransactionmessage'
                defaultMessage='Please wait until your previous transaction confirms.'
              />
            </Text>
          )}
          {isContract && (
            <Text color='error' size='12px' weight={400}>
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
              id='modals.sendeth.firststep.sendamount'
              defaultMessage='Amount'
            />
          </FormLabel>
          <Field
            name='amount'
            disabled={unconfirmedTx}
            component={FiatConverter}
            coin={coin}
            validate={[
              required,
              invalidAmount,
              insufficientFunds,
              maximumAmount
            ]}
            data-e2e={`${coin}Send`}
          />
        </FormItem>
      </FormGroup>
      {hasErc20Balance && coin === 'ETH' && (
        <LowBalanceWarning
          effectiveBalance={props.effectiveBalance}
          totalBalance={props.from.balance}
        />
      )}
      <FormGroup margin={'15px'}>
        <FormItem>
          <FormLabel for='description'>
            <FormattedMessage
              id='modals.sendeth.firststep.desc'
              defaultMessage='Description'
            />
            <TooltipHost id='sendeth.firststep.description'>
              <TooltipIcon name='question-in-circle' size='12px' />
            </TooltipHost>
          </FormLabel>
          <Field
            name='description'
            component={TextAreaDebounced}
            placeholder="What's this transaction for? (optional)"
            data-e2e={`${coin}SendDescription`}
            fullwidth
          />
        </FormItem>
      </FormGroup>
      <FeeFormGroup inline margin={'10px'}>
        <ColLeft>
          <FeeFormContainer toggled={feeToggled}>
            <FeeFormLabel>
              <FormattedMessage
                id='modals.sendeth.firststep.networkfee'
                defaultMessage='Network Fee'
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
                  <RegularFeeLink fee={regularFee} coin={coin} />
                  <span>&nbsp;</span>
                  <PriorityFeeLink fee={priorityFee} coin={coin} />
                </FeeOptionsContainer>
              )}
            </FeeFormLabel>
            {feeToggled && (
              <FeePerByteContainer>
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
          <ComboDisplay size='13px' coin='ETH'>
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
              <FormattedMessage
                id='modals.sendeth.firststep.cancel'
                defaultMessage='Cancel'
              />
            ) : (
              <FormattedMessage
                id='modals.sendeth.firststep.customizefee'
                defaultMessage='Customize Fee'
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
      {disableDueToLowEth && <LowEthWarningForErc20 />}
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
            isContract ||
            !isContractChecked ||
            disableDueToLowEth ||
            Remote.Loading.is(balanceStatus)
          }
          data-e2e={`${coin}SendContinue`}
        >
          <FormattedMessage
            id='modals.sendeth.firststep.continue'
            defaultMessage='Continue'
          />
        </Button>
      </SubmitFormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  coin: PropTypes.string.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  fee: PropTypes.string.isRequired,
  effectiveBalance: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleToToggle: PropTypes.func.isRequired,
  unconfirmedTx: PropTypes.bool,
  hasErc20Balance: PropTypes.bool.isRequired
}

export default reduxForm({
  form: model.components.sendEth.FORM,
  shouldError,
  shouldWarn,
  destroyOnUnmount: false
})(FirstStep)
