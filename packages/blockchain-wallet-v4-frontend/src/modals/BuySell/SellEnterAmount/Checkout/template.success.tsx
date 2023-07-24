import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Earn/Interest/DepositForm/model'
import { clearSubmitErrors, Field, InjectedFormProps, reduxForm } from 'redux-form'

import Currencies from '@core/exchange/currencies'
import { coinToString, fiatToString, formatFiat } from '@core/exchange/utils'
import { BSOrderActionType, BSPaymentTypes, CoinType, FiatType, OrderType } from '@core/types'
import { Banner, Icon, Text } from 'blockchain-info-components'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { model } from 'data'
import { convertBaseToStandard, convertStandardToBase } from 'data/components/exchange/services'
import { Analytics, BSCheckoutFormValuesType, BSFixType, SwapBaseCounterTypes } from 'data/types'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'
import { isNabuError, NabuError } from 'services/errors'
import { CRYPTO_DECIMALS, FIAT_DECIMALS, formatTextAmount } from 'services/forms'

import { AlertButton } from '../../../components'
import { ErrorCodeMappings } from '../../model'
import { Props as OwnProps, SuccessStateType } from '.'
import ActionButton from './ActionButton'
import BaseQuote from './BaseQuote'
import { useBlockedPayments } from './hooks'
import Payment from './Payment'
import {
  ActionsItem,
  AmountRow,
  Amounts,
  AnchoredActions,
  ButtonContainer,
  Cartridge,
  CartridgeWrapper,
  CustomForm,
  LeftTopCol,
  LiftedActions,
  MaxAvailableWrapper,
  QuoteActionContainer,
  QuoteRow,
  TopText
} from './styles'
import { checkCrossBorderLimit, getMaxMin, maximumAmount, minimumAmount } from './validation'

const { FORM_BS_CHECKOUT } = model.components.buySell

