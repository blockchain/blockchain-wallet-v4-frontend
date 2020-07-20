import { Button, Icon, Link, Text } from 'blockchain-info-components'
import {
  CreditCardBox,
  CreditCardCVCBox,
  CreditCardExpiryBox,
  FormGroup,
  FormItem,
  FormLabel,
  TextBox
} from 'components/Form'
import {
  DEFAULT_SECURITY_CODE_NAME,
  getCardTypeByValue
} from 'components/Form/CreditCardBox/model'
import { Error } from './model'
import { ErrorCartridge } from 'components/Cartridge'
import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import {
  normalizeCreditCard,
  validateCreditCard
} from 'components/Form/CreditCardBox'
import {
  normalizeCreditCardCVC,
  validateCreditCardCVC
} from 'components/Form/CreditCardCVCBox'
import {
  normalizeCreditCardExpiry,
  validateCreditCardExpiry
} from 'components/Form/CreditCardExpiryBox'
import { Props as OwnProps, SuccessStateType } from '.'
import { required } from 'services/FormHelper'
import { SBAddCardErrorType } from 'data/types'
import { SBBuyOrderType, SBSellOrderType } from 'core/types'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

const Success: React.FC<InjectedFormProps<{}, Props, ErrorType> &
  Props> = props => {
  return (
    <CustomFlyoutWrapper>
      <TopText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          role='button'
          style={{ marginRight: '24px' }}
          onClick={() =>
            props.order
              ? props.simpleBuyActions.setStep({
                  step: 'CHECKOUT_CONFIRM',
                  order: props.order as SBSellOrderType | SBBuyOrderType
                })
              : props.simpleBuyActions.setStep({
                  fiatCurrency: props.fiatCurrency,
                  step: 'PAYMENT_METHODS',
                  pair: props.pair,
                  cryptoCurrency: props.cryptoCurrency || 'BTC',
                  order: props.order
                })
          }
        />
        <FormattedMessage id='buttons.add_card' defaultMessage='Add Card' />
      </TopText>
      <Form onSubmit={props.handleSubmit}>
        <FormGroup margin='24px'>
          <FormLabel>
            <FormattedMessage
              id='modals.simplebuy.name_on_card'
              defaultMessage='Name on Card'
            />
          </FormLabel>
          <Field
            name='name-on-card'
            component={TextBox}
            validate={[required]}
          />
        </FormGroup>
        <FormGroup margin='24px'>
          <FormLabel>
            <FormattedMessage
              id='modals.simplebuy.card_number'
              defaultMessage='Card Number'
            />
          </FormLabel>
          <Field
            name='card-number'
            component={CreditCardBox}
            normalize={normalizeCreditCard}
            validate={[required, validateCreditCard]}
            {...props}
          />
        </FormGroup>
        <FormGroup inline margin='24px'>
          <FormItem>
            <FormLabel>
              <FormattedMessage
                id='modals.simplebuy.expiry_date'
                defaultMessage='Expiry Date'
              />
            </FormLabel>
            <Field
              name='expiry-date'
              placeholder='12/40'
              component={CreditCardExpiryBox as FunctionComponent}
              normalize={normalizeCreditCardExpiry}
              validate={[required, validateCreditCardExpiry]}
            />
          </FormItem>
          <FormItem>
            <FormLabel>
              {(props.formValues &&
                getCardTypeByValue(props.formValues['card-number'])
                  ?.securityCodeName) ||
                DEFAULT_SECURITY_CODE_NAME}
            </FormLabel>
            <Field
              name='cvc'
              component={CreditCardCVCBox as FunctionComponent}
              normalize={normalizeCreditCardCVC}
              validate={[required, validateCreditCardCVC]}
            />
          </FormItem>
        </FormGroup>
        {props.error && (
          <FormGroup>
            <ErrorCartridge>
              <Icon
                name='alert-filled'
                color='red600'
                style={{ marginRight: '4px' }}
              />
              <Error error={props.error} />
            </ErrorCartridge>
          </FormGroup>
        )}
        <FormGroup margin='24px'>
          <Link
            size='13px'
            style={{
              textAlign: 'center',
              width: '100%'
            }}
            onClick={() =>
              props.simpleBuyActions.setStep({ step: 'CC_BILLING_ADDRESS' })
            }
          >
            <FormattedMessage
              id='modals.simplebuy.change_billing_address'
              defaultMessage='Change Billing Address'
            />
          </Link>
        </FormGroup>
        <FormGroup>
          <Button
            nature='primary'
            data-e2e='addCardEnter'
            height='48px'
            size='16px'
            type='submit'
            disabled={props.invalid || props.submitting}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </FormGroup>
      </Form>
    </CustomFlyoutWrapper>
  )
}

export type Props = OwnProps & SuccessStateType
export type ErrorType = SBAddCardErrorType

export default reduxForm<{}, Props, ErrorType>({
  form: 'addCCForm',
  destroyOnUnmount: false
})(Success)
