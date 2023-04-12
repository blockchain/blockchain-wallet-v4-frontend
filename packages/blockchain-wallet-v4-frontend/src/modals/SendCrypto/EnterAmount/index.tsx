import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
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
import { FlyoutWrapper } from 'components/Flyout'
import BuyMoreLine from 'components/Flyout/Banners/BuyMoreLine'
import UpgradeToGoldLine, { Flows } from 'components/Flyout/Banners/UpgradeToGoldLine'
import { StepHeader } from 'components/Flyout/SendRequestCrypto'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import Form from 'components/Form/Form'
import SelectBox from 'components/Form/SelectBox'
import { Padding } from 'components/Padding'
import { actions, selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { SwapBaseCounterTypes } from 'data/types'
import { useDebounce } from 'hooks'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'
import { media } from 'services/styles'
import { hexToRgb } from 'utils/helpers'

import { AlertButton, MaxButton } from '../../components'
import { TIER_TYPES } from '../../Settings/TradingLimits/model'
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

const SendEnterAmount: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const {
    buySellActions,
    custodialFeesR,
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
  const [inputAmount, setInputAmount] = useState('0')
  const debouncedAmount = useDebounce(inputAmount, 500)
  useEffect(() => {
    sendCryptoActions.fetchWithdrawalFees({})
  }, [debouncedAmount])

  const amountError = typeof formErrors.amount === 'string' && formErrors.amount
  const { amount, fix, selectedAccount, to } = formValues
  const { coin, type } = selectedAccount
  const isAccount = type === SwapBaseCounterTypes.ACCOUNT

  const max = Number(convertCoinToCoin({ coin, value: selectedAccount.balance }))
  const min = minR.getOrElse('0')
  const maxMinusFee = Number(
    convertCoinToCoin({
      coin,
      value:
        Number(selectedAccount.balance) -
        Number(
          convertCoinToCoin({
            baseToStandard: false,
            coin,
            value: custodialFeesR.getOrElse('0') || '0'
          })
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

  const handleMax = () => {
    if (isAccount) {
      formActions.change(SEND_FORM, 'amount', 'MAX')
      sendCryptoActions.setStep({ step: SendCryptoStepType.CONFIRM })
    } else {
      formActions.change(SEND_FORM, 'fix', 'CRYPTO')
      formActions.change(SEND_FORM, 'amount', maxMinusFee)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.target.value)
  }

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
        <AmountFieldInput
          coin={coin}
          fiatCurrency={walletCurrency}
          amountError={amountError}
          quote={quote}
          data-e2e='sendAmountInput'
          fix={fix}
          name='amount'
          onChange={handleChange}
          showCounter
          showToggle
          onToggleFix={() => {
            formActions.change(SEND_FORM, 'fix', fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO')
            formActions.change(SEND_FORM, 'amount', fix === 'CRYPTO' ? fiatAmt : cryptoAmt)
          }}
        />
        <QuoteActionContainer>
          {amountError && amountError !== 'ABOVE_MAX_LIMIT' ? (
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
                  if (amountError === 'ABOVE_MAX') {
                    handleMax()
                  } else {
                    formActions.change(SEND_FORM, 'fix', 'CRYPTO')
                    formActions.change(SEND_FORM, 'amount', min)
                  }
                }}
              >
                {amountError === 'ABOVE_MAX' && (
                  <FormattedMessage
                    id='copy.above_max_amount'
                    defaultMessage='Amount is above Max'
                  />
                )}
                {amountError === 'BELOW_MIN' && (
                  <FormattedMessage
                    id='copy.below_min_amount'
                    defaultMessage='Amount is below Min'
                  />
                )}
              </CustomErrorCartridge>
            </div>
          ) : null}
        </QuoteActionContainer>

        <Padding top={70}>
          <MaxButton type='Send' onClick={handleMax} />
        </Padding>

        <Amounts>
          <Text
            cursor='pointer'
            // @ts-ignore
            role='button'
            onClick={handleMax}
          >
            <Text color='blue600' weight={600} size='12px'>
              {isAccount ? (
                <FormattedMessage id='copy.balance' defaultMessage='Balance' />
              ) : (
                <FormattedMessage id='copy.available' defaultMessage='Available' />
              )}
            </Text>
            <Text
              color='black'
              weight={600}
              size='14px'
              style={{ marginTop: '4px', textAlign: 'right' }}
            >
              {isAccount ? max : maxMinusFee} {coin}
            </Text>
          </Text>
          <div style={{ width: '30%' }}>
            <Text color='blue600' weight={600} size='12px'>
              {isAccount ? (
                <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
              ) : (
                <FormattedMessage id='copy.processing_fee' defaultMessage='Processing Fee' />
              )}
            </Text>
            {isAccount ? (
              <Field
                component={SelectBox}
                name='fee'
                elements={[
                  {
                    group: '',
                    items: [
                      {
                        text: 'Low',
                        value: 'LOW'
                      },
                      {
                        text: 'Medium',
                        value: 'NORMAL'
                      },
                      {
                        text: 'High',
                        value: 'HIGH'
                      }
                    ]
                  }
                ]}
              >
                <option value='LOW'>Low</option>
              </Field>
            ) : (
              <Text color='black' weight={600} size='14px' style={{ marginTop: '4px' }}>
                {custodialFeesR.cata({
                  Failure: () => (
                    <CustomBlueCartridge
                      pointer
                      data-e2e='retryFetchFees'
                      onClick={() => props.sendCryptoActions.getCustodialWithdrawalFee()}
                    >
                      <Text size='10px' color='blue600' weight={600}>
                        <FormattedMessage id='copy.retry' defaultMessage='Retry' />
                      </Text>
                    </CustomBlueCartridge>
                  ),
                  Loading: () => <SkeletonRectangle height='24px' width='52px' />,
                  NotAsked: () => <SkeletonRectangle height='24px' width='52px' />,
                  Success: (val) => (
                    <>
                      {val} {coin}
                    </>
                  )
                })}
              </Text>
            )}
          </div>
        </Amounts>
      </FlyoutWrapper>
      <FlyoutWrapper
        style={{
          paddingTop: '0px'
        }}
      >
        {!amountError && (
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

        {amountError && amountError === 'ABOVE_MAX_LIMIT' && effectiveLimit && (
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

        {amountError === 'ABOVE_MAX' && (
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
        {amountError === 'BELOW_MIN' && (
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
          (amountError && amountError === 'ABOVE_MAX_LIMIT' && effectiveLimit)) &&
          !isAccount && <UpgradeToGoldLine type={Flows.SEND} verifyIdentity={verifyIdentity} />}

        {amountError === 'ABOVE_MAX' && (
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
    custodialFeesR: selectors.components.sendCrypto.getCustodialWithdrawalFee(state),
    minR: selectors.components.sendCrypto.getWithdrawalMin(state),
    rates: ratesSelector.getOrElse({} as RatesType)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  sendCryptoActions: bindActionCreators(actions.components.sendCrypto, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
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
      amount?: 'ABOVE_MAX' | 'ABOVE_MAX_LIMIT' | 'BELOW_MIN' | boolean
    }
  }

export default enhance(SendEnterAmount) as React.ComponentType<OwnProps>
