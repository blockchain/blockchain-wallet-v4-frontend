import { AmountFieldContainer, FlyoutWrapper } from 'components/Flyout'
import {
  BlueCartridge,
  CustomCartridge,
  ErrorCartridge
} from 'components/Cartridge'
import { BuyOrSellCrypto } from '../../model'
import {
  coinToString,
  fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'
import { CoinType } from 'core/types'
import {
  convertBaseToStandard,
  convertStandardToBase
} from 'data/components/exchange/services'
import {
  CRYPTO_DECIMALS,
  FIAT_DECIMALS,
  formatTextAmount
} from 'services/ValidationHelper'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { getMaxMin, maximumAmount, minimumAmount } from './validation'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '.'
import { SBCheckoutFormValuesType } from 'data/types'
import ActionButton from './ActionButton'
import CryptoItem from '../../CryptoSelection/CryptoSelector/CryptoItem'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import Failure from '../template.failure'
import Payment from './Payment'
import React, { useState } from 'react'
import styled from 'styled-components'

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
const Amount = styled(BlueCartridge)`
  margin-right: 8px;
  cursor: pointer;
`
const Amounts = styled.div`
  margin: 24px 0 40px;
  display: flex;
  justify-content: space-between;
`
const GreyBlueCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme.white};
  border: 1px solid ${props => props.theme.grey100};
  color: ${props => props.theme.blue600};
  cursor: pointer;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  cursor: pointer;
`
const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${props => props.theme.red000};
  color: ${props => props.theme.red800};
  margin-bottom: 16px;
`

