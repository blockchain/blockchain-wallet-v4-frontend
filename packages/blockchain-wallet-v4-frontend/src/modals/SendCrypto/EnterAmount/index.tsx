import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field } from 'redux-form'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { convertCoinToCoin, convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import Currencies from '@core/exchange/currencies'
import { formatFiat } from '@core/exchange/utils'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { CoinType, RatesType } from '@core/types'
import { Button, Icon, SkeletonRectangle, Text } from 'blockchain-info-components'
import { DisplayContainer } from 'components/BuySell'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import CollapseText from 'components/CollapseText'
import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import BuyMoreLine from 'components/Flyout/Banners/BuyMoreLine'
import UpgradeToGoldLine, { Flows } from 'components/Flyout/Banners/UpgradeToGoldLine'
import { StepHeader } from 'components/Flyout/SendRequestCrypto'
import { Form } from 'components/Form'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'
import { formatTextAmount } from 'services/forms'
import { media } from 'services/styles'
import { hexToRgb } from 'utils/helpers'

import { AlertButton, MaxButton } from '../../components'
import { TIER_TYPES } from '../../Settings/TradingLimits/model'
import { Row } from '../../Swap/EnterAmount/Checkout'
import { Props as OwnProps } from '..'
import { SEND_FORM } from '../model'
import { validate } from './validation'

const Wrapper = styled(Form)``

const CustomBlueCartridge = styled(BlueCartridge)`
  cursor: pointer;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  cursor: pointer;
`
const Amounts = styled.div`
  margin-top: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const AmountRow = styled(Row)<{ isError: boolean }>`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
  > input {
    color: ${(props) => (props.isError ? 'red400' : 'textBlack')};
  }
`
const CheckoutDisplayContainer = styled(DisplayContainer)`
  justify-content: space-between;
  ${media.tablet`
    padding: 16px 20px;
  `}
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
`
const IconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  z-index: 100;
  background: white;
`
const StyledIcon = styled(Icon)<{ background: string }>`
  background: rgba(${(props) => hexToRgb(props.theme[props.background] || '#000000')}, 0.15);
  border-radius: 50%;

  & :not(::before) {
    opacity: 0.15;
  }

  &::before {
    color: ${(props) => props.theme[props.background]};
  }
`
const PlusMinusIconWrapper = styled.div`
  z-index: 10;
`
const QuoteActionContainer = styled.div`
  height: 32px;
`
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SendEnterAmount: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [fontRatio, setRatio] = useState(1)

  const normalizeAmount = (value, prevValue, allValues) => {
    if (Number.isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
    return formatTextAmount(value, allValues && allValues.fix === 'FIAT')
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    if (Number(fontSizeRatio) > 0) {
      setRatio(fontSizeRatio > 1 ? 1 : fontSizeRatio)
    }
    const amountRowNode = inputNode.closest('#amount-row')
    const currencyNode = isFiat
      ? amountRowNode.children[0]
      : amountRowNode.children[amountRowNode.children.length - 1]
    currencyNode.style.fontSize = `${fontSizeNumber * (fontRatio - 0.3)}px`
  }

  const {
    buySellActions,
    formActions,
    formErrors,
    formValues,
    minR,
    rates,
    sendCryptoActions,
    sendLimits,
    verifyIdentity,
    walletCurrency
  } = props
  const amtError = typeof formErrors.amount === 'string' && formErrors.amount
  const { amount, fix, selectedAccount, to } = formValues
  const { coin } = selectedAccount

  const max = Number(convertCoinToCoin({ coin, value: selectedAccount.balance }))
  const min = minR.getOrElse(0)
  const maxMinusFee = Number(
    convertCoinToCoin({
      coin,
      value:
        Number(selectedAccount.balance) -
        Number(
          convertCoinToCoin({ baseToStandard: false, coin, value: props.feesR.getOrElse(0) || 0 })
        )
    })
  )

  const cryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          maxPrecision: 8,
          rates,
          value: amount
        })
      : amount
  const fiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency: walletCurrency,
          isStandard: true,
          rates,
          value: amount || 0
        })
      : amount

  const quote = fix === 'CRYPTO' ? fiatAmt : cryptoAmt

  const effectiveLimit = getEffectiveLimit(sendLimits)
  const effectivePeriod = getEffectivePeriod(sendLimits)

  return (
    <Wrapper onSubmit={() => sendCryptoActions.setStep({ step: SendCryptoStepType.CONFIRM })}>
      <FlyoutWrapper>
        <StepHeader>
          <Icon
            cursor
            onClick={() => sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_TO })}
            name='arrow-back'
            role='button'
            color='grey600'
            size='24px'
            style={{ marginRight: '20px' }}
          />
          <Text size='24px' color='grey800' weight={600}>
            <FormattedMessage id='modals.sendcrypto.enteramount.title' defaultMessage='Send' />
          </Text>
        </StepHeader>
      </FlyoutWrapper>
      <CheckoutDisplayContainer>
        <div>
          <Text size='14px' color='grey600' weight={600}>
            <FormattedMessage defaultMessage='From' id='copy.from' />
            {': '}
            {selectedAccount.label} ({max} {coin})
          </Text>
          <Text size='16px' color='grey900' weight={600} style={{ marginTop: '6px' }}>
            <FormattedMessage defaultMessage='To:' id='copy.to:' />{' '}
            <CollapseText text={to} size='16px' color='grey900' weight={600} place='right' />
          </Text>
        </div>
        <IconContainer>
          <Icon
            size='32px'
            color={coin}
            name={coin}
            style={{ left: '5px', position: 'relative' }}
          />
          <PlusMinusIconWrapper>
            <IconBackground>
              <StyledIcon name='arrow-top-right' size='24px' background={coin} />
            </IconBackground>
          </PlusMinusIconWrapper>
        </IconContainer>
      </CheckoutDisplayContainer>
      <FlyoutWrapper
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '0px'
        }}
      >
        <AmountRow id='amount-row' isError={!!amtError}>
          {fix === 'FIAT' && (
            <Text size='56px' color={amtError ? 'red400' : 'textBlack'} weight={500}>
              {Currencies[walletCurrency].units[walletCurrency].symbol}
            </Text>
          )}
          <Field
            data-e2e='sendAmountInput'
            name='amount'
            // @ts-ignore
            component={AmountTextBox}
            normalize={normalizeAmount}
            // eslint-disable-next-line
            onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
            maxFontSize='56px'
            placeholder='0'
            // leave fiatActive always to avoid 50% width in HOC?
            fiatActive
            haveError={!!amtError}
            {...{
              autoFocus: true,
              hideError: true
            }}
          />
          {fix === 'CRYPTO' && (
            <Text size='56px' color={amtError ? 'red400' : 'textBlack'} weight={500}>
              {coin}
            </Text>
          )}
        </AmountRow>
        <QuoteActionContainer>
          <QuoteRow>
            <div />
            <Text
              color={amtError ? 'red400' : 'grey600'}
              size='14px'
              weight={500}
              data-e2e='sendQuoteAmount'
            >
              {fix === 'FIAT' && coin} {quote} {fix === 'CRYPTO' && walletCurrency}
            </Text>
            <Icon
              color='blue600'
              cursor
              name='up-down-chevron'
              onClick={() => {
                formActions.change(SEND_FORM, 'fix', fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO')
                formActions.change(SEND_FORM, 'amount', fix === 'CRYPTO' ? fiatAmt : cryptoAmt)
              }}
              role='button'
              size='24px'
              data-e2e='sendSwitchIcon'
            />
          </QuoteRow>
          {amtError && amtError !== 'ABOVE_MAX_LIMIT' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '12px',
                width: '100%'
              }}
            >
              <CustomErrorCartridge
                onClick={() => {
                  formActions.change(SEND_FORM, 'fix', 'CRYPTO')
                  formActions.change(
                    SEND_FORM,
                    'amount',
                    amtError === 'ABOVE_MAX' ? maxMinusFee : min
                  )
                }}
              >
                {amtError === 'ABOVE_MAX' && (
                  <FormattedMessage
                    id='copy.above_max_amount'
                    defaultMessage='Amount is above Max'
                  />
                )}
                {amtError === 'BELOW_MIN' && (
                  <FormattedMessage
                    id='copy.below_min_amount'
                    defaultMessage='Amount is below Min'
                  />
                )}
              </CustomErrorCartridge>
            </div>
          ) : null}
        </QuoteActionContainer>

        <MaxButton
          type='Send'
          onClick={() => {
            formActions.change(SEND_FORM, 'fix', 'CRYPTO')
            formActions.change(SEND_FORM, 'amount', maxMinusFee)
          }}
        />

        <Amounts>
          <Text
            cursor='pointer'
            // @ts-ignore
            role='button'
            onClick={() => {
              formActions.change(SEND_FORM, 'fix', 'CRYPTO')
              formActions.change(SEND_FORM, 'amount', maxMinusFee)
            }}
          >
            <Text color='blue600' weight={600} size='12px'>
              <FormattedMessage id='copy.available' defaultMessage='Available' />
            </Text>
            <Text
              color='black'
              weight={600}
              size='14px'
              style={{ marginTop: '4px', textAlign: 'right' }}
            >
              {maxMinusFee} {coin}
            </Text>
          </Text>
          <div>
            <Text color='blue600' weight={600} size='12px'>
              <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
            </Text>
            {/* TODO: make field */}
            <Text color='black' weight={600} size='14px' style={{ marginTop: '4px' }}>
              {props.feesR.cata({
                Failure: (e) => (
                  <CustomBlueCartridge
                    pointer
                    data-e2e='retryFetchFees'
                    onClick={() => props.sendCryptoActions.fetchWithdrawalFees()}
                  >
                    <Text size='10px' color='blue600' weight={600}>
                      <FormattedMessage id='copy.retry' defaultMessage='Retry' />
                    </Text>
                  </CustomBlueCartridge>
                ),
                Loading: () => <SkeletonRectangle height='24px' width='52px' />,
                NotAsked: () => <SkeletonRectangle height='24px' width='52px' />,
                Success: (val) => `${val} ${coin}`
              })}
            </Text>
          </div>
        </Amounts>
      </FlyoutWrapper>
      <FlyoutWrapper
        style={{
          paddingTop: '0px'
        }}
      >
        {!amtError && (
          <Button
            nature='primary'
            type='submit'
            data-e2e='enterAmountBtn'
            fullwidth
            jumbo
            disabled={!amount || !!formErrors.amount}
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>
        )}

        {amtError && amtError === 'ABOVE_MAX_LIMIT' && effectiveLimit && (
          <>
            <AlertButton>
              <FormattedMessage id='copy.over_your_limit' defaultMessage='Over Your Limit' />
            </AlertButton>
            <Text
              size='14px'
              color='grey900'
              weight={500}
              style={{ marginBottom: '24px', marginTop: '24px', textAlign: 'center' }}
            >
              <FormattedMessage
                id='modals.sendcrypto.enteramount.over_limits'
                defaultMessage='Sending from Trade Accounts cannot exceed {currency}{amount} a {period}. You have {currency}{remainingAmount} remaining.'
                values={{
                  amount: formatFiat(convertBaseToStandard('FIAT', effectiveLimit.limit.value), 0),
                  currency: walletCurrency,
                  period: effectivePeriod,
                  remainingAmount: formatFiat(
                    convertBaseToStandard('FIAT', sendLimits.current?.available?.value || 0),
                    0
                  )
                }}
              />
            </Text>
          </>
        )}

        {amtError === 'ABOVE_MAX' && (
          <>
            <AlertButton>
              <FormattedMessage
                id='copy.not_enough_coin'
                defaultMessage='Not Enough {coin}'
                values={{
                  coin
                }}
              />
            </AlertButton>
            <Text
              size='14px'
              color='grey900'
              weight={500}
              style={{ marginBottom: '24px', marginTop: '24px', textAlign: 'center' }}
            >
              <FormattedMessage
                id='modals.sendcrypto.enteramount.over_balance'
                defaultMessage='The max you can send from this wallet is {coin} {amount}. Buy {coin} {amount} now to send this amount.'
                values={{
                  amount: max,
                  coin
                }}
              />
            </Text>
          </>
        )}
        {amtError === 'BELOW_MIN' && (
          <AlertButton>
            <FormattedMessage
              id='copy.below_min'
              defaultMessage='{amount} Minimum'
              values={{
                amount:
                  fix === 'FIAT'
                    ? `${Currencies[walletCurrency].units[walletCurrency].symbol}${min}`
                    : `${coin}${min}`
              }}
            />
          </AlertButton>
        )}

        {(sendLimits?.suggestedUpgrade?.requiredTier === TIER_TYPES.GOLD ||
          (amtError && amtError === 'ABOVE_MAX_LIMIT' && effectiveLimit)) && (
          <UpgradeToGoldLine type={Flows.SEND} verifyIdentity={verifyIdentity} />
        )}

        {amtError === 'ABOVE_MAX' && (
          <BuyMoreLine
            startBuy={() =>
              buySellActions.showModal({
                cryptoCurrency: coin as CoinType,
                orderType: 'BUY',
                origin: 'Send'
              })
            }
            buyAmount={`${coin} ${amount}`}
            coin={coin}
          />
        )}
      </FlyoutWrapper>
    </Wrapper>
  )
}

const mapStateToProps = (state, ownProps: OwnProps) => {
  const { coin } = ownProps.formValues.selectedAccount

  const ratesSelector = getRatesSelector(coin, state)
  return {
    feesR: selectors.components.sendCrypto.getWithdrawalFees(state, coin),
    minR: selectors.components.sendCrypto.getWithdrawalMin(state, coin),
    rates: ratesSelector.getOrElse({} as RatesType)
  }
}

const connector = connect(mapStateToProps)
const enhance = compose(
  connector,
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: SEND_FORM,
    validate
  })
)

export type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    formErrors: {
      amount?: 'ABOVE_MAX' | 'ABOVE_MAX_LIMIT' | 'BELOW_MIN' | 'NEGATIVE_INCOMING_AMT' | boolean
    }
  }

export default enhance(SendEnterAmount) as React.ComponentType<OwnProps>
