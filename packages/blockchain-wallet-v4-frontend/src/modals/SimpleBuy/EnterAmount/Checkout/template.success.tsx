import React, { ReactChild, useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Interest/DepositForm/model'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Banner, Icon, Text } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { coinToString, fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  CoinType,
  OrderType,
  SBPaymentMethodType,
  SBPaymentTypes
} from 'blockchain-wallet-v4/src/types'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper, getPeriodTitleText } from 'components/Flyout'
import { Form } from 'components/Form'
import { model } from 'data'
import { convertStandardToBase } from 'data/components/exchange/services'
import { SBCheckoutFormValuesType, SwapBaseCounterTypes } from 'data/types'
import { CRYPTO_DECIMALS, FIAT_DECIMALS, formatTextAmount } from 'services/forms'

import Scheduler from '../../../RecurringBuys/Scheduler'
import { Row } from '../../../Swap/EnterAmount/Checkout'
import CryptoItem from '../../CryptoSelection/CryptoSelector/CryptoItem'
import { BuyOrSell, ErrorCodeMappings } from '../../model'
import Failure from '../template.failure'
import { Props as OwnProps, SuccessStateType } from '.'
import ActionButton from './ActionButton'
import IncreaseLimits from './IncreaseLimits'
import Payment from './Payment'
import { formatQuote, getMaxMin, getQuote, maximumAmount, minimumAmount } from './validation'

const { LIMIT, LIMIT_FACTOR } = model.components.simpleBuy

const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
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
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 32px;
  margin-top: 16px;
`
const ActionsItem = styled.div`
  display: flex;
  flex-direction: column;
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

