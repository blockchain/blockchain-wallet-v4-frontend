import React, { ReactChild, useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Earn/Interest/DepositForm/model'
import { clearSubmitErrors, Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { fiatToString, formatFiat } from '@core/exchange/utils'
import { BSPaymentMethodType, BSPaymentTypes, FiatType } from '@core/types'
import { Banner, Icon, Text } from 'blockchain-info-components'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import TransactionsLeft from 'components/Flyout/Banners/TransactionsLeft'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { getPeriodTitleText } from 'components/Flyout/model'
import Form from 'components/Form/Form'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { model } from 'data'
import { convertBaseToStandard, convertStandardToBase } from 'data/components/exchange/services'
import { Analytics, BSCheckoutFormValuesType } from 'data/types'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'
import { isNabuError, NabuError } from 'services/errors'
import { FIAT_DECIMALS, formatTextAmount } from 'services/forms'

import { AlertButton } from '../../../components'
import Scheduler from '../../../RecurringBuys/Scheduler'
import { Row } from '../../../Swap/EnterAmount/Checkout'
import { ErrorCodeMappings } from '../../model'
import { Props as OwnProps, SuccessStateType } from '.'
import ActionButton from './ActionButton'
import BaseQuote from './BaseQuote'
import { useBlockedPayments } from './hooks'
import Payment from './Payment'
import { checkCrossBorderLimit, getMaxMin, maximumAmount, minimumAmount } from './validation'

const { FORM_BS_CHECKOUT } = model.components.buySell

const AmountRow = styled(Row)<{ isError: boolean }>`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
  > input {
    color: ${(props) => (props.isError ? 'red400' : 'textBlack')};
  }
`
const LiftedActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`
const AnchoredActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`
const Amounts = styled.div`
  margin: 0 0 24px 0;
  display: flex;
  justify-content: center;
`
const MaxAvailableWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CartridgeWrapper = styled.div`
  display: flex;
`

export const ButtonContainer = styled.div`
  margin-top: 24px;
`

const Cartridge = ({ children, error }: { children: ReactChild; error: boolean }) => {
  return (
    <GreyBlueCartridge
      style={{ marginLeft: 0 }}
      role='button'
      data-e2e={error ? 'sbEnterAmountMaxError' : 'sbEnterAmountMax'}
    >
      {children}
    </GreyBlueCartridge>
  )
}

const normalizeAmount = (value, prevValue) => {
  if (Number.isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, true)
}

const isAmountInLimits = (amount: number | undefined, min: number, max: number): boolean => {
  if (!amount) return false
  if (amount < min || amount > max) {
    return false
  }
  return true
}
const getAmountLimitsError = (amount: number, min: number, max: number): string | null => {
  if (amount < min) {
    return 'BELOW_MIN'
  }

  if (amount > max) {
    return 'ABOVE_MAX'
  }
  return null
}

const isLimitError = (code: number | string): boolean => {
  switch (Number(code)) {
    case 45:
    case 46:
    case 47:
      return true
    default:
      return false
  }
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const {
    analyticsActions,
    buySellActions,
    crossBorderLimits,
    cryptoCurrency,
    defaultMethod,
    error,
    fiatCurrency,
    form,
    formErrors,
    formValues,
    handleSubmit,
    identityVerificationActions,
    isPristine,
    isRecurringBuy,
    limits,
    method: selectedMethod,
    orderType,
    pair,
    payment,
    products,
    sbBalances,
    swapAccount,
    userData
  } = props

  useEffect(() => {
    analyticsActions.trackEvent({
      key: Analytics.BUY_AMOUNT_SCREEN_VIEWED,
      properties: {}
    })
  }, [])

  const dispatch = useDispatch()

  const [fontRatio, setFontRatio] = useState(1)
  const setOrderFrequency = useCallback(() => {
    buySellActions.setStep({ step: 'FREQUENCY' })
  }, [buySellActions])

  const clearFormError = useCallback(() => {
    dispatch(clearSubmitErrors(form))
  }, [dispatch, form])

  const { isPaymentMethodBlocked, paymentErrorButton, paymentErrorCard } =
    useBlockedPayments(selectedMethod)

  const goToCryptoSelection = useCallback(() => {
    buySellActions.setStep({
      fiatCurrency: fiatCurrency || 'USD',
      step: 'CRYPTO_SELECTION'
    })
  }, [fiatCurrency, buySellActions])

  const method = selectedMethod || defaultMethod

  const conversionCoinType = 'FIAT'

  if (!formValues) return null
  if (!fiatCurrency)
    return (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={goToCryptoSelection}
      />
    )

  const isDailyLimitExceeded = limits?.max && Number(limits.max) === 0

  const max = getMaxMin(
    'max',
    sbBalances,
    pair,
    payment,
    formValues,
    method,
    swapAccount,
    limits
  ).value
  const min = getMaxMin(
    'min',
    sbBalances,
    pair,
    payment,
    formValues,
    method,
    swapAccount,
    limits
  ).value

  // prevent proceed if entered amount is out of limits
  const amountInBounds = isAmountInLimits(Number(formValues?.amount), Number(min), Number(max))

  const errorMinMax = formValues?.amount
    ? getAmountLimitsError(Number(formValues?.amount), Number(min), Number(max))
    : null

  const amountError = (typeof formErrors.amount === 'string' && formErrors.amount) || errorMinMax

  const showError = !isPristine && amountError

  const handleMinMaxClick = () => {
    const prop = amountError === 'BELOW_MIN' ? 'min' : 'max'
    const maxMin = getMaxMin(
      prop,
      sbBalances,
      pair,
      payment,
      formValues,
      method,
      swapAccount,
      limits
    ).value
    const value = convertStandardToBase(conversionCoinType, maxMin)
    if (prop === 'min') {
      buySellActions.handleBuyMinAmountClick({ amount: value, coin: conversionCoinType })
    }

    if (prop === 'max') {
      buySellActions.handleBuyMaxAmountClick({ amount: value, coin: conversionCoinType })
    }
  }

  const handleMaxClick = () => {
    const maxMin = getMaxMin(
      'max',
      sbBalances,
      pair,
      payment,
      formValues,
      method,
      swapAccount,
      limits
    ).value
    const value = convertStandardToBase(conversionCoinType, maxMin)

    buySellActions.handleBuyMaxAmountClick({ amount: value, coin: conversionCoinType })
  }

  const handleCustomMinMaxClick = (value) => {
    buySellActions.handleBuyMaxAmountClick({ amount: value, coin: conversionCoinType })
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    if (Number(fontSizeRatio) > 0) {
      setFontRatio(Math.min(fontSizeRatio, 1))
    }
    const amountRowNode = inputNode.closest('#amount-row')
    const currencyNode = isFiat
      ? amountRowNode.children[0]
      : amountRowNode.children[amountRowNode.children.length - 1]
    currencyNode.style.fontSize = `${fontSizeNumber * fontRatio}px`
  }

  const getValue = (value) =>
    fiatToString({
      digits: FIAT_DECIMALS,
      unit: fiatCurrency,
      value
    })
  const effectiveLimit = getEffectiveLimit(crossBorderLimits)
  const effectivePeriod = getEffectivePeriod(crossBorderLimits)

  const showLimitError = showError && amountError === 'ABOVE_MAX_LIMIT'

  const isFundsMethod = method && method.type === BSPaymentTypes.FUNDS

  const goBack = () => {
    analyticsActions.trackEvent({
      key: Analytics.BUY_AMOUNT_SCREEN_BACK_CLICKED,
      properties: {}
    })

    buySellActions.returnToCryptoSelection()
  }

  if (isNabuError(error)) {
    return <GenericNabuErrorFlyout error={error} onDismiss={clearFormError} />
  }

  return (
    <CustomForm onSubmit={handleSubmit}>
      <FlyoutWrapper style={{ borderBottom: 'grey000', paddingBottom: '0px' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <LeftTopCol>
            <Icon
              cursor
              data-e2e='sbBackToCryptoSelection'
              name='arrow-back'
              size='20px'
              color='grey600'
              role='button'
              style={{ marginRight: '8px' }}
              onClick={goBack}
            />
            <FormattedMessage id='buttons.buy_now' defaultMessage='Buy Now' />
          </LeftTopCol>
        </TopText>
      </FlyoutWrapper>
      <BaseQuote coin={cryptoCurrency} orderType={orderType} />

      <FlyoutWrapper
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '0px'
        }}
      >
        <LiftedActions>
          <AmountRow id='amount-row' isError={!!showError}>
            <Text size='56px' color={showError ? 'red400' : 'textBlack'} weight={500}>
              {Currencies[fiatCurrency].units[fiatCurrency].symbol}
            </Text>
            <Field
              data-e2e='sbAmountInput'
              name='amount'
              component={AmountTextBox}
              validate={[maximumAmount, minimumAmount, checkCrossBorderLimit]}
              normalize={normalizeAmount}
              // eslint-disable-next-line
              onUpdate={resizeSymbol.bind(null, true)}
              maxFontSize='56px'
              placeholder='0'
              autoComplete='off'
              pointerToLeft
              // leave fiatActive always to avoid 50% width in HOC?
              fiatActive
              haveError={!!showError}
              autoFocus
              hideError
            />
          </AmountRow>
        </LiftedActions>
        <AnchoredActions>
          {isRecurringBuy && formValues.period && (
            <Scheduler
              onClick={setOrderFrequency}
              period={formValues.period}
              method={method || defaultMethod}
            >
              {getPeriodTitleText(formValues.period)}
            </Scheduler>
          )}
          {pair && (
            <Amounts>
              <MaxAvailableWrapper>
                <CartridgeWrapper onClick={handleMinMaxClick}>
                  <Cartridge error={amountError === 'ABOVE_MAX'}>
                    {/* If amount is 0 or below min show the min amount button before the max sell button */}
                    {amountError === 'BELOW_MIN' ? (
                      <FormattedMessage
                        id='modals.simplebuy.checkout.buy.belowmin'
                        defaultMessage='{value} Minimum Buy'
                        values={{
                          value: getValue(min)
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id='modals.simplebuy.checkout.maxbuy'
                        defaultMessage='Buy Max'
                      />
                    )}
                  </Cartridge>
                </CartridgeWrapper>
              </MaxAvailableWrapper>
            </Amounts>
          )}
          {paymentErrorCard}
          <Payment {...props} method={method} />
          {error && (
            <Banner type='warning' style={{ marginBottom: '15px' }}>
              {isLimitError(error) && userData?.tiers?.current < 2 ? (
                <div
                  onClick={() =>
                    identityVerificationActions.verifyIdentity({
                      needMoreInfo: false,
                      origin: 'BuySell',
                      tier: 2
                    })
                  }
                  onKeyDown={() =>
                    identityVerificationActions.verifyIdentity({
                      needMoreInfo: false,
                      origin: 'BuySell',
                      tier: 2
                    })
                  }
                  role='button'
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                >
                  <>
                    <ErrorCodeMappings code={error} />
                    <br />
                    <FormattedMessage id='copy.upgrade' defaultMessage='Upgrade to Gold' />
                  </>
                </div>
              ) : (
                <ErrorCodeMappings code={error} />
              )}
            </Banner>
          )}
          {!showLimitError && !showError && !isPaymentMethodBlocked && (
            <ActionButton
              {...props}
              isSufficientEthForErc20={false}
              isDailyLimitExceeded={isDailyLimitExceeded || false}
              isAmountInBounds={amountInBounds}
            />
          )}
          {paymentErrorButton}
          {products?.buy?.maxOrdersLeft > 0 && (
            <TransactionsLeft remaining={products.buy.maxOrdersLeft} />
          )}
          {!showLimitError && showError && (
            <ButtonContainer>
              {amountError === 'BELOW_MIN' ? (
                <AlertButton onClick={handleMinMaxClick}>
                  <FormattedMessage
                    id='copy.below_min'
                    defaultMessage='{amount} Minimum'
                    values={{
                      amount: fiatToString({ unit: fiatCurrency, value: min })
                    }}
                  />
                </AlertButton>
              ) : amountError === 'ABOVE_LIMIT' ||
                (amountError === 'ABOVE_BALANCE' && !isFundsMethod) ? (
                <AlertButton onClick={handleMaxClick}>
                  <FormattedMessage id='copy.over_your_limit' defaultMessage='Over Your Limit' />
                </AlertButton>
              ) : amountError === 'ABOVE_BALANCE' && isFundsMethod ? (
                <AlertButton onClick={handleMaxClick}>
                  <FormattedMessage
                    id='copy.not_enough_coin'
                    defaultMessage='Not Enough {coin}'
                    values={{
                      coin: fiatCurrency
                    }}
                  />
                </AlertButton>
              ) : (
                <AlertButton onClick={handleMaxClick}>
                  <FormattedMessage
                    id='copy.above_max'
                    defaultMessage='{amount} Maximum'
                    values={{
                      amount: fiatToString({ unit: fiatCurrency, value: max })
                    }}
                  />
                </AlertButton>
              )}

              <Text
                size='14px'
                color='textBlack'
                weight={500}
                style={{ marginTop: '24px', textAlign: 'center' }}
              >
                {amountError === 'BELOW_MIN' && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.belowmin'
                    defaultMessage='To offset fees and market volatility, the minimum amount for any buy is {amount} {currency}.'
                    values={{
                      amount: fiatToString({ unit: fiatCurrency, value: min }),
                      currency: fiatCurrency
                    }}
                  />
                )}

                {amountError === 'ABOVE_MAX' && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.abovemax'
                    defaultMessage='The maximum amount of {coin} you can buy with your {currency} {amount}'
                    values={{
                      amount: fiatToString({ unit: fiatCurrency, value: max }),
                      coin: cryptoCurrency,
                      currency: fiatCurrency
                    }}
                  />
                )}

                {amountError === 'ABOVE_BALANCE' && effectiveLimit && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.over_balance'
                    defaultMessage='Swapping from Trade Accounts cannot exceed {limit} a {period}. You have {currency}{amount} remaining.'
                    values={{
                      amount: fiatToString({ unit: fiatCurrency, value: max }),
                      currency: fiatCurrency,
                      limit: formatFiat(
                        convertBaseToStandard('FIAT', effectiveLimit.limit.value),
                        0
                      ),
                      period: effectivePeriod
                    }}
                  />
                )}
                {(amountError === 'ABOVE_LIMIT' ||
                  (amountError === 'ABOVE_BALANCE' && !isFundsMethod)) && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.over_limit_full_access'
                    defaultMessage='You can buy up to {amount} per transaction. Get full access & buy larger amounts with your bank or card.'
                    values={{
                      amount: fiatToString({ unit: fiatCurrency, value: max })
                    }}
                  />
                )}
                {amountError === 'ABOVE_BALANCE' && isFundsMethod && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.abovemax'
                    defaultMessage='The maximum amount of {coin} you can buy with your {currency} {amount}'
                    values={{
                      amount: fiatToString({ unit: fiatCurrency, value: max }),
                      coin: cryptoCurrency,
                      currency: fiatCurrency
                    }}
                  />
                )}
              </Text>
            </ButtonContainer>
          )}
          {showLimitError && effectiveLimit && (
            <>
              <AlertButton
                onClick={() => {
                  handleCustomMinMaxClick(effectiveLimit.limit.value.toString())
                }}
              >
                <FormattedMessage id='copy.over_your_limit' defaultMessage='Over Your Limit' />
              </AlertButton>
              <FormattedMessage
                id='modals.simplebuy.checkout.max_buy_upgrade'
                defaultMessage='You can buy up to {amount} per transaction. Upgrade to Gold & buy larger amounts with your bank or card.'
                values={{
                  amount: formatFiat(convertBaseToStandard('FIAT', effectiveLimit.limit.value), 0)
                }}
              />
            </>
          )}
          {isDailyLimitExceeded && (
            <Amounts>
              <GreyBlueCartridge role='button' data-e2e='sbEnterAmountDailyLimitExceeded'>
                <FormattedMessage
                  id='modals.simplebuy.checkout.dailylimitexceeded'
                  defaultMessage="You've reached your daily trading limit"
                />
              </GreyBlueCartridge>
            </Amounts>
          )}
        </AnchoredActions>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export type Props = OwnProps &
  SuccessStateType & {
    cryptoCurrency: string
    error?: string | NabuError
    fiatCurrency: FiatType
    formValues: BSCheckoutFormValuesType
    isPristine: boolean
  }

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: FORM_BS_CHECKOUT
})(Success)