const normalizeAmount = (value, prevValue, allValues: BSCheckoutFormValuesType) => {
  if (Number.isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, allValues && allValues.fix === 'FIAT')
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
    crossBorderLimits,
    cryptoCurrency,
    defaultMethod,
    fiatCurrency,
    method: selectedMethod,
    orderType
  } = props

  useEffect(() => {
    analyticsActions.trackEvent({
      key: Analytics.SELL_AMOUNT_SCREEN_VIEWED,
      properties: {}
    })
  }, [])

  const dispatch = useDispatch()

  const [fontRatio, setFontRatio] = useState(1)

  const clearFormError = useCallback(() => {
    dispatch(clearSubmitErrors(props.form))
  }, [dispatch, props.form])

  const { isPaymentMethodBlocked, paymentErrorButton, paymentErrorCard } =
    useBlockedPayments(selectedMethod)

  const goToCryptoSelection = useCallback(() => {
    props.buySellActions.setStep({
      fiatCurrency: props.fiatCurrency || 'USD',
      step: 'CRYPTO_SELECTION'
    })
  }, [props.fiatCurrency, props.buySellActions])

  const method = selectedMethod || defaultMethod

  const { fix } = props.preferences[props.orderType]
  const digits = fix === 'FIAT' ? FIAT_DECIMALS : CRYPTO_DECIMALS
  const baseCurrency = fix === 'FIAT' ? fiatCurrency : cryptoCurrency
  const conversionCoinType: 'FIAT' | CoinType = fix === 'FIAT' ? 'FIAT' : cryptoCurrency

  const quoteAmount = fix === 'FIAT' ? props.quote.data.amount : props.quote.data.resultAmount

  if (!props.formValues) return null
  if (!fiatCurrency || !baseCurrency)
    return (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={goToCryptoSelection}
      />
    )

  const isDailyLimitExceeded = props.limits?.max && Number(props.limits.max) === 0

  const max: string = getMaxMin(
    'max',
    props.sbBalances,
    props.orderType,
    props.quote.rate,
    props.pair,
    props.payment,
    props.formValues,
    method,
    props.swapAccount
  )[fix]
  const min: string = getMaxMin(
    'min',
    props.sbBalances,
    props.orderType,
    props.quote.rate,
    props.pair,
    props.payment,
    props.formValues,
    method,
    props.swapAccount
  )[fix]

  // prevent proceed if entered amount is out of limits
  const amountInBounds = isAmountInLimits(
    Number(props.formValues?.amount),
    Number(min),
    Number(max)
  )

  const errorMinMax = props.formValues?.amount
    ? getAmountLimitsError(Number(props.formValues?.amount), Number(min), Number(max))
    : null

  const amountError =
    (typeof props.formErrors.amount === 'string' && props.formErrors.amount) || errorMinMax

  const showError = !props.isPristine && amountError

  const handleMaxClick = () => {
    const maxMin: string = getMaxMin(
      'max',
      props.sbBalances,
      props.orderType,
      props.quote.rate,
      props.pair,
      props.payment,
      props.formValues,
      method,
      props.swapAccount
    )[fix]
    const value = convertStandardToBase(conversionCoinType, maxMin)
    props.buySellActions.handleSellMaxAmountClick({ amount: value, coin: conversionCoinType })
  }

  const handleCustomMinMaxClick = (value: string) => {
    props.buySellActions.handleSellMaxAmountClick({ amount: value, coin: conversionCoinType })
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    if (Number(fontSizeRatio) > 0) {
      setFontRatio(fontSizeRatio > 1 ? 1 : fontSizeRatio)
    }
    const amountRowNode = inputNode.closest('#amount-row')
    const currencyNode = isFiat
      ? amountRowNode.children[0]
      : amountRowNode.children[amountRowNode.children.length - 1]
    currencyNode.style.fontSize = `${fontSizeNumber * fontRatio}px`
  }
  // if user is attempting to send NC ERC20, ensure they have sufficient
  // ETH balance else warn user and disable trade
  const isErc20 = window.coins[cryptoCurrency].coinfig.type.erc20Address
  const isSufficientEthForErc20 =
    props.payment &&
    props.swapAccount?.type === SwapBaseCounterTypes.ACCOUNT &&
    props.orderType === OrderType.SELL &&
    isErc20 &&
    // @ts-ignore
    !props.payment.isSufficientEthForErc20

  const getValue = (value) =>
    fix === 'FIAT'
      ? fiatToString({
          digits,
          unit: fiatCurrency,
          value
        })
      : coinToString({
          unit: { symbol: cryptoCurrency },
          value
        })

  const quoteAmountString =
    fix === 'FIAT'
      ? coinToString({
          unit: { symbol: cryptoCurrency },
          value: quoteAmount
        })
      : fiatToString({ unit: fiatCurrency, value: quoteAmount })

  const effectiveLimit = getEffectiveLimit(crossBorderLimits)
  const effectivePeriod = getEffectivePeriod(crossBorderLimits)

  const showLimitError = showError && amountError === 'ABOVE_MAX_LIMIT'

  const isFundsMethod = method && method.type === BSPaymentTypes.FUNDS

  const { error } = props

  const goBack = () => {
    analyticsActions.trackEvent({
      key: Analytics.SELL_AMOUNT_SCREEN_BACK_CLICKED,
      properties: {}
    })

    props.buySellActions.setStep({
      // Always reset back to walletCurrency
      // Otherwise FUNDS currency and Pairs currency can mismatch
      fiatCurrency: props.fiatCurrency || 'USD',
      step: 'CRYPTO_SELECTION'
    })
  }

  const switchFix = () => {
    analyticsActions.trackEvent({
      key: Analytics.SELL_FIAT_CRYPTO_SWITCHER_CLICKED,
      properties: {}
    })

    props.buySellActions.switchFix({
      amount: fix === 'FIAT' ? props.quote.data.amount : props.quote.data.resultAmount,
      fix: props.preferences[props.orderType].fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO',
      orderType: props.orderType
    })
  }

  if (isNabuError(error)) {
    return <GenericNabuErrorFlyout error={error} onDismiss={clearFormError} />
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
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
            <FormattedMessage id='buttons.sell_now' defaultMessage='Sell Now' />
          </LeftTopCol>
        </TopText>
      </FlyoutWrapper>
      <BaseQuote coin={props.cryptoCurrency} orderType={props.orderType} />

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
            {fix === 'FIAT' && (
              <Text size='56px' color={showError ? 'red400' : 'textBlack'} weight={500}>
                {Currencies[fiatCurrency].units[fiatCurrency].symbol}
              </Text>
            )}
            <Field
              data-e2e='sbAmountInput'
              name='amount'
              component={AmountTextBox}
              validate={[maximumAmount, minimumAmount, checkCrossBorderLimit]}
              normalize={normalizeAmount}
              // eslint-disable-next-line
              onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
              maxFontSize='56px'
              placeholder='0'
              autoComplete='off'
              pointerToLeft
              // leave fiatActive always to avoid 50% width in HOC?
              fiatActive
              haveError={!!showError}
              {...{
                autoFocus: true,
                hideError: true
              }}
            />
            {fix === 'CRYPTO' && (
              <Text size='56px' color={showError ? 'red400' : 'textBlack'} weight={500}>
                {cryptoCurrency}
              </Text>
            )}
          </AmountRow>
          <QuoteActionContainer>
            <QuoteRow>
              <div />
              <Text
                color={showError ? 'red400' : 'grey600'}
                size='14px'
                weight={500}
                data-e2e='sbQuoteAmount'
              >
                {!props.quote.isFailed && quoteAmountString}
              </Text>
              <Icon
                color='blue600'
                cursor
                name='up-down-chevron'
                onClick={switchFix}
                role='button'
                size='24px'
                data-e2e='sbSwitchIcon'
              />
            </QuoteRow>
          </QuoteActionContainer>
        </LiftedActions>
        <AnchoredActions>
          {props.pair && (
            <Amounts>
              <MaxAvailableWrapper orderType={orderType}>
                {orderType === OrderType.SELL && (
                  <ActionsItem>
                    <Text color='grey600' size='14px' weight={500}>
                      <FormattedMessage id='copy.available' defaultMessage='Available' />
                    </Text>
                    <Text color='grey900' weight={600}>
                      {getValue(max)}
                    </Text>
                  </ActionsItem>
                )}

                <CartridgeWrapper onClick={handleMaxClick}>
                  <Cartridge error={amountError === 'ABOVE_MAX'}>
                    <FormattedMessage
                      id='modals.simplebuy.checkout.maxsell'
                      defaultMessage='Sell Max'
                    />
                  </Cartridge>
                </CartridgeWrapper>
              </MaxAvailableWrapper>
            </Amounts>
          )}
          {paymentErrorCard}
          <Payment {...props} method={method} />
          {props.error && (
            <Banner type='warning' style={{ marginBottom: '15px' }}>
              {isLimitError(props.error) && props.userData?.tiers?.current < 2 ? (
                <div
                  onClick={() =>
                    props.identityVerificationActions.verifyIdentity({
                      needMoreInfo: false,
                      origin: 'BuySell',
                      tier: 2
                    })
                  }
                  onKeyDown={() =>
                    props.identityVerificationActions.verifyIdentity({
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
                    <ErrorCodeMappings code={props.error} />
                    <br />
                    <FormattedMessage id='copy.upgrade' defaultMessage='Upgrade to Gold' />
                  </>
                </div>
              ) : (
                <ErrorCodeMappings code={props.error} />
              )}
            </Banner>
          )}
          {!showLimitError && !showError && isPaymentMethodBlocked === false && (
            <ActionButton
              {...props}
              isSufficientEthForErc20={isSufficientEthForErc20 || false}
              isDailyLimitExceeded={isDailyLimitExceeded || false}
              isAmountInBounds={amountInBounds}
            />
          )}
          {paymentErrorButton}
          {!showLimitError && showError && (
            <ButtonContainer>
              <AlertButton onClick={handleMaxClick}>
                <FormattedMessage
                  id='copy.not_enough_coin'
                  defaultMessage='Not Enough {coin}'
                  values={{
                    coin: cryptoCurrency
                  }}
                />
              </AlertButton>

              <Text
                size='14px'
                color='textBlack'
                weight={500}
                style={{ marginTop: '24px', textAlign: 'center' }}
              >
                {amountError === 'BELOW_MIN' && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.sell.belowmin'
                    defaultMessage='To offset fees and market volatility, the minimum amount for any sell is {amount} {currency}.'
                    values={{
                      amount:
                        fix === 'FIAT'
                          ? fiatToString({ unit: props.fiatCurrency, value: min })
                          : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`,
                      currency: fiatCurrency
                    }}
                  />
                )}

                {amountError === 'ABOVE_MAX' && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.sell.abovemax'
                    defaultMessage='The maximum amount of {coin} you can sell from this account is {amount}.'
                    values={{
                      amount:
                        fix === 'FIAT'
                          ? fiatToString({ unit: props.fiatCurrency, value: max })
                          : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`,
                      coin: cryptoCurrency
                    }}
                  />
                )}

                {amountError === 'ABOVE_BALANCE' && effectiveLimit && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.over_balance'
                    defaultMessage='Swapping from Trade Accounts cannot exceed {limit} a {period}. You have {currency}{amount} remaining.'
                    values={{
                      amount:
                        fix === 'FIAT'
                          ? fiatToString({ unit: props.fiatCurrency, value: max })
                          : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`,
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
                      amount:
                        fix === 'FIAT'
                          ? fiatToString({ unit: props.fiatCurrency, value: max })
                          : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`
                    }}
                  />
                )}
                {amountError === 'ABOVE_BALANCE' && isFundsMethod && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.abovemax'
                    defaultMessage='The maximum amount of {coin} you can buy with your {currency} {amount}'
                    values={{
                      amount:
                        fix === 'FIAT'
                          ? fiatToString({ unit: props.fiatCurrency, value: max })
                          : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`,
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
                <FormattedMessage
                  id='copy.not_enough_coin'
                  defaultMessage='Not Enough {coin}'
                  values={{ coin: cryptoCurrency }}
                />
              </AlertButton>
              <FormattedMessage
                id='modals.simplebuy.checkout.sell_max_amount'
                defaultMessage='You can buy up to {amount} per transaction. Get full access & buy larger amounts with your bank or card.'
                values={{
                  amount: formatFiat(convertBaseToStandard('FIAT', effectiveLimit.limit.value), 0),
                  coin: cryptoCurrency
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
      {isSufficientEthForErc20 && (
        <Banner type='warning'>
          <FormattedMessage
            id='copy.not_enough_eth1'
            defaultMessage='ETH is required to send {coin}. You do not have enough ETH in your Ether Wallet to perform a transaction. Note, ETH must be held in your Ether Wallet for this transaction, not Ether Trading Account.'
            values={{
              coin: cryptoCurrency
            }}
          />
        </Banner>
      )}
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
    preferences: {
      [key in BSOrderActionType]: {
        fix: BSFixType
      }
    }
  }

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: FORM_BS_CHECKOUT
})(Success)
