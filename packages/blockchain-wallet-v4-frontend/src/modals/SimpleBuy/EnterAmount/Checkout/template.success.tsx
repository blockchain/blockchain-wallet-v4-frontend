import {
  BlueCartridge,
  CustomCartridge,
  ErrorCartridge
} from 'components/Cartridge'
import {
  convertBaseToStandard,
  convertStandardToBase
} from 'data/components/exchange/services'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { formatTextAmount } from 'services/ValidationHelper'
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
import styled, { css, keyframes } from 'styled-components'

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`
const shakeAnimation = css`
  animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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
// Hide the default field error for NumberBox > div > div:last-child
const AmountFieldContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 54px;
  input {
    color: ${props => props.theme.black};
    padding-left: 8px;
    font-size: 56px;
    font-weight: 500;
    border: 0px !important;
    &::placeholder {
      font-size: 56px;
      color: ${props => props.theme.grey600};
      transition: all 0.5s;
    }
    transition: all 0.5s;
    transform: translate3d(0, 0, 0);
  }
  > div {
    height: auto;
    transition: all 0.5s;
    input {
      height: auto;
      outline: 0;
    }
  }
  > div > div:last-child {
    display: none;
  }

  &.shake {
    > div {
      color: ${props => props.theme.red500};
    }
    input {
      color: ${props => props.theme.red500};
      &::placeholder {
        color: ${props => props.theme.red500};
      }
    }
    ${shakeAnimation};
  }
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
  return formatTextAmount(value, allValues.orderType === 'BUY')
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const [isAmtShakeActive, setShake] = useState(false)

  const { fiatCurrency, method: selectedMethod, defaultMethod } = props
  const method = selectedMethod || defaultMethod

  if (!props.formValues) return null
  if (!fiatCurrency)
    return (
      <Failure
        fiatCurrency={props.fiatCurrency}
        simpleBuyActions={props.simpleBuyActions}
        formActions={props.formActions}
        analyticsActions={props.analyticsActions}
      />
    )

  const amtError =
    props.formErrors.amount &&
    typeof props.formErrors.amount === 'string' &&
    props.formErrors.amount

  const handleMinMaxClick = () => {
    const prop = amtError === 'ABOVE_MAX' ? 'max' : 'min'
    const value = convertStandardToBase(
      'FIAT',
      getMaxMin(props.pair, prop, props.sbBalances, props.formValues, method)
    )
    props.simpleBuyActions.handleSBSuggestedAmountClick(value)
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
            <FormattedMessage
              id='modals.simplebuy.buycrypto'
              defaultMessage='Buy Crypto'
            />
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
      <CryptoItem value={props.pair} />
      <FlyoutWrapper style={{ paddingTop: '0px' }}>
        <AmountFieldContainer className={isAmtShakeActive ? 'shake' : ''}>
          <Text size='56px' color='grey400' weight={500}>
            {Currencies[fiatCurrency].units[fiatCurrency].symbol}
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
                    value: fiatToString({
                      unit: fiatCurrency,
                      value: getMaxMin(
                        props.pair,
                        'max',
                        props.sbBalances,
                        props.formValues,
                        method
                      )
                    }),
                    orderType:
                      props.formValues.orderType === 'BUY' ? 'Buy' : 'Sell'
                  }}
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.checkout.belowmin'
                  defaultMessage='{value} Minimum {orderType}'
                  values={{
                    value: fiatToString({
                      unit: fiatCurrency,
                      value: getMaxMin(
                        props.pair,
                        'min',
                        props.sbBalances,
                        props.formValues,
                        method
                      )
                    }),
                    orderType:
                      props.formValues.orderType === 'BUY' ? 'Buy' : 'Sell'
                  }}
                />
              )}
            </CustomErrorCartridge>
            <GreyBlueCartridge
              data-e2e='sbBuyMinMaxBtn'
              role='button'
              onClick={handleMinMaxClick}
            >
              {amtError === 'ABOVE_MAX' ? (
                <FormattedMessage
                  id='modals.simplebuy.checkout.buymax'
                  defaultMessage='Buy Max'
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.checkout.buymin'
                  defaultMessage='Buy Min'
                />
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
                        amount
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
