import { Button, Icon, Text } from 'blockchain-info-components'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

import { AmountTextBox } from 'components/Exchange'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import { coinToString, fiatToString } from 'core/exchange/currency'
import { FlyoutWrapper } from 'components/Flyout'
import { formatTextAmount } from 'services/ValidationHelper'
import {
  getMaxMin,
  incomingAmountNonZero,
  maximumAmount,
  minimumAmount
} from './validation'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Interest/DepositForm/model'
import { Props as OwnProps, SuccessStateType } from '..'

import { Row } from 'blockchain-wallet-v4-frontend/src/scenes/Exchange/ExchangeForm/Layout'
import { StyledForm } from '../../components'
import { SwapAccountType } from 'data/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import FiatDisplay from 'components/Display/FiatDisplay'

const AmountRow = styled(Row)`
  position: relative;
  padding: 12px;
  justify-content: center;
  border: 0px;
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
  border: 1px solid ${props => props.theme.red000};
  cursor: pointer;
  color: ${props => props.theme.red400};
`

const normalizeAmount = (
  value,
  prevValue /* allValues: SwapAmountFormValues */
) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(
    value,
    /* allValues && allValues.fix === 'FIAT' */ false
  )
}

const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
  const amountRowNode = inputNode.closest('#amount-row')
  const currencyNode = isFiat
    ? amountRowNode.children[0]
    : amountRowNode.children[amountRowNode.children.length - 1]
  currencyNode.style.fontSize = `${fontSizeNumber * fontSizeRatio}px`
}

