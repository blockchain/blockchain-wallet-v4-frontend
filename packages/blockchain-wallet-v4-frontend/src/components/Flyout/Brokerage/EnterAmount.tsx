import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Field, InjectedFormProps, reduxForm, stopAsyncValidation } from 'redux-form'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { fiatToString } from '@core/exchange/utils'
import { FiatType, SBPaymentMethodType } from '@core/types'
import { Box, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { AmountTextBox } from 'components/Exchange'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader,
  FlyoutWrapper
} from 'components/Flyout'
import {
  DepositOrWithdrawal,
  getBankText,
  getIcon,
  normalizeAmount,
  PaymentArrowContainer,
  PaymentText,
  RightArrowIcon
} from 'components/Flyout/model'
import { minMaxAmount } from 'components/Flyout/validation'
import { Form } from 'components/Form'
import { CheckoutRow } from 'components/Rows'
import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BankTransferAccountType, BrokerageOrderType } from 'data/types'
import { debounce } from 'utils/helpers'

const CustomForm = styled(Form)`
  width: 100%;
  height: 100%;
`
const Limits = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 40px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
const LimitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const FiatIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`
const AmountRow = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
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
      color: ${p.theme.grey700};
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
  fiatCurrency: Props['fiatCurrency']
  orderType: Props['orderType']
  paymentMethod: Props['paymentMethod']
}
const LimitSection = ({ fiatCurrency, orderType, paymentMethod }: LimitSectionProps) => {
  if (paymentMethod.limits) {
    switch (orderType) {
      case BrokerageOrderType.WITHDRAW:
        const withdrawSubTitle = (
          <>
            {fiatToString({
              unit: fiatCurrency as FiatType,
              value: '50'
            })}
          </>
        )
        return (
          <CheckoutRow
            toolTip={
              <FormattedMessage
                id='modals.brokerage.withdraw_holding_period'
                defaultMessage='Newly added funds are subject to a holding period. You can transfer funds between your Trading, Rewards, and Exchange accounts now and withdraw them once the hold ends.'
              />
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
                  <Icon size='24px' color='USD' name='arrow-up' />
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
              value: convertBaseToStandard('FIAT', paymentMethod.limits.max)
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
                  <Icon size='24px' color='USD' name='arrow-down' />
                </SubIconWrapper>
              </FiatIconWrapper>
            }
          />
        )
      default:
        break
    }
  }
  // TODO: return something if no limits are available
  return <></>
}

// This debounces the amount input onChange callback in order to allow the user
// to type without running validation on every keystroke. It waits 750 ms after
// the user has stopped typing to run validation and manually dispatches the error
// if needed. This makes for a nice error UX when typing
const debounceValidate = (limits, dispatch) =>
  debounce((event, newValue) => {
    const error = minMaxAmount(limits, newValue)
    if (error) {
      dispatch(stopAsyncValidation('brokerageTx', error))
    }
  }, 750)

type AmountProps = {
  fiatCurrency: Props['fiatCurrency']
  limits: Props['paymentMethod']['limits']
}
const Amount = React.memo(({ fiatCurrency, limits }: AmountProps) => {
  const dispatch = useDispatch()
  return (
    <FlyoutWrapper>
      <AmountRow id='amount-row'>
        <Text size='56px' color='textBlack' weight={500}>
          {Currencies[fiatCurrency]?.units[fiatCurrency].symbol}
        </Text>
        <Field
          data-e2e='depositAmountInput'
          name='amount'
          component={AmountTextBoxShaker}
          onChange={debounceValidate(limits, dispatch)}
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

const Account = ({ handleMethodClick, invalid, paymentAccount }) => {
  return (
    <Box
      disabled={invalid}
      role='button'
      data-e2e='paymentMethodSelect'
      onClick={handleMethodClick}
      isMethod={!!paymentAccount}
    >
      <DisplayPaymentIcon showBackground={!paymentAccount}>
        {getIcon(paymentAccount, false, invalid)}
      </DisplayPaymentIcon>
      <PaymentText isMethod={!!paymentAccount}>{getBankText(paymentAccount)}</PaymentText>
      <PaymentArrowContainer>
        <RightArrowIcon cursor disabled={invalid} name='arrow-back' size='20px' color='grey600' />
      </PaymentArrowContainer>
    </Box>
  )
}

const NextButton = ({ invalid, paymentAccount, pristine, submitting }) => {
  return (
    <Button
      data-e2e='submitDepositAmount'
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
  fiatCurrency,
  form,
  handleBack,
  handleMethodClick,
  handleSubmit,
  invalid,
  orderType,
  paymentAccount,
  paymentMethod,
  pristine,
  submitting
}: Props) => {
  return (
    <CustomForm onSubmit={handleSubmit}>
      <FlyoutContainer>
        <FlyoutHeader data-e2e='depositBackToDepositMethods' mode='back' onClick={handleBack}>
          <DepositOrWithdrawal fiatCurrency={fiatCurrency} orderType={orderType} />
        </FlyoutHeader>
        <FlyoutContent mode='top'>
          {(orderType === BrokerageOrderType.DEPOSIT ||
            orderType === BrokerageOrderType.WITHDRAW) && (
            <LimitSection
              fiatCurrency={fiatCurrency}
              orderType={orderType}
              paymentMethod={paymentMethod}
            />
          )}
          <div
            style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          >
            <Amount fiatCurrency={fiatCurrency} limits={paymentMethod.limits} />
          </div>
        </FlyoutContent>
        <FlyoutFooter>
          <Account
            handleMethodClick={handleMethodClick}
            invalid={invalid}
            paymentAccount={paymentAccount}
          />
          <NextButton
            paymentAccount={paymentAccount}
            invalid={invalid}
            pristine={pristine}
            submitting={submitting}
          />
        </FlyoutFooter>
      </FlyoutContainer>
    </CustomForm>
  )
}

type OwnProps = {
  fiatCurrency: FiatType
  handleBack: () => void
  handleMethodClick: () => void
  orderType: BrokerageOrderType
  paymentAccount?: BankTransferAccountType
  paymentMethod: SBPaymentMethodType
}

type Props = OwnProps & InjectedFormProps<{}, OwnProps>

export default reduxForm<{}, OwnProps>({
  destroyOnUnmount: false,
  form: 'brokerageTx'
})(EnterAmount)