const normalizeAmount = (value, prevValue, allValues: SBCheckoutFormValuesType) => {
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
    cryptoCurrency,
    defaultMethod,
    fiatCurrency,
    method: selectedMethod,
    orderType
  } = props
  const [fontRatio, setRatio] = useState(1)
  const setOrderFrequncy = useCallback(() => {
    props.simpleBuyActions.setStep({ step: 'FREQUENCY' })
  }, [])
  const isSddBuy = props.isSddFlow && props.orderType === 'BUY'

  let method = selectedMethod || defaultMethod
  if (isSddBuy && cards && cards.length === 1) {
    const card = cards[0]

    const defaultCardMethod = props.paymentMethods.methods.find(
      (m) => m.type === SBPaymentTypes.PAYMENT_CARD && orderType === 'BUY'
    )
    method = {
      ...card,
      card: card.card,
      currency: card.currency,
      limits:
        defaultCardMethod && defaultCardMethod.limits
          ? defaultCardMethod.limits
          : { max: '10000', min: '500' },
      type: SBPaymentTypes.USER_CARD
    } as SBPaymentMethodType
  }

  const { fix } = props.preferences[props.orderType]
  const digits = fix === 'FIAT' ? FIAT_DECIMALS : CRYPTO_DECIMALS
  const baseCurrency = fix === 'FIAT' ? fiatCurrency : cryptoCurrency
  const conversionCoinType: 'FIAT' | CoinType = fix === 'FIAT' ? 'FIAT' : cryptoCurrency

  const quoteAmt = getQuote(props.pair.pair, props.quote.rate, fix, props.formValues?.amount)

  if (!props.formValues) return null
  if (!fiatCurrency || !baseCurrency)
    return <Failure fiatCurrency={props.fiatCurrency} simpleBuyActions={props.simpleBuyActions} />

  const limits = props.sddLimit || LIMIT
  const sddLimit = { ...limits }

  const isDailyLimitExceeded = props.limits?.max && Number(props.limits.max) === 0

  const max: string = getMaxMin(
    'max',
    props.sbBalances,
    props.orderType,
    props.quote,
    props.pair,
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

  const handleMinMaxClick = () => {
    const prop = amtError === 'BELOW_MIN' ? 'min' : 'max'
    const maxMin: string = getMaxMin(
      prop,
      props.sbBalances,
      props.orderType,
      props.quote,
      props.pair,
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
        props.simpleBuyActions.handleSellMinAmountClick(value, conversionCoinType)
      } else if (props.orderType === OrderType.BUY) {
        props.simpleBuyActions.handleBuyMinAmountClick(value, conversionCoinType)
      }
    }

    if (prop === 'max') {
      if (props.orderType === OrderType.SELL) {
        props.simpleBuyActions.handleSellMaxAmountClick(value, conversionCoinType)
      } else if (props.orderType === OrderType.BUY) {
        props.simpleBuyActions.handleBuyMaxAmountClick(value, conversionCoinType)
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
      props.simpleBuyActions.handleSellMaxAmountClick(value, conversionCoinType)
    } else if (props.orderType === OrderType.BUY) {
      props.simpleBuyActions.handleBuyMaxAmountClick(value, conversionCoinType)
    }
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    if (Number(fontSizeRatio) > 0) {
      setRatio(fontSizeRatio > 1 ? 1 : fontSizeRatio)
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
                props.simpleBuyActions.setStep({
                  // Always reset back to walletCurrency
                  // Otherwise FUNDS currency and Pairs currency can mismatch
                  fiatCurrency: props.walletCurrency || 'USD',

                  step: 'CRYPTO_SELECTION'
                })
              }
            />
            <BuyOrSell {...props} crypto={cryptoCurrency || 'Crypto'} />
          </LeftTopCol>
        </TopText>
      </FlyoutWrapper>
      <CryptoItem
        fiat={props.fiatCurrency || 'USD'}
        coin={props.cryptoCurrency}
        orderType={props.orderType}
        account={props.swapAccount}
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
          <AmountRow id='amount-row'>
            {fix === 'FIAT' && (
              <Text size='56px' color='textBlack' weight={500}>
                {Currencies[fiatCurrency].units[fiatCurrency].symbol}
              </Text>
            )}
            <Field
              data-e2e='sbAmountInput'
              name='amount'
              component={AmountTextBox}
              validate={[maximumAmount, minimumAmount]}
              normalize={normalizeAmount}
              // eslint-disable-next-line
              onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
              maxFontSize='56px'
              placeholder='0'
              // leave fiatActive always to avoid 50% width in HOC?
              fiatActive
              {...{
                autoFocus: true,
                hideError: true
              }}
            />
            {fix === 'CRYPTO' && (
              <Text size='56px' color='textBlack' weight={500}>
                {cryptoCurrency}
              </Text>
            )}
          </AmountRow>
          <QuoteActionContainer>
            {props.isSddFlow && props.orderType === 'BUY' && amtError === 'BELOW_MIN' ? (
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
                <Text color='grey600' size='14px' weight={500} data-e2e='sbQuoteAmount'>
                  {formatQuote(quoteAmt, props.pair.pair, fix)}
                </Text>
                <Icon
                  color='blue600'
                  cursor
                  name='up-down-chevron'
                  onClick={() =>
                    props.simpleBuyActions.switchFix(
                      quoteAmt,
                      props.orderType,
                      props.preferences[props.orderType].fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO'
                    )
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

          {(!props.isSddFlow || props.orderType === OrderType.SELL) &&
            props.pair &&
            Number(min) <= Number(max) && (
              <Amounts onClick={handleMinMaxClick}>
                <>
                  {amtError === 'BELOW_MIN' ? (
                    <GreyBlueCartridge role='button' data-e2e='sbEnterAmountMin'>
                      <FormattedMessage
                        id='modals.simplebuy.checkout.belowmin'
                        defaultMessage='{value} Minimum {orderType}'
                        values={{
                          orderType: props.orderType === OrderType.BUY ? 'Buy' : 'Sell',
                          value: getValue(min)
                        }}
                      />
                    </GreyBlueCartridge>
                  ) : (
                    <Cartridge error={amtError === 'ABOVE_MAX'}>
                      <FormattedMessage
                        id='modals.simplebuy.checkout.maxbuysell'
                        defaultMessage='{orderType} Max'
                        values={{
                          orderType: orderType === OrderType.BUY ? 'Buy' : 'Sell'
                        }}
                      />
                    </Cartridge>
                  )}
                </>
              </Amounts>
            )}
          {!props.isSddFlow &&
            props.orderType === OrderType.SELL &&
            props.pair &&
            Number(min) > Number(max) && (
              <Amounts>
                <GreyBlueCartridge role='button' data-e2e='sbEnterAmountNotEnoughFundsForSell'>
                  <FormattedMessage
                    id='modals.simplebuy.checkout.not_enough_funds_for_sell'
                    defaultMessage='Not Enough funds for Sell'
                  />
                </GreyBlueCartridge>
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
                  <Cartridge error={amtError === 'ABOVE_MAX'}>
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
                      origin: 'SimpleBuy',
                      tier: 2
                    })
                  }
                  onKeyDown={() =>
                    props.identityVerificationActions.verifyIdentity({
                      needMoreInfo: false,
                      origin: 'SimpleBuy',
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
          <ActionButton
            {...props}
            isSufficientEthForErc20={isSufficientEthForErc20 || false}
            isDailyLimitExceeded={isDailyLimitExceeded || false}
            isAmountInBounds={amountInBounds}
          />

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
  form: 'simpleBuyCheckout'
})(Success)