const normalizeAmount = (
  value,
  prevValue,
  allValues: SBCheckoutFormValuesType
) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, allValues && allValues.actionType === 'BUY')
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const [isAmtShakeActive, setShake] = useState(false)

  const {
    actionType,
    cryptoCurrency,
    fiatCurrency,
    method: selectedMethod,
    defaultMethod
  } = props
  const method = selectedMethod || defaultMethod
  const digits = actionType === 'BUY' ? FIAT_DECIMALS : CRYPTO_DECIMALS
  const baseCurrency = actionType === 'BUY' ? fiatCurrency : cryptoCurrency
  const conversionCoinType: 'FIAT' | CoinType =
    actionType === 'BUY' ? 'FIAT' : cryptoCurrency

  if (!props.formValues) return null
  if (!fiatCurrency || !baseCurrency)
    return (
      <Failure
        fiatCurrency={props.fiatCurrency}
        simpleBuyActions={props.simpleBuyActions}
        formActions={props.formActions}
        analyticsActions={props.analyticsActions}
      />
    )

  const amtError =
    typeof props.formErrors.amount === 'string' && props.formErrors.amount

  const max = getMaxMin(
    props.pair,
    'max',
    props.sbBalances,
    props.actionType,
    props.rates,
    props.formValues,
    method
  )
  const min = getMaxMin(
    props.pair,
    'min',
    props.sbBalances,
    props.actionType,
    props.rates,
    props.formValues,
    method
  )

  const handleMinMaxClick = () => {
    const prop = amtError === 'ABOVE_MAX' ? 'max' : 'min'
    const value = convertStandardToBase(
      conversionCoinType,
      getMaxMin(
        props.pair,
        prop,
        props.sbBalances,
        props.actionType,
        props.rates,
        props.formValues,
        method
      )
    )
    props.simpleBuyActions.handleSBSuggestedAmountClick(
      value,
      conversionCoinType
    )
  }

  const handleAmountErrorClick = () => {
    if (isAmtShakeActive) return

    setShake(true)
    props.formActions.focus('simpleBuyCheckout', 'amount')

    setTimeout(() => {
      setShake(false)
    }, 1000)
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper style={{ paddingBottom: '0px' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <LeftTopCol>
            <Icon
              cursor
              data-e2e='sbBackToCryptoSelection'
              name='arrow-left'
              size='20px'
              color='grey600'
              role='button'
              style={{ marginRight: '8px' }}
              onClick={() =>
                props.simpleBuyActions.setStep({
                  step: 'CRYPTO_SELECTION',
                  // Always reset back to walletCurrency
                  // Otherwise FUNDS currency and Pairs currency can mismatch
                  fiatCurrency: props.walletCurrency || 'USD'
                })
              }
            />
            <BuyOrSellCrypto {...props} />
          </LeftTopCol>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={() => props.handleClose()}
          />
        </TopText>
      </FlyoutWrapper>
      <CryptoItem value={props.pair} actionType={props.actionType} />
      <FlyoutWrapper style={{ paddingTop: '0px' }}>
        <AmountFieldContainer
          className={isAmtShakeActive ? 'shake' : ''}
          isCrypto={actionType === 'SELL'}
        >
          <Text
            size={actionType === 'SELL' ? '36px' : '56px'}
            color='grey400'
            weight={500}
          >
            {Currencies[baseCurrency].units[baseCurrency].symbol}
          </Text>
          <Field
            data-e2e='sbAmountInput'
            name='amount'
            component={NumberBox}
            validate={[maximumAmount, minimumAmount]}
            normalize={normalizeAmount}
            placeholder='0'
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true
            }}
          />
        </AmountFieldContainer>
        {props.pair && amtError && (
          <Amounts>
            <CustomErrorCartridge role='button' onClick={handleMinMaxClick}>
              {amtError === 'ABOVE_MAX' ? (
                <FormattedMessage
                  id='modals.simplebuy.checkout.abovemax'
                  defaultMessage='{value} Maximum {orderType}'
                  values={{
                    value:
                      actionType === 'BUY'
                        ? fiatToString({
                            digits,
                            unit: fiatCurrency,
                            value: max
                          })
                        : coinToString({
                            value: max,
                            unit: { symbol: cryptoCurrency }
                          }),
                    orderType: actionType === 'BUY' ? 'Buy' : 'Sell'
                  }}
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.checkout.belowmin'
                  defaultMessage='{value} Minimum {orderType}'
                  values={{
                    value:
                      actionType === 'BUY'
                        ? fiatToString({
                            digits,
                            unit: fiatCurrency,
                            value: min
                          })
                        : coinToString({
                            value: max,
                            unit: { symbol: cryptoCurrency }
                          }),
                    orderType: props.actionType === 'BUY' ? 'Buy' : 'Sell'
                  }}
                />
              )}
            </CustomErrorCartridge>
            <GreyBlueCartridge
              data-e2e='sbBuyMinMaxBtn'
              role='button'
              onClick={handleMinMaxClick}
            >
              {actionType === 'BUY' ? 'Buy' : 'Sell'}&nbsp;
              {amtError === 'ABOVE_MAX' ? (
                <FormattedMessage id='copy.max' defaultMessage='Max' />
              ) : (
                <FormattedMessage id='copy.min' defaultMessage='Min' />
              )}
            </GreyBlueCartridge>
          </Amounts>
        )}
        {props.suggestedAmounts[0] && !amtError && (
          <Amounts>
            <div>
              {props.suggestedAmounts[0][fiatCurrency].map(amount => {
                return (
                  <Amount
                    data-e2e={`sbBuy${amount}Chip`}
                    onClick={() =>
                      props.simpleBuyActions.handleSBSuggestedAmountClick(
                        amount,
                        conversionCoinType
                      )
                    }
                    role='button'
                    key={`sbBuy${amount}Chip`}
                  >
                    {fiatToString({
                      unit: fiatCurrency,
                      value: convertBaseToStandard('FIAT', amount),
                      digits: 0
                    })}
                  </Amount>
                )
              })}
            </div>
            <GreyBlueCartridge
              data-e2e='sbChangeCurrencyBtn'
              role='button'
              onClick={() =>
                props.simpleBuyActions.setStep({ step: 'CURRENCY_SELECTION' })
              }
            >
              {fiatCurrency}
            </GreyBlueCartridge>
          </Amounts>
        )}

        <Payment
          {...props}
          method={method}
          handleAmountErrorClick={handleAmountErrorClick}
        />

        {props.error && (
          <ErrorText>
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px' }}
            />
            Error: {props.error}
          </ErrorText>
        )}
        <ActionButton {...props} method={method} />
      </FlyoutWrapper>
    </CustomForm>
  )
}

export type Props = OwnProps & SuccessStateType

export default reduxForm<{}, Props>({
  form: 'simpleBuyCheckout',
  destroyOnUnmount: false
})(Success)
