import { BlueCartridge, CustomCartridge } from 'components/Cartridge'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { maximumAmount, minimumAmount } from './validation'
import { Props as OwnProps, SuccessStateType } from '.'
import ActionButton from './ActionButton'
import CoinSelect from './CoinSelect'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
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
const AmountFieldContainer = styled.div`
  margin-top: 54px;
`
const Amounts = styled.div`
  margin: 24px 0px 40px 0px;
  display: flex;
  justify-content: space-between;
`
const Amount = styled(BlueCartridge)`
  margin-right: 8px;
  cursor: pointer;
`
const GreyCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme.white};
  border: 1px solid ${props => props.theme.grey100};
  color: ${props => props.theme.blue600};
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

type Props = OwnProps & SuccessStateType

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper>
        <TopText color='grey900' size='20px' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.buycrypto'
            defaultMessage='Buy Crypto'
          />
          <Icon
            cursor
            name='close'
            size='20px'
            color='grey600'
            onClick={() => props.handleClose()}
          />
        </TopText>
        <CoinSelect name='pair' {...props} />
        <AmountFieldContainer>
          <Field
            name='amount'
            component={NumberBox}
            validate={[maximumAmount, minimumAmount]}
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
          />
        </AmountFieldContainer>
        {props.fiatCurrency && props.suggestedAmounts[0] ? (
          <Amounts>
            <div>
              {props.suggestedAmounts[0][props.fiatCurrency].map(amount => {
                return (
                  <Amount
                    role='button'
                    onClick={() =>
                      props.simpleBuyActions.handleSBSuggestedAmountClick(
                        amount
                      )
                    }
                  >
                    {fiatToString({
                      unit:
                        Currencies[props.fiatCurrency!].units[
                          props.fiatCurrency!
                        ],
                      value: convertBaseToStandard('FIAT', amount)
                    })}
                  </Amount>
                )
              })}
            </div>
            <GreyCartridge>{props.fiatCurrency}</GreyCartridge>
          </Amounts>
        ) : null}
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
