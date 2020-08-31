import { FormattedMessage } from 'react-intl'
import React, { ReactChild } from 'react'
import styled from 'styled-components'

import { AmountTextBox } from 'components/Exchange'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import { BuyOrSell } from '../../model'
import {
  coinToString,
  fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'
import { CoinType } from 'core/types'
import { convertStandardToBase } from 'data/components/exchange/services'
import {
  CRYPTO_DECIMALS,
  FIAT_DECIMALS,
  formatTextAmount
} from 'services/ValidationHelper'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import {
  formatQuote,
  getMaxMin,
  getQuote,
  maximumAmount,
  minimumAmount
} from './validation'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '.'
import { Row } from 'blockchain-wallet-v4-frontend/src/scenes/Exchange/ExchangeForm/Layout'
import { SBCheckoutFormValuesType } from 'data/types'
import ActionButton from './ActionButton'
import CryptoItem from '../../CryptoSelection/CryptoSelector/CryptoItem'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import Failure from '../template.failure'
import Payment from './Payment'

const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0px;
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
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const CustomBlueCartridge = styled(BlueCartridge)`
  border: 1px solid ${props => props.theme.blue000};
  cursor: pointer;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  border: 1px solid ${props => props.theme.red000};
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

const BlueRedCartridge = ({
  error,
  children
}: {
  children: ReactChild
  error: boolean
}) => {
  if (error)
    return <CustomErrorCartridge role='button'>{children}</CustomErrorCartridge>
  return <CustomBlueCartridge role='button'>{children}</CustomBlueCartridge>
}

const normalizeAmount = (
  value,
  prevValue,
  allValues: SBCheckoutFormValuesType
) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, allValues && allValues.fix === 'FIAT')
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const {
    orderType,
    cryptoCurrency,
    fiatCurrency,
    method: selectedMethod,
    defaultMethod
  } = props
  const method = selectedMethod || defaultMethod
  const fix = props.preferences[props.orderType].fix
  const digits = fix === 'FIAT' ? FIAT_DECIMALS : CRYPTO_DECIMALS
  const baseCurrency = fix === 'FIAT' ? fiatCurrency : cryptoCurrency
  const conversionCoinType: 'FIAT' | CoinType =
    fix === 'FIAT' ? 'FIAT' : cryptoCurrency

  const quoteAmt = getQuote(props.quote, fix, props.formValues?.amount)

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

  const max: string = getMaxMin(
    'max',
    props.sbBalances,
    props.orderType,
    props.quote,
    props.pair,
    props.formValues,
    method
  )[fix]
  const min: string = getMaxMin(
    'min',
    props.sbBalances,
    props.orderType,
    props.quote,
    props.pair,
    props.formValues,
    method
  )[fix]

  const handleMinMaxClick = () => {
    const prop = amtError === 'BELOW_MIN' ? 'min' : 'max'
    const maxMin: string = getMaxMin(
      prop,
      props.sbBalances,
      props.orderType,
      props.quote,
      props.pair,
      props.formValues,
      method
    )[fix]
    const value = convertStandardToBase(conversionCoinType, maxMin)
    props.simpleBuyActions.handleSBSuggestedAmountClick(
      value,
      conversionCoinType
    )
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    const amountRowNode = inputNode.closest('#amount-row')
    const currencyNode = isFiat
      ? amountRowNode.children[0]
      : amountRowNode.children[amountRowNode.children.length - 1]
    currencyNode.style.fontSize = `${fontSizeNumber * fontSizeRatio}px`
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
            <BuyOrSell {...props} crypto={cryptoCurrency || 'Crypto'} />
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
      <CryptoItem
        fiat={props.fiatCurrency || 'USD'}
        coin={props.cryptoCurrency}
        orderType={props.orderType}
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
              hideError: true
            }}
          />
          {fix === 'CRYPTO' && (
            <Text size={'56px'} color='textBlack' weight={500}>
              {cryptoCurrency}
            </Text>
          )}
        </AmountRow>

        <QuoteRow>
          <div />
          <Text color='grey600' size='14px' weight={500}>
            {formatQuote(quoteAmt, props.quote, fix)}
          </Text>
          <Icon
            color='blue600'
            cursor
            name='vertical-arrow-switch'
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
          />
        </QuoteRow>

        {props.pair && (
          <Amounts onClick={handleMinMaxClick}>
            <>
              {amtError === 'BELOW_MIN' ? (
                <CustomErrorCartridge role='button'>
                  <FormattedMessage
                    id='modals.simplebuy.checkout.belowmin'
                    defaultMessage='{value} Minimum {orderType}'
                    values={{
                      value:
                        fix === 'FIAT'
                          ? fiatToString({
                              digits,
                              unit: fiatCurrency,
                              value: min
                            })
                          : coinToString({
                              value: min,
                              unit: { symbol: cryptoCurrency }
                            }),
                      orderType: props.orderType === 'BUY' ? 'Buy' : 'Sell'
                    }}
                  />
                </CustomErrorCartridge>
              ) : (
                <BlueRedCartridge error={amtError === 'ABOVE_MAX'}>
                  <FormattedMessage
                    id='modals.simplebuy.checkout.abovemax'
                    defaultMessage='{value} Maximum {orderType}'
                    values={{
                      value:
                        fix === 'FIAT'
                          ? fiatToString({
                              digits,
                              unit: fiatCurrency,
                              value: max
                            })
                          : coinToString({
                              value: max,
                              unit: { symbol: cryptoCurrency }
                            }),
                      orderType: orderType === 'BUY' ? 'Buy' : 'Sell'
                    }}
                  />
                </BlueRedCartridge>
              )}
            </>
          </Amounts>
        )}

        <Payment {...props} method={method} />

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
        <ActionButton {...props} />
      </FlyoutWrapper>
    </CustomForm>
  )
}

export type Props = OwnProps & SuccessStateType

export default reduxForm<{}, Props>({
  form: 'simpleBuyCheckout',
  destroyOnUnmount: false
})(Success)
