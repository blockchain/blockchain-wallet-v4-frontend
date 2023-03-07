import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Earn/Interest/DepositForm/model'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Exchange } from '@core'
import Currencies from '@core/exchange/currencies'
import { coinToString, fiatToString, formatFiat } from '@core/exchange/utils'
import { Button, Icon, Text } from 'blockchain-info-components'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import TransactionsLeft from 'components/Flyout/Banners/TransactionsLeft'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { Analytics, SwapAccountType, SwapBaseCounterTypes } from 'data/types'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'
import { formatTextAmount } from 'services/forms'
import { media } from 'services/styles'

import { AlertButton } from '../../../components'
import { StyledForm } from '../../components'
import { Props as OwnProps, SuccessStateType } from '..'
import { checkCrossBorderLimit, getMaxMin, maximumAmount, minimumAmount } from './validation'

export const Cell = styled.div<{ center?: boolean; size?: 'small' }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.center ? 'center' : 'flex-start')};
  width: ${(props) => (props.size === 'small' ? '10%' : '45%')};
  height: 100%;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 32px;
  width: 100%;
`

const AmountRow = styled(Row)<{ isError: boolean }>`
  position: relative;
  padding: 12px;
  justify-content: center;
  border: 0px;
  > input {
    color: ${(props) => (props.isError ? 'red400' : 'textBlack')};
  }
`
const Amounts = styled.div`
  margin-top: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const MinMaxButtons = styled.div`
  display: flex;
`
const ButtonsRow = styled(MinMaxButtons)`
  justify-content: space-between;
  width: 105%;
  ${media.mobile`
    flex-direction: column;
    width: 100%;
    align-items: center;
  `};
`
const CoinBalance = styled.div`
  margin-top: 2px;
  display: flex;
`
const UpgradePrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Errors = styled.div`
  display: flex;
  justify-content: center;
  min-height: 32px;
`
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  border: 1px solid ${(props) => props.theme.red000};
  cursor: pointer;
  color: ${(props) => props.theme.red400};
`

export const ButtonContainer = styled.div`
  margin-top: 24px;