const Checkout: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const {
    BASE,
    COUNTER,
    coins,
    fix,
    formActions,
    formErrors,
    formValues,
    limits,
    payment,
    quote,
    rates,
    userData,
    walletCurrency
  } = props
  const amtError = typeof formErrors.amount === 'string' && formErrors.amount
  const max = getMaxMin(
    'max',
    limits,
    rates[walletCurrency],
    payment,
    quote,
    BASE,
    COUNTER
  )
  const fiatMax = Exchange.convertCoinToFiat(
    max,
    BASE.coin,
    walletCurrency,
    rates
  )
  const min = getMaxMin(
    'min',
    limits,
    rates[walletCurrency],
    payment,
    quote,
    BASE,
    COUNTER
  )
  const fiatMin = Exchange.convertCoinToFiat(
    min,
    BASE.coin,
    walletCurrency,
    rates
  )
  const balance = payment ? payment.effectiveBalance : BASE.balance

  const maxAmountSilver = !!(
    userData.tiers.current === 1 &&
    amtError === 'ABOVE_MAX' &&
    limits.maxPossibleOrder < props.limits.maxOrder
  )

  const quoteAmount =
    fix === 'FIAT'
      ? Exchange.convertFiatToCoin(
          formValues?.amount || 0,
          BASE.coin,
          walletCurrency,
          rates
        )
      : Exchange.convertCoinToFiat(
          formValues?.amount || 0,
          BASE.coin,
          walletCurrency,
          rates
        )

  const quoteAmountString =
    fix === 'FIAT'
      ? coinToString({
          value: quoteAmount,
          unit: { symbol: coins[BASE.coin].coinTicker }
        })
      : fiatToString({ value: quoteAmount, unit: walletCurrency })

  const handleMinMaxClick = () => {
    const value =
      fix === 'FIAT'
        ? amtError === 'BELOW_MIN'
          ? fiatMin
          : fiatMax
        : amtError === 'BELOW_MIN'
        ? min
        : max
    formActions.change('swapAmount', 'amount', value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    props.swapActions.setStep({ step: 'PREVIEW_SWAP' })
  }

  const isQuoteFailed = Remote.Failure.is(props.quoteR)
  return (
    <FlyoutWrapper style={{ paddingTop: '20px' }}>
      <StyledForm onSubmit={handleSubmit}>
        <AmountRow id='amount-row'>
          {fix === 'FIAT' && (
            <Text size={'56px'} color='textBlack' weight={500}>
              {Currencies[walletCurrency].units[walletCurrency].symbol}
            </Text>
          )}
          <Field
            data-e2e='swapAmountInput'
            name='amount'
            component={AmountTextBox}
            validate={[maximumAmount, minimumAmount, incomingAmountNonZero]}
            normalize={normalizeAmount}
            onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
            maxFontSize='56px'
            placeholder='0'
            fiatActive={false}
            {...{
              autoFocus: true,
              hideError: true
            }}
          />
          {fix === 'CRYPTO' && (
            <Text size={'56px'} color='textBlack' weight={500}>
              {BASE.coin}
            </Text>
          )}
        </AmountRow>

        <QuoteRow style={{ display: amtError ? 'none' : 'flex' }}>
          <div style={{ width: '24px' }} />
          <Text
            color='grey600'
            size='14px'
            weight={500}
            data-e2e='swapQuoteAmount'
          >
            {quoteAmountString}
          </Text>
          <Icon
            color='blue600'
            cursor
            name='vertical-arrow-switch'
            onClick={() =>
              props.swapActions.switchFix(
                quoteAmount,
                fix === 'FIAT' ? 'CRYPTO' : 'FIAT'
              )
            }
            role='button'
            size='24px'
            data-e2e='swapSwitchIcon'
          />
        </QuoteRow>
        <Errors style={{ display: !amtError ? 'none' : 'flex' }}>
          <>
            {amtError === 'BELOW_MIN' ? (
              <CustomErrorCartridge
                onClick={handleMinMaxClick}
                role='button'
                data-e2e='swapMin'
              >
                <FormattedMessage
                  id='copy.below_swap_min'
                  defaultMessage='Minimum Swap is {value}'
                  values={{
                    value: `${min} ${BASE.coin}`
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
                    <FormattedMessage
                      id='copy.not_now'
                      defaultMessage='Not Now'
                    />
                  </Button>
                  <Button
                    data-e2e='swapLimitUpgradePrompt'
                    nature='primary'
                    onClick={() =>
                      props.idvActions.verifyIdentity(
                        2,
                        false,
                        'SwapLimitPrompt'
                      )
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
            ) : amtError === 'NEGATIVE_INCOMING_AMT' ? (
              <CustomErrorCartridge data-e2e='swapBelowZero'>
                <FormattedMessage
                  id='copy.negative_incoming_swap'
                  defaultMessage='Amount is below withdrawal fee.'
                />
              </CustomErrorCartridge>
            ) : (
              <CustomErrorCartridge
                onClick={handleMinMaxClick}
                role='button'
                data-e2e='swapMax'
              >
                <FormattedMessage
                  id='copy.above_swap_max'
                  defaultMessage='You can swap up to {value}'
                  values={{
                    value: `${max} ${BASE.coin}`
                  }}
                />
              </CustomErrorCartridge>
            )}
          </>
        </Errors>
        <Amounts>
          <div>
            <Text size='14px' weight={500} color='grey600'>
              {coins[BASE.coin].coinTicker}{' '}
              <FormattedMessage
                id='copy.available'
                defaultMessage='Available'
              />
            </Text>
            <CoinBalance>
              <CoinDisplay
                size='14px'
                weight={500}
                color='grey900'
                coin={BASE.coin}
              >
                {balance}
              </CoinDisplay>
              <Text size='14px' weight={500} color='grey600'>
                &nbsp;(
              </Text>
              <FiatDisplay
                size='14px'
                weight={500}
                color='grey600'
                coin={BASE.coin}
              >
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
                formActions.change(
                  'swapAmount',
                  'amount',
                  fix === 'FIAT' ? fiatMin : min
                )
              }
            >
              <FormattedMessage
                id='buttons.swap_min'
                defaultMessage='Swap Min'
              />
            </GreyBlueCartridge>
            <GreyBlueCartridge
              role='button'
              data-e2e='swapMax'
              onClick={() =>
                formActions.change(
                  'swapAmount',
                  'amount',
                  fix === 'FIAT' ? fiatMax : max
                )
              }
            >
              <FormattedMessage
                id='buttons.swap_max'
                defaultMessage='Swap Max'
              />
            </GreyBlueCartridge>
          </MinMaxButtons>
        </Amounts>
        <Button
          nature='primary'
          data-e2e='previewSwap'
          type='submit'
          jumbo
          fullwidth
          style={{ marginTop: '24px' }}
          disabled={props.invalid || isQuoteFailed}
        >
          <FormattedMessage
            id='buttons.preview_swap'
            defaultMessage='Preview Swap'
          />
        </Button>
        {isQuoteFailed && (
          <ErrorCartridge style={{ marginTop: '16px' }}>
            Error:{' '}
            {props.quoteR.cata({
              Failure: e => e,
              Success: () => null,
              Loading: () => null,
              NotAsked: () => null
            })}
          </ErrorCartridge>
        )}
      </StyledForm>
    </FlyoutWrapper>
  )
}

export type Props = OwnProps &
  SuccessStateType & { BASE: SwapAccountType; COUNTER: SwapAccountType }

export default reduxForm<{}, Props>({
  form: 'swapAmount',
  destroyOnUnmount: false
})(Checkout)
