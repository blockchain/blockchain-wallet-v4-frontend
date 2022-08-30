import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field } from 'redux-form'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { Remote } from '@core'
import { convertCoinToCoin, convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import Currencies from '@core/exchange/currencies'
import { formatFiat } from '@core/exchange/utils'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { CoinType, RatesType } from '@core/types'
import { Button, CoinAccountIcon, Icon, Text } from 'blockchain-info-components'
import { DisplayContainer } from 'components/BuySell'
import { ErrorCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FlyoutWrapper } from 'components/Flyout'
import BuyMoreLine from 'components/Flyout/Banners/BuyMoreLine'
import UpgradeToGoldLine, { Flows } from 'components/Flyout/Banners/UpgradeToGoldLine'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { StepHeader } from 'components/Flyout/SendRequestCrypto'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import Form from 'components/Form/Form'
import TextBox from 'components/Form/TextBox'
import TextWithQRScanner from 'components/Form/TextWithQRScanner'
import { Padding } from 'components/Padding'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { SwapBaseCounterTypes } from 'data/types'
import { getEffectiveLimit, getEffectivePeriod } from 'services/custodial'
import { media } from 'services/styles'
import { debounce } from 'utils/helpers'

import { AlertButton, MaxButton } from '../../components'
import { TIER_TYPES } from '../../Settings/TradingLimits/model'
import { Props as OwnProps } from '..'
import { FormLabelWithBorder, SEND_FORM } from '../model'
import { validate } from './validation'

const Wrapper = styled(Form)`
  height: 100%;
`

const CustomErrorCartridge = styled(ErrorCartridge)`
  cursor: pointer;
`
const CheckoutDisplayContainer = styled(DisplayContainer)`
  justify-content: space-between;
  ${media.tablet`
    padding: 16px 20px;
  `}
`
const QuoteActionContainer = styled.div`
  height: 32px;
`
const FieldWrapper = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  padding-bottom: 12px;
`
const FieldWrapperTo = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 8px;
  padding-bottom: 12px;
`
const ErrorWrapper = styled(FlyoutWrapper)`
  display: flex;
  padding-bottom: 0px;
  padding-top: 0px;
`
const FlexStartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const BalanceRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const OptionTitle = styled(Text)`
  color: ${(props) => props.theme.grey800};
  font-weight: 600;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const OptionValue = styled(Text)`
  color: ${(props) => props.theme.grey600};
  margin-top: 4px;
  font-weight: 600;
  font-size: 14px;
`

const SendEnterAmount: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const {
    buySellActions,
    formActions,
    formErrors,
    formValues,
    isValidAddress,
    minR,
    rates,
    sendCryptoActions,
    sendLimits,
    verifyIdentity,
    walletCurrency
  } = props
  const amountError = typeof formErrors.amount === 'string' && formErrors.amount
  const { amount, fix, selectedAccount, to } = formValues
  const { coin, type } = selectedAccount
  const isAccount = type === SwapBaseCounterTypes.ACCOUNT

  const { coinfig } = window.coins[selectedAccount.coin]

  const valid = isValidAddress.cata({
    Failure: () => false,
    Loading: () => false,
    NotAsked: () => false,
    Success: (res) => res
  })

  const disabled = !Remote.Success.is(isValidAddress) || !valid

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

  const handleMax = () => {
    if (isAccount) {
      // formActions.change(SEND_FORM, 'amount', 'MAX')
      formActions.change(SEND_FORM, 'amount', maxMinusFee)
      if (to) {
        sendCryptoActions.setStep({ step: SendCryptoStepType.CONFIRM })
      }
    } else {
      formActions.change(SEND_FORM, 'fix', 'CRYPTO')
      formActions.change(SEND_FORM, 'amount', maxMinusFee)
    }
  }

  return (
    <Wrapper onSubmit={() => sendCryptoActions.setStep({ step: SendCryptoStepType.CONFIRM })}>
      <FlyoutContainer>
        <FlyoutContent mode='middle'>
          <FlyoutWrapper>
            <StepHeader>
              <Icon
                cursor
                onClick={() =>
                  sendCryptoActions.setStep({ step: SendCryptoStepType.COIN_SELECTION })
                }
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
            <FlexStartRow>
              <CoinAccountIcon
                accountType={selectedAccount.type}
                coin={coin}
                style={{ marginRight: '12px' }}
              />
              <div>
                <OptionTitle data-e2e={selectedAccount.label}>{selectedAccount.label}</OptionTitle>
                <OptionValue>{coin}</OptionValue>
              </div>
            </FlexStartRow>
            <FlexStartRow>
              <BalanceRow>
                <CoinDisplay
                  size='16px'
                  color='grey900'
                  coin={selectedAccount.coin}
                  weight={600}
                  loadingHeight='24px'
                  style={{
                    lineHeight: 1.25
                  }}
                >
                  {selectedAccount.balance}
                </CoinDisplay>

                <FiatDisplay
                  size='14px'
                  color='grey600'
                  coin={selectedAccount.coin}
                  currency={walletCurrency}
                  style={{
                    lineHeight: 1.25
                  }}
                  weight={500}
                >
                  {selectedAccount.balance}
                </FiatDisplay>
              </BalanceRow>
            </FlexStartRow>
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
          </FlyoutWrapper>

          <div>
            <Padding left={40}>
              <Text size='14px' weight={600} color='black'>
                <FormattedMessage id='copy.to' defaultMessage='To' />
              </Text>
            </Padding>
            <FieldWrapperTo>
              <Field
                name='to'
                // @ts-ignore
                component={TextWithQRScanner}
                onScan={(data) => formActions.change(SEND_FORM, 'to', data)}
                onChange={debounce((e) => {
                  sendCryptoActions.validateAddress({
                    address: e.currentTarget.value,
                    coin: selectedAccount.coin
                  })
                }, 100)}
                placeholder={`${coinfig.name} Address`}
              />
            </FieldWrapperTo>

            <Padding left={40} top={8} right={40}>
              <Text size='12px' weight={500} color='grey700'>
                <FormattedMessage
                  id='modals.sendCrypto.enterAmount.networkDescription'
                  defaultMessage='We use the {network} network to send BTC funds. Ensure to send your funds to an address that is using the same network to avoid the loss of your funds.'
                  values={{
                    network: coinfig.name
                  }}
                />
              </Text>
            </Padding>
            {isValidAddress.cata({
              Failure: () => null,
              Loading: () => null,
              NotAsked: () => null,
              Success: (val) => {
                return val ? null : (
                  <ErrorWrapper>
                    <ErrorCartridge>
                      <FormattedMessage id='copy.invalid_addr' defaultMessage='Invalid Address' />
                    </ErrorCartridge>
                  </ErrorWrapper>
                )
              }
            })}
            {coinfig.type.isMemoBased ? (
              <>
                <FormLabelWithBorder>
                  <FormattedMessage id='copy.memo' defaultMessage='Memo' />
                </FormLabelWithBorder>
                <FieldWrapper>
                  <Field component={TextBox} type='text' name='memo' />
                </FieldWrapper>
              </>
            ) : null}
          </div>
        </FlyoutContent>
        <FlyoutFooter collapsed>
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
                    amount: formatFiat(
                      convertBaseToStandard('FIAT', effectiveLimit.limit.value),
                      0
                    ),
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
        </FlyoutFooter>
      </FlyoutContainer>
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
