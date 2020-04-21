import { Button, Icon, Text } from 'blockchain-info-components'
import {
  CreditCardBox,
  CreditCardCVCBox,
  CreditCardExpiryBox,
  FormGroup,
  FormItem,
  FormLabel,
  TextBox
} from 'components/Form'
import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import {
  normalizeCreditCard,
  validateCreditCard
} from 'components/Form/CreditCardBox'
import { normalizeCreditCardCVC } from 'components/Form/CreditCardCVCBox'
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
        <FormattedMessage
          id='modals.simplebuy.addcard'
          defaultMessage='Add Card'
        />
      </TopText>
      <Form onSubmit={props.handleSubmit}>
        <FormGroup>
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
        <FormGroup>
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
        <FormGroup inline>
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
              validate={[required]}
            />
          </FormItem>
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

export default reduxForm<{}, Props>({ form: 'addCCForm' })(Success)
