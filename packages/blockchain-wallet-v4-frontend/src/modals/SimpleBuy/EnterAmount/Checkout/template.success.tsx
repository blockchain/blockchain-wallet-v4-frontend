import React, { ReactChild, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import {
  coinToString,
  fiatToString,
} from 'blockchain-wallet-v4/src/exchange/currency'
import {
  CoinType,
  OrderType,
  SBPaymentMethodType,
} from 'blockchain-wallet-v4/src/types'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import { model } from 'data'
import { convertStandardToBase } from 'data/components/exchange/services'
import { SBCheckoutFormValuesType } from 'data/types'
import {
  CRYPTO_DECIMALS,
  FIAT_DECIMALS,
  formatTextAmount,
} from 'services/forms'

import { Row } from '../../../Swap/EnterAmount/Checkout'
import CryptoItem from '../../CryptoSelection/CryptoSelector/CryptoItem'
import { BuyOrSell } from '../../model'
import Failure from '../template.failure'
import { Props as OwnProps, SuccessStateType } from '.'
import ActionButton from './ActionButton'
import IncreaseLimits from './IncreaseLimits'
import Payment from './Payment'
import {
  formatQuote,
  getMaxMin,
  getQuote,
  maximumAmount,
  minimumAmount,
} from './validation'

const { LIMIT, LIMIT_FACTOR } = model.components.simpleBuy

const DAILY_LIMIT_MESSAGE = 'User exceeded daily trading limit'
const WEEKLY_LIMIT_MESSAGE = 'User exceeded weekly trading limit'
const ANNUAL_LIMIT_MESSAGE = 'User exceeded annual trading limit'

const isLimitError = (error: string) =>
  error === DAILY_LIMIT_MESSAGE ||
  error === WEEKLY_LIMIT_MESSAGE ||
  error === ANNUAL_LIMIT_MESSAGE

const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
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
  margin: 56px 0 24px 0;
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
const CustomBlueCartridge = styled(BlueCartridge)`
  border: 1px solid ${(props) => props.theme.blue000};
  cursor: pointer;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  border: 1px solid ${(props) => props.theme.red000};
  cursor: pointer;
`
const ErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin-left: 40px;
  margin-right: 40px;
`
const ErrorText = styled(Text)`
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.red000};
  color: ${(props) => props.theme.red800};
  margin-bottom: 16px;
  > div {
    cursor: pointer;
  }
