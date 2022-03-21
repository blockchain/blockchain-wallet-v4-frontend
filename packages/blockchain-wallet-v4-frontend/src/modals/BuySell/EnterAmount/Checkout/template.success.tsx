import React, { ReactChild, useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Interest/DepositForm/model'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { coinToString, fiatToString, formatCoin, formatFiat } from '@core/exchange/utils'
import {
  BSOrderActionType,
  BSPaymentMethodType,
  BSPaymentTypes,
  CoinType,
  OrderType
} from '@core/types'
import { Banner, Icon, Text } from 'blockchain-info-components'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import UpgradeToGoldLine, { Flows } from 'components/Flyout/Banners/UpgradeToGoldLine'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { getPeriodTitleText } from 'components/Flyout/model'
import { Form } from 'components/Form'
import { model } from 'data'
import { convertBaseToStandard, convertStandardToBase } from 'data/components/exchange/services'
import { BSCheckoutFormValuesType, SwapBaseCounterTypes } from 'data/types'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'
import { CRYPTO_DECIMALS, FIAT_DECIMALS, formatTextAmount } from 'services/forms'

import { AlertButton } from '../../../components'
import Scheduler from '../../../RecurringBuys/Scheduler'
import { Row } from '../../../Swap/EnterAmount/Checkout'
import CryptoItem from '../../CryptoSelection/CryptoSelector/CryptoItem'
import { ErrorCodeMappings } from '../../model'
import { Props as OwnProps, SuccessStateType } from '.'
import ActionButton from './ActionButton'
import IncreaseLimits from './IncreaseLimits'
import Payment from './Payment'
import {
  checkCrossBorderLimit,
  formatQuote,
  getBuyQuote,
  getMaxMin,
  getQuote,
  maximumAmount,
  minimumAmount
} from './validation'

const { FORM_BS_CHECKOUT, LIMIT, LIMIT_FACTOR } = model.components.buySell

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
const QuoteActionContainer = styled.div`
  height: 32px;
`
const ErrorAmountContainer = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
`
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  margin-top: 16px;
`
const ActionsItem = styled.div`
  display: flex;
  flex-direction: column;
`

const MaxAvailableWrapper = styled.div<{ orderType: BSOrderActionType }>`
  width: 100%;
  display: flex;
  justify-content: ${({ orderType }) => (orderType === OrderType.BUY ? 'center' : 'space-between')};
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
    cards,
    crossBorderLimits,
    cryptoCurrency,
    defaultMethod,
    fiatCurrency,
    method: selectedMethod,
    orderType
  } = props

  const [fontRatio, setFontRatio] = useState(1)
  const setOrderFrequncy = useCallback(() => {
    props.buySellActions.setStep({ step: 'FREQUENCY' })
  }, [props.buySellActions])

  const errorCallback = useCallback(() => {
    props.buySellActions.setStep({
      fiatCurrency: props.fiatCurrency || 'USD',
      step: 'CRYPTO_SELECTION'
    })
  }, [props.fiatCurrency, props.buySellActions])

  const isSddBuy = props.isSddFlow && props.orderType === OrderType.BUY

  let method = selectedMethod || defaultMethod
  if (isSddBuy && cards && cards.length === 1) {
    const card = cards[0]

    const defaultCardMethod = props.paymentMethods.methods.find(
      (m) => m.type === BSPaymentTypes.PAYMENT_CARD && orderType === OrderType.BUY
    )
    method = {
      ...card,
      card: card.card,
      currency: card.currency,
      limits:
        defaultCardMethod && defaultCardMethod.limits
          ? defaultCardMethod.limits
          : { max: '10000', min: '500' },
      type: BSPaymentTypes.USER_CARD
    } as BSPaymentMethodType
  }

  const { fix } = props.preferences[props.orderType]
  const digits = fix === 'FIAT' ? FIAT_DECIMALS : CRYPTO_DECIMALS
  const baseCurrency = fix === 'FIAT' ? fiatCurrency : cryptoCurrency
  const conversionCoinType: 'FIAT' | CoinType = fix === 'FIAT' ? 'FIAT' : cryptoCurrency

  // TODO: Remove this ordertype check when flexible pricing is implemented for SELL
  const quoteAmt =
    props.isFlexiblePricingModel && props.orderType === OrderType.BUY
      ? getBuyQuote(props.pair?.pair, props.quote.rate, fix, props.formValues?.amount)
      : getQuote(props.pair?.pair, props.quote.rate, fix, props.formValues?.amount)

  if (!props.formValues) return null
  if (!fiatCurrency || !baseCurrency)
    return (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={errorCallback}
      />
    )

  const limits = props.sddLimit || LIMIT
  const sddLimit = { ...limits }

  const isDailyLimitExceeded = props.limits?.max && Number(props.limits.max) === 0

  const max: string = getMaxMin(
    'max',
    props.sbBalances,
    props.orderType,
    props.quote,
    props.pair,
    props.isFlexiblePricingModel,
    props.payment,
    props.formValues,
    method,
    props.swapAccount,
    props.isSddFlow,
    sddLimit,
    props.limits
  )[fix]
  const min: string = getMaxMin(
    'min',
    props.sbBalances,
    props.orderType,
    props.quote,
    props.pair,
    props.isFlexiblePricingModel,
    props.payment,
    props.formValues,
    method,
    props.swapAccount,
    props.isSddFlow,
    sddLimit,
    props.limits
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

  const amtError =
    (typeof props.formErrors.amount === 'string' && props.formErrors.amount) || errorMinMax

  const showError = !props.isPristine && amtError

  const handleMinMaxClick = () => {
    const prop = amtError === 'BELOW_MIN' ? 'min' : 'max'
    const maxMin: string = getMaxMin(
      prop,
      props.sbBalances,
      props.orderType,
      props.quote,
      props.pair,
      props.isFlexiblePricingModel,
      props.payment,
      props.formValues,
      method,
      props.swapAccount,
      props.isSddFlow,
      sddLimit,
      props.limits
    )[fix]
    const value = convertStandardToBase(conversionCoinType, maxMin)
    if (prop === 'min') {
      if (props.orderType === OrderType.SELL) {
        props.buySellActions.handleSellMinAmountClick({ amount: value, coin: conversionCoinType })
      } else if (props.orderType === OrderType.BUY) {
        props.buySellActions.handleBuyMinAmountClick({ amount: value, coin: conversionCoinType })
      }
    }

    if (prop === 'max') {
      if (props.orderType === OrderType.SELL) {
        props.buySellActions.handleSellMaxAmountClick({ amount: value, coin: conversionCoinType })
      } else if (props.orderType === OrderType.BUY) {
        props.buySellActions.handleBuyMaxAmountClick({ amount: value, coin: conversionCoinType })
      }
    }
  }
  const handleMaxClick = () => {
    const maxMin: string = getMaxMin(
      'max',
      props.sbBalances,
      props.orderType,
      props.quote,
      props.pair,
      props.isFlexiblePricingModel,
      props.payment,
      props.formValues,
      method,
      props.swapAccount,
      props.isSddFlow,
      sddLimit,
      props.limits
    )[fix]
    const value = convertStandardToBase(conversionCoinType, maxMin)
    if (props.orderType === OrderType.SELL) {
      props.buySellActions.handleSellMaxAmountClick({ amount: value, coin: conversionCoinType })
    } else if (props.orderType === OrderType.BUY) {
      props.buySellActions.handleBuyMaxAmountClick({ amount: value, coin: conversionCoinType })
    }
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
  const limit = Number(props.sddLimit.max) / LIMIT_FACTOR
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

  const effectiveLimit = getEffectiveLimit(crossBorderLimits)
  const effectivePeriod = getEffectivePeriod(crossBorderLimits)

  const showLimitError = showError && amtError === 'ABOVE_MAX_LIMIT'

  const isFundsMethod = method && method.type === BSPaymentTypes.FUNDS
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
              onClick={() =>
                props.buySellActions.setStep({
                  // Always reset back to walletCurrency
                  // Otherwise FUNDS currency and Pairs currency can mismatch
                  fiatCurrency: props.walletCurrency || 'USD',
                  step: 'CRYPTO_SELECTION'
                })
              }
            />
            <FormattedMessage
              id='buttons.buy_sell_now'
              defaultMessage='{orderType} Now'
              values={{ orderType: props.orderType === OrderType.BUY ? 'Buy' : 'Sell' }}
            />
          </LeftTopCol>
        </TopText>
      </FlyoutWrapper>
      <CryptoItem
        fiat={props.fiatCurrency || 'USD'}
        coin={props.cryptoCurrency}
        orderType={props.orderType}
      />
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
              isFlexiblePricingModel={props.isFlexiblePricingModel}
              // eslint-disable-next-line
              onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
              maxFontSize='56px'
              placeholder='0'
              autoComplete='off'
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
            {props.isSddFlow && props.orderType === OrderType.BUY && amtError === 'BELOW_MIN' ? (
              <ErrorAmountContainer onClick={handleMinMaxClick}>
                <GreyBlueCartridge role='button' data-e2e='sbEnterAmountMin'>
                  <FormattedMessage
                    id='modals.simplebuy.checkout.belowmin'
                    defaultMessage='{value} Minimum {orderType}'
                    values={{
                      orderType: 'Buy',
                      value: getValue(min)
                    }}
                  />
                </GreyBlueCartridge>
              </ErrorAmountContainer>
            ) : (
              <QuoteRow>
                <div />
                <Text
                  color={showError ? 'red400' : 'grey600'}
                  size='14px'
                  weight={500}
                  data-e2e='sbQuoteAmount'
                >
                  {formatQuote(quoteAmt, props.pair.pair, fix)}
                </Text>
                <Icon
                  color='blue600'
                  cursor
                  name='up-down-chevron'
                  onClick={() =>
                    props.buySellActions.switchFix({
                      amount: fix === 'FIAT' ? formatCoin(quoteAmt, 0, CRYPTO_DECIMALS) : quoteAmt, // format crypto amount to 8 digits
                      fix: props.preferences[props.orderType].fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO',
                      orderType: props.orderType
                    })
                  }
                  role='button'
                  size='24px'
                  data-e2e='sbSwitchIcon'
                />
              </QuoteRow>
            )}
          </QuoteActionContainer>
        </LiftedActions>
        <AnchoredActions>
          {props.isRecurringBuy &&
            props.formValues.period &&
            !props.isSddFlow &&
            props.orderType === OrderType.BUY && (
              <Scheduler
                onClick={setOrderFrequncy}
                period={props.formValues.period}
                method={method || props.defaultMethod}
              >
                {getPeriodTitleText(props.formValues.period)}
              </Scheduler>
            )}
          {(!props.isSddFlow || props.orderType === OrderType.SELL) && props.pair && (
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

                <CartridgeWrapper onClick={handleMinMaxClick}>
                  <Cartridge error={amtError === 'ABOVE_MAX'}>
                    {/* If amount is 0 or below min show the min amount button before the max sell button */}
                    {amtError === 'BELOW_MIN' ? (
                      <FormattedMessage
                        id='modals.simplebuy.checkout.belowmin'
                        defaultMessage='{value} Minimum {orderType}'
                        values={{
                          orderType: props.orderType === OrderType.BUY ? 'Buy' : 'Sell',
                          value: getValue(min)
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id='modals.simplebuy.checkout.maxbuysell'
                        defaultMessage='{orderType} Max'
                        values={{
                          orderType: orderType === OrderType.BUY ? 'Buy' : 'Sell'
                        }}
                      />
                    )}
                  </Cartridge>
                </CartridgeWrapper>
              </MaxAvailableWrapper>
            </Amounts>
          )}
          {props.isSddFlow && props.orderType === OrderType.BUY && (
            <ActionsRow>
              <ActionsItem>
                <Text weight={500} size='14px' color='grey600'>
                  <FormattedMessage
                    id='modals.simplebuy.checkout.max_card_limit'
                    defaultMessage='Max Card Limit'
                  />
                </Text>
                <div>
                  <Text
                    weight={600}
                    size='16px'
                    color='grey900'
                  >{`${Currencies[fiatCurrency].units[fiatCurrency].symbol}${limit}`}</Text>
                </div>
              </ActionsItem>
              <ActionsItem>
                <div onClick={handleMaxClick} onKeyDown={handleMaxClick} role='button' tabIndex={0}>
                  <Cartridge
                    error={
                      amtError === 'ABOVE_MAX' ||
                      amtError === 'ABOVE_BALANCE' ||
                      amtError === 'ABOVE_LIMIT'
                    }
                  >
                    <FormattedMessage
                      id='modals.simplebuy.checkout.maxbuy'
                      defaultMessage='Max Buy'
                    />
                  </Cartridge>
                </div>
              </ActionsItem>
            </ActionsRow>
          )}
          <Payment
            {...props}
            method={method}
            isSddFlow={props.isSddFlow && props.orderType === OrderType.BUY}
          />
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
          {!showLimitError && !showError && (
            <ActionButton
              {...props}
              isSufficientEthForErc20={isSufficientEthForErc20 || false}
              isDailyLimitExceeded={isDailyLimitExceeded || false}
              isAmountInBounds={amountInBounds}
            />
          )}

          {!showLimitError && showError && (
            <ButtonContainer>
              <AlertButton>
                {props.orderType === OrderType.BUY ? (
                  amtError === 'BELOW_MIN' ? (
                    <FormattedMessage
                      id='copy.below_min'
                      defaultMessage='{amount} Minimum'
                      values={{
                        amount:
                          fix === 'FIAT'
                            ? fiatToString({ unit: props.fiatCurrency, value: min })
                            : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`
                      }}
                    />
                  ) : amtError === 'ABOVE_LIMIT' ||
                    (amtError === 'ABOVE_BALANCE' && !isFundsMethod) ? (
                    <FormattedMessage id='copy.over_your_limit' defaultMessage='Over Your Limit' />
                  ) : amtError === 'ABOVE_BALANCE' && isFundsMethod ? (
                    <FormattedMessage
                      id='copy.not_enough_coin'
                      defaultMessage='Not Enough {coin}'
                      values={{
                        coin: props.fiatCurrency
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id='copy.above_max'
                      defaultMessage='{amount} Maximum'
                      values={{
                        amount:
                          fix === 'FIAT'
                            ? fiatToString({ unit: props.fiatCurrency, value: max })
                            : `${max} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`
                      }}
                    />
                  )
                ) : null}

                {props.orderType === OrderType.SELL && (
                  <FormattedMessage
                    id='copy.not_enough_coin'
                    defaultMessage='Not Enough {coin}'
                    values={{
                      coin: cryptoCurrency
                    }}
                  />
                )}
              </AlertButton>

              <Text
                size='14px'
                color='textBlack'
                weight={500}
                style={{ marginTop: '24px', textAlign: 'center' }}
              >
                {amtError === 'BELOW_MIN' &&
                  (props.orderType === OrderType.BUY ? (
                    <FormattedMessage
                      id='modals.simplebuy.checkout.buy.belowmin'
                      defaultMessage='To offset fees and market volatility, the minimum amount for any buy is {amount} {currency}.'
                      values={{
                        amount:
                          fix === 'FIAT'
                            ? fiatToString({ unit: props.fiatCurrency, value: min })
                            : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`,
                        currency: fiatCurrency
                      }}
                    />
                  ) : (
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
                  ))}

                {amtError === 'ABOVE_MAX' &&
                  (props.orderType === OrderType.BUY ? (
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
                  ) : (
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
                  ))}

                {amtError === 'ABOVE_BALANCE' && effectiveLimit && (
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
                {(amtError === 'ABOVE_LIMIT' ||
                  (amtError === 'ABOVE_BALANCE' && !isFundsMethod)) && (
                  <FormattedMessage
                    id='modals.simplebuy.checkout.buy.over_limit'
                    defaultMessage='You can buy up to {amount} per transaction. Upgrade to Gold & buy larger amounts with your bank or card.'
                    values={{
                      amount:
                        fix === 'FIAT'
                          ? fiatToString({ unit: props.fiatCurrency, value: max })
                          : `${min} ${Currencies[fiatCurrency].units[fiatCurrency].symbol}`
                    }}
                  />
                )}
                {amtError === 'ABOVE_BALANCE' && isFundsMethod && (
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
          {showLimitError &&
            effectiveLimit &&
            (props.orderType === OrderType.BUY ? (
              <>
                <AlertButton>
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
            ) : (
              <>
                <AlertButton>
                  <FormattedMessage
                    id='copy.not_enough_coin'
                    defaultMessage='Not Enough {coin}'
                    values={{ coin: cryptoCurrency }}
                  />
                </AlertButton>
                <FormattedMessage
                  id='modals.simplebuy.checkout.sellmaxamount'
                  defaultMessage='The maximum amount of {coin} you can sell from this account is {amount}'
                  values={{
                    amount: formatFiat(
                      convertBaseToStandard('FIAT', effectiveLimit.limit.value),
                      0
                    ),
                    coin: cryptoCurrency
                  }}
                />
              </>
            ))}
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

      {props.isSddFlow && props.orderType === OrderType.BUY && <IncreaseLimits {...props} />}
      {(props.isSddFlow ||
        (amtError === 'ABOVE_BALANCE' && !isFundsMethod) ||
        amtError === 'ABOVE_LIMIT') &&
        props.orderType === OrderType.BUY && (
          <FlyoutWrapper>
            <UpgradeToGoldLine
              type={Flows.BUY}
              verifyIdentity={() =>
                props.identityVerificationActions.verifyIdentity({
                  needMoreInfo: false,
                  origin: 'BuySell',
                  tier: 2
                })
              }
            />
          </FlyoutWrapper>
        )}

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

export type Props = OwnProps & SuccessStateType

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: FORM_BS_CHECKOUT
})(Success)
