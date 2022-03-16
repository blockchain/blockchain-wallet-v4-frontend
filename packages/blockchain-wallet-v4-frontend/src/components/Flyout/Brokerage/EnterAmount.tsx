import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Field, FormErrors, InjectedFormProps, reduxForm, stopAsyncValidation } from 'redux-form'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { fiatToString } from '@core/exchange/utils'
import { BeneficiaryType, BSPaymentMethodType, CrossBorderLimits, FiatType } from '@core/types'
import {
  Box,
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/BuySell'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import {
  DepositOrWithdrawal,
  getBankText,
  getBrokerageLimits,
  getIcon,
  normalizeAmount,
  PaymentArrowContainer,
  PaymentText,
  renderBankFullName,
  RightArrowIcon
} from 'components/Flyout/model'
import { checkCrossBorderLimit, minMaxAmount } from 'components/Flyout/validation'
import { Form } from 'components/Form'
import { CheckoutRow } from 'components/Rows'
import { actions } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BankTransferAccountType, BrokerageOrderType } from 'data/types'
import { debounce, memoizer } from 'utils/helpers'

import { MaxButton } from '../../../modals/components'

const CustomForm = styled(Form)`
  width: 100%;
  height: 100%;
`
const FiatIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`
const AmountRow = styled.div<{ isError: boolean }>`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
  > input {
    color: ${(props) => (props.isError ? 'red400' : 'textBlack')};
  }
`
const SubIconWrapper = styled.div`
  background-color: ${(props) => props.theme['fiat-light']};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  right: -20px;