`

const BlueRedCartridge = ({
  children,
  error,
}: {
  children: ReactChild
  error: boolean
}) => {
  if (error)
    return (
      <CustomErrorCartridge role='button' data-e2e='sbEnterAmountMaxError'>
        {children}
      </CustomErrorCartridge>
    )
  return (
    <CustomBlueCartridge role='button' data-e2e='sbEnterAmountMax'>
      {children}
    </CustomBlueCartridge>
  )
}

const normalizeAmount = (
  value,
  prevValue,
  allValues: SBCheckoutFormValuesType
) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, allValues && allValues.fix === 'FIAT')
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const {
    cards,
    cryptoCurrency,
    defaultMethod,
    fiatCurrency,
    method: selectedMethod,
    orderType,
  } = props
  const [fontRatio, setRatio] = useState(1)

  const isSddBuy = props.isSddFlow && props.orderType === 'BUY'

  let method = selectedMethod || defaultMethod
  if (isSddBuy && cards && cards.length === 1) {
    const card = cards[0]

    const defaultCardMethod = props.paymentMethods.methods.find(
      (m) => m.type === 'PAYMENT_CARD' && orderType === 'BUY'
    )
    method = {
      ...card,
      card: card.card,
      type: 'USER_CARD',
      currency: card.currency,
      limits:
        defaultCardMethod && defaultCardMethod.limits
          ? defaultCardMethod.limits
          : { min: '500', max: '10000' },
    } as SBPaymentMethodType
  }

  const fix = props.preferences[props.orderType].fix
  const digits = fix === 'FIAT' ? FIAT_DECIMALS : CRYPTO_DECIMALS
  const baseCurrency = fix === 'FIAT' ? fiatCurrency : cryptoCurrency
  const conversionCoinType: 'FIAT' | CoinType =
    fix === 'FIAT' ? 'FIAT' : cryptoCurrency

  const quoteAmt = getQuote(
    props.pair.pair,
    props.quote.rate,
    fix,
    props.formValues?.amount
  )

  if (!props.formValues) return null
  if (!fiatCurrency || !baseCurrency)
    return (
      <Failure
        fiatCurrency={props.fiatCurrency}
        simpleBuyActions={props.simpleBuyActions}
      />
    )

  const amtError =
    typeof props.formErrors.amount === 'string' && props.formErrors.amount

  const limits = props.sddLimit || LIMIT
  const sddLimit = { ...limits }

  const isDailyLimitExceeded =
    props.limits?.daily?.available && Number(props.limits.daily.available) === 0

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
    props.simpleBuyActions.handleSBSuggestedAmountClick(
      value,
      conversionCoinType
    )
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
    props.simpleBuyActions.handleSBSuggestedAmountClick(
      value,
      conversionCoinType
    )
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
  const isErc20 = props.supportedCoins[cryptoCurrency].contractAddress
  const isSufficientEthForErc20 =
    props.payment &&
    props.swapAccount?.type === 'ACCOUNT' &&
    props.orderType === OrderType.SELL &&
    isErc20 &&
    // @ts-ignore
    !props.payment.isSufficientEthForErc20

  const getValue = (value) =>
    fix === 'FIAT'
      ? fiatToString({
          digits,
          unit: fiatCurrency,
          value,
        })
      : coinToString({
          value,
          unit: { symbol: cryptoCurrency },
        })

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper style={{ paddingBottom: '0px', borderBottom: 'grey000' }}>
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
                  step: 'CRYPTO_SELECTION',
                  // Always reset back to walletCurrency
                  // Otherwise FUNDS currency and Pairs currency can mismatch
                  fiatCurrency: props.walletCurrency || 'USD',
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
      <FlyoutWrapper style={{ paddingTop: '0px' }}>
        <AmountRow id='amount-row'>
          {fix === 'FIAT' && (
            <Text size={'56px'} color='textBlack' weight={500}>
              {Currencies[fiatCurrency].units[fiatCurrency].symbol}
            </Text>
          )}
          <Field
            data-e2e='sbAmountInput'
            name='amount'
            component={AmountTextBox}
            validate={[maximumAmount, minimumAmount]}
            normalize={normalizeAmount}
            onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
            maxFontSize='56px'
            placeholder='0'
            // leave fiatActive always to avoid 50% width in HOC?
            fiatActive
            {...{
              autoFocus: true,
              hideError: true,
            }}
          />
          {fix === 'CRYPTO' && (
            <Text size={'56px'} color='textBlack' weight={500}>
              {props.supportedCoins[cryptoCurrency].coinTicker}
            </Text>
          )}
        </AmountRow>

        <QuoteActionContainer>
          {props.isSddFlow &&
          props.orderType === 'BUY' &&
          amtError === 'BELOW_MIN' ? (
            <ErrorAmountContainer onClick={handleMinMaxClick}>
              <CustomErrorCartridge role='button' data-e2e='sbEnterAmountMin'>
                <FormattedMessage
                  id='modals.simplebuy.checkout.belowmin'
                  defaultMessage='{value} Minimum {orderType}'
                  values={{
                    value: getValue(min),
                    orderType: 'Buy',
                  }}
                />
              </CustomErrorCartridge>
            </ErrorAmountContainer>
          ) : (
            <QuoteRow>
              <div />
              <Text
                color='grey600'
                size='14px'
                weight={500}
                data-e2e='sbQuoteAmount'
              >
                {formatQuote(
                  quoteAmt,
                  props.pair.pair,
                  fix,
                  props.supportedCoins
                )}
              </Text>
              <Icon
                color='blue600'
                cursor
                name='up-down-chevron'
                onClick={() =>
                  props.simpleBuyActions.switchFix(
                    quoteAmt,
                    props.orderType,
                    props.preferences[props.orderType].fix === 'CRYPTO'
                      ? 'FIAT'
                      : 'CRYPTO'
                  )
                }
                role='button'
                size='24px'
                data-e2e='sbSwitchIcon'
              />
            </QuoteRow>
          )}
        </QuoteActionContainer>
        {(!props.isSddFlow || props.orderType === OrderType.SELL) &&
          props.pair &&
          Number(min) <= Number(max) && (
            <Amounts onClick={handleMinMaxClick}>
              <>
                {amtError === 'BELOW_MIN' ? (
                  <CustomErrorCartridge
                    role='button'
                    data-e2e='sbEnterAmountMin'
                  >
                    <FormattedMessage
                      id='modals.simplebuy.checkout.belowmin'
                      defaultMessage='{value} Minimum {orderType}'
                      values={{
                        value: getValue(min),
                        orderType:
                          props.orderType === OrderType.BUY ? 'Buy' : 'Sell',
                      }}
                    />
                  </CustomErrorCartridge>
                ) : (
                  <BlueRedCartridge error={amtError === 'ABOVE_MAX'}>
                    <FormattedMessage
                      id='modals.simplebuy.checkout.maxbuysell'
                      defaultMessage='{orderType} Max'
                      values={{
                        orderType: orderType === OrderType.BUY ? 'Buy' : 'Sell',
                      }}
                    />
                  </BlueRedCartridge>
                )}
              </>
            </Amounts>
          )}

        {!props.isSddFlow &&
          props.orderType === OrderType.SELL &&
          props.pair &&
          Number(min) > Number(max) && (
            <Amounts>
              <CustomErrorCartridge
                role='button'
                data-e2e='sbEnterAmountNotEnoughFundsForSell'
              >
                <FormattedMessage
                  id='modals.simplebuy.checkout.not_enough_funds_for_sell'
                  defaultMessage='Not Enough funds for Sell'
                />
              </CustomErrorCartridge>
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
              <div onClick={handleMaxClick}>
                <BlueRedCartridge error={amtError === 'ABOVE_MAX'}>
                  <FormattedMessage
                    id='modals.simplebuy.checkout.maxbuy'
                    defaultMessage='Max Buy'
                  />
                </BlueRedCartridge>
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
          <ErrorTextContainer>
            <ErrorText>
              <Icon
                name='alert-filled'
                color='red600'
                style={{ marginRight: '4px' }}
              />
              {isLimitError(props.error) ? (
                <div
                  onClick={() =>
                    props.identityVerificationActions.verifyIdentity(2, false)
                  }
                >
                  <FormattedMessage
                    id='modals.simplebuy.checkout.upgrade_to_gold'
                    defaultMessage='Trading limit reached. Upgrade to Gold'
                  />
                </div>
              ) : (
                <>Error: {props.error}</>
              )}
            </ErrorText>
          </ErrorTextContainer>
        )}
        <ActionButton
          {...props}
          isSufficientEthForErc20={isSufficientEthForErc20 || false}
          isDailyLimitExceeded={isDailyLimitExceeded || false}
        />

        {isDailyLimitExceeded && (
          <Amounts>
            <CustomErrorCartridge
              role='button'
              data-e2e='sbEnterAmountDailyLimitExceeded'
            >
              <FormattedMessage
                id='modals.simplebuy.checkout.dailylimitexceeded'
                defaultMessage="You've reached your daily trading limit"
              />
            </CustomErrorCartridge>
          </Amounts>
        )}
      </FlyoutWrapper>
      {props.isSddFlow && props.orderType === OrderType.BUY && (
        <IncreaseLimits {...props} />
      )}
      {isSufficientEthForErc20 && (
        <ErrorTextContainer>
          <ErrorText>
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px' }}
            />
            <FormattedMessage
              id='copy.not_enough_eth1'
              defaultMessage='ETH is required to send {coin}. You do not have enough ETH in your Ether Wallet to perform a transaction. Note, ETH must be held in your Ether Wallet for this transaction, not Ether Trading Account.'
              values={{
                coin: props.supportedCoins[cryptoCurrency].coinTicker,
              }}
            />
          </ErrorText>
        </ErrorTextContainer>
      )}
    </CustomForm>
  )
}

export type Props = OwnProps & SuccessStateType

export default reduxForm<{}, Props>({
  form: 'simpleBuyCheckout',
  destroyOnUnmount: false,
})(Success)