`

const normalizeAmount = (value, prevValue /* allValues: SwapAmountFormValues */) => {
  if (Number.isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, /* allValues && allValues.fix === 'FIAT' */ false)
}

const Checkout: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const {
    BASE,
    COUNTER,
    baseRates,
    crossBorderLimits,
    fix,
    formErrors,
    formValues,
    limits,
    payment,
    quotePrice,
    userData,
    walletCurrency
  } = props

  const [fontRatio, setRatio] = useState(1)
  const amountError = typeof formErrors.amount === 'string' && formErrors.amount

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
  const max = getMaxMin('max', limits, baseRates, payment, quotePrice, BASE)

  const fiatMax = Exchange.convertCoinToFiat({
    coin: BASE.coin,
    currency: walletCurrency,
    isStandard: true,
    rates: baseRates,
    value: max
  })
  const min = getMaxMin('min', limits, baseRates, payment, quotePrice, BASE)

  const fiatMin = Exchange.convertCoinToFiat({
    coin: BASE.coin,
    currency: walletCurrency,
    isStandard: true,
    rates: baseRates,
    value: min
  })
  const balance = payment ? payment.effectiveBalance : BASE.balance

  const maxAmountSilver = !!(
    userData.tiers.current === 1 &&
    amountError === 'ABOVE_MAX' &&
    limits.maxPossibleOrder < props.limits.maxOrder
  )

  const quoteAmount =
    fix === 'FIAT'
      ? Exchange.convertFiatToCoin({
          coin: BASE.coin,
          currency: walletCurrency,
          rates: baseRates,
          value: formValues?.amount || 0
        })
      : Exchange.convertCoinToFiat({
          coin: BASE.coin,
          currency: walletCurrency,
          isStandard: true,
          rates: baseRates,
          value: formValues?.amount || 0
        })

  const quoteAmountString =
    fix === 'FIAT'
      ? coinToString({
          unit: { symbol: BASE.coin },
          value: quoteAmount
        })
      : fiatToString({ unit: walletCurrency, value: quoteAmount })

  const handleMinMaxClick = () => {
    if (amountError === 'BELOW_MIN') {
      props.swapActions.handleSwapMinAmountClick({ amount: fix === 'FIAT' ? fiatMin : min })
    }

    if (amountError === 'ABOVE_MAX') {
      props.swapActions.handleSwapMinAmountClick({ amount: fix === 'FIAT' ? fiatMax : max })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (typeof formValues?.cryptoAmount === 'undefined') {
      return
    }

    props.swapActions.proceedToSwapConfirmation({
      amount: formValues.cryptoAmount,
      base: BASE,
      counter: COUNTER
    })

    props.analyticsActions.trackEvent({
      key: Analytics.SWAP_AMOUNT_SCREEN_NEXT_CLICKED,
      properties: {}
    })
  }

  const toggleFix = () => {
    props.swapActions.switchFix({
      amount: quoteAmount,
      fix: fix === 'FIAT' ? 'CRYPTO' : 'FIAT'
    })

    props.analyticsActions.trackEvent({
      key: Analytics.SWAP_FIAT_CRYPTO_CLICKED,
      properties: {}
    })
  }

  const balanceBelowMinimum = Number(max) < Number(min)
  const { coinfig: baseCoinfig } = window.coins[BASE.coin]
  // if user is attempting to send NC ERC20, ensure they have sufficient
  // ETH balance else warn user and disable trade
  const isErc20 = !!baseCoinfig.type.erc20Address
  const disableInsufficientEth =
    props.payment &&
    BASE.type === SwapBaseCounterTypes.ACCOUNT &&
    isErc20 &&
    // @ts-ignore
    !props.payment.isSufficientEthForErc20

  const showError = !props.isPristine && amountError

  const effectiveLimit = getEffectiveLimit(crossBorderLimits)
  const effectivePeriod = getEffectivePeriod(crossBorderLimits)

  const showLimitError = showError && amountError === 'ABOVE_MAX_LIMIT'
  const showBalanceError = showError && amountError === 'ABOVE_BALANCE'

  const showSilverRevampBanner = props.products?.swap?.maxOrdersLeft > 0

  return (
    <FlyoutWrapper style={{ paddingTop: '20px' }}>
      <StyledForm onSubmit={handleSubmit}>
        <AmountRow id='amount-row' isError={!!showError}>
          {fix === 'FIAT' && (
            <Text size='56px' color={showError ? 'red400' : 'textBlack'} weight={500}>
              {Currencies[walletCurrency].units[walletCurrency].symbol}
            </Text>
          )}
          <Field
            data-e2e='swapAmountInput'
            name='amount'
            component={AmountTextBox}
            validate={[maximumAmount, minimumAmount, checkCrossBorderLimit]}
            normalize={normalizeAmount}
            props={{ disabled: balanceBelowMinimum }}
            // eslint-disable-next-line react/jsx-no-bind
            onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
            maxFontSize='56px'
            placeholder='0'
            autoComplete='off'
            fiatActive={false}
            haveError={!!showError}
            {...{
              autoFocus: true,
              hideError: true
            }}
          />
          {fix === 'CRYPTO' && (
            <Text size='56px' color={showError ? 'red400' : 'textBlack'} weight={500}>
              {baseCoinfig.displaySymbol}
            </Text>
          )}
        </AmountRow>

        <QuoteRow style={{ display: amountError || balanceBelowMinimum ? 'none' : 'flex' }}>
          <div style={{ width: '24px' }} />
          <Text
            color={showError ? 'red400' : 'grey600'}
            size='14px'
            weight={500}
            data-e2e='swapQuoteAmount'
          >
            {quoteAmountString}
          </Text>
          <Icon
            color='blue600'
            cursor
            name='up-down-chevron'
            onClick={toggleFix}
            role='button'
            size='24px'
            data-e2e='swapSwitchIcon'
          />
        </QuoteRow>
        <Errors
          style={{
            display: !amountError || balanceBelowMinimum ? 'none' : 'flex'
          }}
        >
          <>
            {amountError === 'BELOW_MIN' ? (
              <CustomErrorCartridge onClick={handleMinMaxClick} role='button' data-e2e='swapMin'>
                <FormattedMessage
                  id='copy.below_swap_min'
                  defaultMessage='Minimum Swap is {value}'
                  values={{
                    value:
                      fix === 'FIAT'
                        ? fiatToString({ unit: walletCurrency, value: fiatMin })
                        : `${min} ${baseCoinfig.displaySymbol}`
                  }}
                />
              </CustomErrorCartridge>
            ) : maxAmountSilver ? (
              <UpgradePrompt>
                <BlueCartridge style={{ marginBottom: '26px' }}>
                  <FormattedMessage
                    id='copy.above_swap_max_silver'
                    defaultMessage='Upgrade your profile to swap this amount.'
                  />
                </BlueCartridge>
                <ButtonsRow>
                  <Button
                    data-e2e='swapUpgradePromptNotNow'
                    nature='light'
                    onClick={handleMinMaxClick}
                    height='48px'
                    width='192px'
                  >
                    <FormattedMessage id='copy.not_now' defaultMessage='Not Now' />
                  </Button>
                  <Button
                    data-e2e='swapLimitUpgradePrompt'
                    nature='primary'
                    onClick={() =>
                      props.idvActions.verifyIdentity({
                        needMoreInfo: false,
                        origin: 'Swap',
                        tier: 2
                      })
                    }
                    height='48px'
                    width='192px'
                  >
                    <FormattedMessage
                      id='scenes.exchange.exchangeform.limit_info.upgrade'
                      defaultMessage='Upgrade'
                    />
                  </Button>
                </ButtonsRow>
              </UpgradePrompt>
            ) : (
              <CustomErrorCartridge onClick={handleMinMaxClick} role='button' data-e2e='swapMax'>
                <FormattedMessage
                  id='copy.above_swap_max'
                  defaultMessage='You can swap up to {value}'
                  values={{
                    value:
                      fix === 'FIAT'
                        ? fiatToString({ unit: walletCurrency, value: fiatMax })
                        : `${max} ${baseCoinfig.displaySymbol}`
                  }}
                />
              </CustomErrorCartridge>
            )}
          </>
        </Errors>
        {balanceBelowMinimum && (
          <Errors>
            <CustomErrorCartridge data-e2e='balanceBelowMin'>
              <FormattedMessage
                id='copy.swap_not_enough_funds'
                defaultMessage='This wallet does not have enough funds for a swap.'
              />
            </CustomErrorCartridge>
          </Errors>
        )}
        <Amounts>
          <div>
            <Text size='14px' weight={500} color='grey600'>
              {baseCoinfig.displaySymbol}{' '}
              <FormattedMessage id='copy.available' defaultMessage='Available' />
            </Text>
            <CoinBalance>
              <CoinDisplay size='14px' weight={500} color='grey900' coin={BASE.coin}>
                {balance}
              </CoinDisplay>
              <Text size='14px' weight={500} color='grey600'>
                &nbsp;(
              </Text>
              <FiatDisplay size='14px' weight={500} color='grey600' coin={BASE.coin}>
                {balance}
              </FiatDisplay>
              <Text size='14px' weight={500} color='grey600'>
                )
              </Text>
            </CoinBalance>
          </div>
          <MinMaxButtons>
            <GreyBlueCartridge
              role='button'
              data-e2e='swapMin'
              onClick={() =>
                props.swapActions.handleSwapMinAmountClick({
                  amount: fix === 'FIAT' ? fiatMin : min
                })
              }
            >
              <FormattedMessage id='buttons.swap_min' defaultMessage='Swap Min' />
            </GreyBlueCartridge>
            <GreyBlueCartridge
              role='button'
              data-e2e='swapMax'
              onClick={() => {
                props.swapActions.switchFix({ amount: quoteAmount, fix: 'CRYPTO' })
                props.swapActions.handleSwapMinAmountClick({ amount: max })
              }}
            >
              <FormattedMessage id='buttons.swap_max' defaultMessage='Swap Max' />
            </GreyBlueCartridge>
          </MinMaxButtons>
        </Amounts>

        {!showLimitError && !showError && !showBalanceError && (
          <Button
            nature='primary'
            data-e2e='previewSwap'
            type='submit'
            jumbo
            fullwidth
            style={{ marginTop: '24px' }}
            disabled={props.invalid || disableInsufficientEth}
          >
            <FormattedMessage id='buttons.preview_swap' defaultMessage='Preview Swap' />
          </Button>
        )}

        {showSilverRevampBanner && (
          <TransactionsLeft remaining={props.products.buy.maxOrdersLeft} />
        )}

        {!showLimitError && !showBalanceError && showError && (
          <ButtonContainer>
            {amountError === 'BELOW_MIN' ? (
              <AlertButton onClick={handleMinMaxClick}>
                <FormattedMessage
                  id='copy.below_min'
                  defaultMessage='{amount} Minimum'
                  values={{
                    amount:
                      fix === 'FIAT'
                        ? fiatToString({ unit: walletCurrency, value: fiatMin })
                        : `${min} ${baseCoinfig.displaySymbol}`
                  }}
                />
              </AlertButton>
            ) : (
              <AlertButton onClick={handleMinMaxClick}>
                <FormattedMessage
                  id='copy.above_max'
                  defaultMessage='{amount} Maximum'
                  values={{
                    amount:
                      fix === 'FIAT'
                        ? fiatToString({ unit: walletCurrency, value: fiatMax })
                        : `${max} ${baseCoinfig.displaySymbol}`
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
                  id='copy.swap_minimum_amount'
                  defaultMessage='To avoid unnecessary fees and network slippage, the minimum amount for this pair is {amount}.'
                  values={{
                    amount:
                      fix === 'FIAT'
                        ? fiatToString({ unit: walletCurrency, value: fiatMin })
                        : `${min} ${baseCoinfig.displaySymbol}`
                  }}
                />
              )}

              {amountError === 'ABOVE_MAX' && (
                <FormattedMessage
                  id='copy.swap_maximum_amount'
                  defaultMessage='The maximum amount of {coin} you can swap from this wallet is {amount}.'
                  values={{
                    amount:
                      fix === 'FIAT'
                        ? fiatToString({ unit: walletCurrency, value: fiatMax })
                        : `${min} ${baseCoinfig.displaySymbol}`,
                    coin: BASE.coin
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
                props.swapActions.handleSwapMinAmountClick({
                  amount: convertBaseToStandard(
                    'FIAT',
                    crossBorderLimits.current?.available?.value || 0
                  )
                })
              }}
            >
              <FormattedMessage id='copy.over_your_limit' defaultMessage='Over Your Limit' />
            </AlertButton>
            <Text
              size='14px'
              color='textBlack'
              weight={500}
              style={{ marginTop: '24px', textAlign: 'center' }}
            >
              <FormattedMessage
                id='modals.swap.cross_border_max'
                defaultMessage='Swapping from Trade Accounts cannot exceed {amount} a {period}. You have {remainingAmount} remaining.'
                values={{
                  amount: formatFiat(convertBaseToStandard('FIAT', effectiveLimit.limit.value), 0),
                  period: effectivePeriod,
                  remainingAmount: formatFiat(
                    convertBaseToStandard('FIAT', crossBorderLimits.current?.available?.value || 0),
                    0
                  )
                }}
              />
            </Text>
          </>
        )}

        {showBalanceError && !showLimitError && (
          <ButtonContainer>
            <AlertButton
              onClick={() =>
                props.swapActions.handleSwapMinAmountClick({
                  amount: fix === 'FIAT' ? fiatMax : max
                })
              }
            >
              <FormattedMessage
                id='copy.not_enough_coin'
                defaultMessage='Not Enough {coin}'
                values={{
                  coin: BASE.coin
                }}
              />
            </AlertButton>
            <Text
              size='14px'
              color='textBlack'
              weight={500}
              style={{ marginTop: '24px', textAlign: 'center' }}
            >
              <FormattedMessage
                id='copy.swap_maximum_amount'
                defaultMessage='The maximum amount of {coin} you can swap from this wallet is {amount}.'
                values={{
                  amount:
                    fix === 'FIAT'
                      ? fiatToString({ unit: walletCurrency, value: fiatMax })
                      : `${max} ${baseCoinfig.displaySymbol}`,
                  coin: BASE.coin
                }}
              />
            </Text>
          </ButtonContainer>
        )}

        {disableInsufficientEth && (
          <ErrorCartridge style={{ marginTop: '16px' }}>
            <FormattedMessage
              id='copy.not_enough_eth1'
              defaultMessage='ETH is required to send {coin}. You do not have enough ETH in your Ether Wallet to perform a transaction. Note, ETH must be held in your Ether Wallet for this transaction, not Ether Trading Account.'
              values={{
                coin: baseCoinfig.displaySymbol
              }}
            />
          </ErrorCartridge>
        )}
      </StyledForm>
    </FlyoutWrapper>
  )
}

export type Props = OwnProps &
  SuccessStateType & { BASE: SwapAccountType; COUNTER: SwapAccountType }

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: 'swapAmount'
})(Checkout)