`

const AmountTextBoxShaker = styled(AmountTextBox)<{ meta: { error: string } }>`
  ${(p) =>
    p.meta.error
      ? `
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;

    input {
      color: ${p.theme.red400};
    }`
      : ''}

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`

type LimitSectionProps = {
  fee?: string
  fiatCurrency: Props['fiatCurrency']
  limitAmount: string
  orderType: Props['orderType']
}
const LimitSection = ({ fee = '0', fiatCurrency, limitAmount, orderType }: LimitSectionProps) => {
  switch (orderType) {
    case BrokerageOrderType.WITHDRAW:
      const withdrawSubTitle = (
        <>
          {fiatToString({
            unit: fiatCurrency as FiatType,
            value: convertBaseToStandard('FIAT', limitAmount)
          })}
          {(fee as unknown as number) > 0 && ( // coerce fee into a number and make sure it's positive
            <div style={{ display: 'flex', marginTop: '4px' }}>
              <Text size='14px' weight={500}>
                <FormattedMessage id='modals.withdraw.fee' defaultMessage='Withdraw Fee' />
              </Text>{' '}
              <Text size='14px' color='grey600' weight={500} style={{ marginLeft: '4px' }}>
                {fiatToString({
                  unit: fiatCurrency as FiatType,
                  value: convertBaseToStandard('FIAT', fee)
                })}
              </Text>
            </div>
          )}
        </>
      )
      return (
        <CheckoutRow
          toolTip={
            <TextGroup inline>
              <Text color='grey600' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.brokerage.withdraw_holding_period'
                  defaultMessage='Newly added funds are subject to a holding period. You can transfer between your Trading, Rewards, and Exchange accounts in the meantime.'
                />
              </Text>
              <Link
                weight={500}
                size='14px'
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/articles/360051018131-Trading-Account-Withdrawal-Holds'
              >
                <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
              </Link>
            </TextGroup>
          }
          subTitle={withdrawSubTitle}
          title={
            <FormattedMessage
              id='modals.withdraw.available_for_withdrawal'
              defaultMessage='Available for Withdrawal'
            />
          }
          additionalText={
            <FiatIconWrapper>
              <Icon color={fiatCurrency} name={fiatCurrency} size='32px' />
              <SubIconWrapper>
                <Icon size='24px' color={fiatCurrency} name='arrow-up' />
              </SubIconWrapper>
            </FiatIconWrapper>
          }
        />
      )
    case BrokerageOrderType.DEPOSIT:
      const depositSubTitle = (
        <>
          {fiatToString({
            unit: fiatCurrency as FiatType,
            value: convertBaseToStandard('FIAT', limitAmount)
          })}{' '}
          <FormattedMessage id='copy.available' defaultMessage='Available' />
        </>
      )
      return (
        <CheckoutRow
          subTitle={depositSubTitle}
          title={
            <FormattedMessage id='modals.brokerage.daily_limit' defaultMessage='Daily Limit' />
          }
          additionalText={
            <FiatIconWrapper>
              <Icon color={fiatCurrency} name={fiatCurrency} size='32px' />
              <SubIconWrapper>
                <Icon size='24px' color={fiatCurrency} name='arrow-down' />
              </SubIconWrapper>
            </FiatIconWrapper>
          }
        />
      )
    default:
      return <></>
      break
  }
}

// This debounces the amount input onChange callback in order to allow the user
// to type without running validation on every keystroke. It waits 750 ms after
// the user has stopped typing to run validation and manually dispatches the error
// if needed. This makes for a nice error UX when typing
const debounceValidate = (limits, crossBorderLimits, orderType, fiatCurrency, bankText, dispatch) =>
  debounce((event, newValue) => {
    // check cross border limits
    const limitError = checkCrossBorderLimit(
      crossBorderLimits,
      newValue,
      orderType,
      fiatCurrency,
      bankText
    )
    if (limitError) {
      dispatch(stopAsyncValidation('brokerageTx', limitError))
    }

    const error = minMaxAmount(limits, orderType, fiatCurrency, newValue, bankText)
    if (error) {
      dispatch(stopAsyncValidation('brokerageTx', error))
    }
  }, 300)

type AmountProps = {
  bankText: string
  crossBorderLimits: Props['crossBorderLimits']
  fiatCurrency: Props['fiatCurrency']
  limits: Props['paymentMethod']['limits']
  orderType: Props['orderType']
  showError: boolean
}

const ErrorMessage = ({ error, orderType }) => {
  if (orderType === BrokerageOrderType.WITHDRAW || orderType === BrokerageOrderType.DEPOSIT) {
    return <>{error?.amount}</>
  }

  return <></>
}

const renderAmount = (props) => {
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Text size='56px' color={props.meta.error ? 'red400' : 'textBlack'} weight={500}>
          {Currencies[props.fiatCurrency]?.units[props.fiatCurrency].symbol}
        </Text>
        <AmountTextBoxShaker {...props} />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          height: '1rem',
          justifyContent: 'center',
          marginTop: '5px'
        }}
      />
    </div>
  )
}

const Amount = memoizer((props: AmountProps) => {
  const dispatch = useDispatch()
  return (
    <FlyoutWrapper>
      <AmountRow id='amount-row' isError={!!props.showError}>
        <Field
          data-e2e={
            props.orderType === BrokerageOrderType.DEPOSIT
              ? 'depositAmountInput'
              : 'withdrawAmountInput'
          }
          name='amount'
          component={renderAmount}
          fiatCurrency={props.fiatCurrency}
          onChange={debounceValidate(
            props.limits,
            props.crossBorderLimits,
            props.orderType,
            props.fiatCurrency,
            props.bankText,
            dispatch
          )}
          normalize={normalizeAmount}
          maxFontSize='56px'
          placeholder='0'
          // leave fiatActive always to avoid 50% width in HOC?
          fiatActive
          {...{
            autoFocus: true,
            hideError: true
          }}
        />
      </AmountRow>
    </FlyoutWrapper>
  )
})

const Account = ({
  handleMethodClick,
  invalid,
  paymentAccount,
  paymentMethod
}: {
  handleMethodClick: () => void
  invalid: boolean
  paymentAccount?: BankTransferAccountType | BeneficiaryType
  paymentMethod: BSPaymentMethodType
}) => {
  return (
    <Box
      disabled={invalid}
      role='button'
      data-e2e='paymentMethodSelect'
      onClick={handleMethodClick}
      isMethod={!!paymentAccount}
    >
      <DisplayPaymentIcon showBackground={!paymentAccount}>
        {getIcon({ ...paymentMethod, ...paymentAccount } as BSPaymentMethodType, false, invalid)}
      </DisplayPaymentIcon>
      <PaymentText isMethod={!!paymentAccount}>{getBankText(paymentAccount)}</PaymentText>
      <PaymentArrowContainer>
        <RightArrowIcon cursor disabled={invalid} name='arrow-back' size='20px' color='grey600' />
      </PaymentArrowContainer>
    </Box>
  )
}

const NextButton = ({ invalid, orderType, paymentAccount, pristine, submitting }) => {
  return (
    <Button
      data-e2e={orderType === BrokerageOrderType.DEPOSIT ? 'submitDepositAmount' : 'withdrawNext'}
      height='48px'
      size='16px'
      nature='primary'
      type='submit'
      fullwidth
      disabled={invalid || pristine || submitting || !paymentAccount}
      onClick={() => {}}
    >
      {submitting ? (
        <HeartbeatLoader height='16px' width='16px' color='white' />
      ) : (
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      )}
    </Button>
  )
}

const EnterAmount = ({
  crossBorderLimits,
  fee,
  fiatCurrency,
  formActions,
  formErrors,
  handleBack,
  handleMethodClick,
  handleSubmit,
  invalid,
  minWithdrawAmount,
  onMaxButtonClicked,
  orderType,
  paymentAccount,
  paymentMethod,
  pristine,
  submitting,
  withdrawableBalance
}: Props) => {
  const minMaxLimits = getBrokerageLimits({
    fee,
    minWithdrawAmount,
    orderType,
    paymentMethod,
    withdrawableBalance
  })

  const showError = !!formErrors

  return (
    <CustomForm onSubmit={handleSubmit}>
      <FlyoutContainer>
        <FlyoutHeader
          data-e2e='depositBackToDepositMethods'
          mode={orderType === BrokerageOrderType.DEPOSIT ? 'back' : 'close'}
          onClick={handleBack}
        >
          <DepositOrWithdrawal fiatCurrency={fiatCurrency} orderType={orderType} />
        </FlyoutHeader>
        <FlyoutContent mode='top'>
          {(orderType === BrokerageOrderType.DEPOSIT ||
            orderType === BrokerageOrderType.WITHDRAW) && (
            <LimitSection
              fee={fee}
              fiatCurrency={fiatCurrency}
              orderType={orderType}
              limitAmount={withdrawableBalance || paymentMethod.limits.max}
            />
          )}
          <div
            style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          >
            <Amount
              fiatCurrency={fiatCurrency}
              limits={minMaxLimits}
              orderType={orderType}
              crossBorderLimits={crossBorderLimits}
              showError={showError}
              bankText={
                orderType === BrokerageOrderType.DEPOSIT ? renderBankFullName(paymentAccount) : ''
              }
            />
          </div>
          <MaxButton
            type={orderType === BrokerageOrderType.DEPOSIT ? 'Deposit' : 'Withdrawal'}
            onClick={() => {
              formActions.change(
                'brokerageTx',
                'amount',
                convertBaseToStandard('FIAT', withdrawableBalance || paymentMethod.limits.max)
              )
              // record max click withdrawal
              if (onMaxButtonClicked) {
                onMaxButtonClicked()
              }
            }}
          />
        </FlyoutContent>
        <FlyoutFooter>
          <Account
            handleMethodClick={handleMethodClick}
            invalid={invalid}
            paymentAccount={paymentAccount}
            paymentMethod={paymentMethod}
          />
          {!showError && (
            <NextButton
              paymentAccount={paymentAccount}
              invalid={invalid}
              orderType={orderType}
              pristine={pristine}
              submitting={submitting}
            />
          )}
          {showError && <ErrorMessage error={formErrors} orderType={orderType} />}
        </FlyoutFooter>
      </FlyoutContainer>
    </CustomForm>
  )
}

export type OwnProps =
  | {
      crossBorderLimits: CrossBorderLimits
      fee?: never
      fiatCurrency: FiatType
      formActions: typeof actions.form
      // formErrors: FormErrors<{ amount?: 'ABOVE_MAX' | 'BELOW_MIN' | false }, string> | undefined
      formErrors: FormErrors<{}, string> | undefined
      handleBack: () => void
      handleMethodClick: () => void
      minWithdrawAmount?: never
      onMaxButtonClicked?: never
      orderType: BrokerageOrderType.DEPOSIT
      paymentAccount?: BankTransferAccountType | BeneficiaryType
      paymentMethod: BSPaymentMethodType
      withdrawableBalance?: never
    }
  | {
      crossBorderLimits: CrossBorderLimits
      fee: string
      fiatCurrency: FiatType
      formActions: typeof actions.form
      formErrors: FormErrors<{}, string> | undefined
      handleBack: () => void
      handleMethodClick: () => void
      minWithdrawAmount: string
      onMaxButtonClicked: () => void
      orderType: BrokerageOrderType.WITHDRAW
      paymentAccount?: BankTransferAccountType | BeneficiaryType
      paymentMethod: BSPaymentMethodType
      withdrawableBalance: string
    } // add another union type here when moving buy sell enter amount screens over

type Props = OwnProps & InjectedFormProps<{}, OwnProps>

export default reduxForm<{}, OwnProps>({
  destroyOnUnmount: false,
  form: 'brokerageTx'
})(EnterAmount)
