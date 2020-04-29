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
import { ErrorCartridge } from 'components/Cartridge'
import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
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
import { required } from 'services/FormHelper'
import React from 'react'
import styled from 'styled-components'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <CustomFlyoutWrapper>
      <TopText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          style={{ marginRight: '24px' }}
          role='button'
          onClick={() =>
            props.simpleBuyActions.setStep({
              fiatCurrency: props.fiatCurrency,
              step: 'ENTER_AMOUNT'
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
              component={CreditCardExpiryBox}
              normalize={normalizeCreditCardExpiry}
              validate={[required, validateCreditCardExpiry]}
            />
          </FormItem>
          <FormItem>
            <FormLabel>CVC</FormLabel>
            <Field
              name='cvc'
              component={CreditCardCVCBox}
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
              Error: {props.error}
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

type Props = OwnProps & LinkDispatchPropsType & SuccessStateType

export default reduxForm<{}, Props>({
  form: 'addCCForm',
  destroyOnUnmount: false
})(Success)
