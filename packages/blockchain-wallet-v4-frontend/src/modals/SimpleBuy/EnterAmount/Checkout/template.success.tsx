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
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import Failure from '../template.failure'
import React from 'react'
import styled from 'styled-components'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
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
    }
  }
  > div {
    height: auto;
    input {
      height: auto;
      outline: 0;
    }
  }
  > div > div:last-child {
    display: none;
  }
`
const Amounts = styled.div`
  margin: 24px 0 40px;
  display: flex;
  justify-content: space-between;
`
const Amount = styled(BlueCartridge)`
  margin-right: 8px;
  cursor: pointer;
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

const JumpToPayment = styled.div`
  border: 1px solid ${props => props.theme.grey100};
  box-sizing: border-box;
  width: 400px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 23px 28px 28px 28px;
  line-height: 32px;
  justify-content: space-between;
`

const JumpIconWrapper = styled.div`
  background-color: ${props => props.theme.blue000};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 22px;
`
const JumpText = styled(Text)`
  width: 285px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
`

export type Props = OwnProps & SuccessStateType

const normalizeAmount = (
  value,
  prevValue,
  allValues: SBCheckoutFormValuesType
) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, allValues.orderType === 'BUY')
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const { fiatCurrency } = props

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
      getMaxMin(props.pair, prop, props.formValues, props.method)
    )
    props.simpleBuyActions.handleSBSuggestedAmountClick(value)
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper>
        <TopText color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.buycrypto'
            defaultMessage='Buy Crypto'
          />
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
        <AmountFieldContainer>
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
                        props.formValues,
                        props.method
                      ),
                      digits: 0
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
                        props.formValues,
                        props.method
                      ),
                      digits: 0
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
        <JumpToPayment
          onClick={() =>
            props.simpleBuyActions.setStep({
              step: 'PAYMENT_METHODS',
              pair: props.pair,
              fiatCurrency: props.fiatCurrency || 'USD'
            })
          }
        >
          <JumpIconWrapper>
            <Icon
              cursor
              name='plus-in-circle-filled'
              size='22px'
              color='blue600'
              style={{ marginLeft: '4px' }}
            />
          </JumpIconWrapper>
          <JumpText>
            <FormattedMessage
              id='modals.simplebuy.confirm.jump_to_payment'
              defaultMessage='Select Cash or Card'
            />
          </JumpText>
          <Icon cursor name='arrow-right' size='20px' color='grey600' />
        </JumpToPayment>
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

export default reduxForm<{}, Props>({
  form: 'simpleBuyCheckout',
  destroyOnUnmount: false
})(Success)
