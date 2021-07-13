import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import {
  FormGroup,
  FormItem,
  FormLabel,
  SelectBoxUSState,
  TextBox
} from 'components/Form'
import {
  countryUsesPostalCode,
  countryUsesZipcode,
  required,
  requiredZipCode
} from 'services/forms'

import { Props as OwnProps, SuccessStateType } from '.'
import CountrySelect from './CountrySelect'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  border-bottom: 1px solid ${props => props.theme.grey000};
  padding-bottom: 0px;
`
const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

export type Props = OwnProps & SuccessStateType

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  if (!props.formValues) return null

  const countryCode = props.formValues.country
  const countryIsUS = countryCode === 'US'
  const countryUsesZipOrPostcode =
    countryUsesZipcode(countryCode) || countryUsesPostalCode(countryCode)

  return (
    <>
      <Form onSubmit={props.handleSubmit}>
        <CustomFlyoutWrapper>
          <Top color='grey800' size='20px' weight={600}>
            <Icon
              cursor
              name='arrow-left'
              size='20px'
              color='grey600'
              style={{ marginRight: '24px' }}
              role='button'
              onClick={() =>
                props.simpleBuyActions.setStep({
                  step: 'ADD_CARD'
                })
              }
            />
            <FormattedMessage
              id='modals.simplebuy.billing_address'
              defaultMessage='Billing Address'
            />
          </Top>
          <CountrySelect {...props} />
        </CustomFlyoutWrapper>
        <FlyoutWrapper>
          <FormGroup margin='24px'>
            <FormLabel>
              {countryIsUS ? (
                <FormattedMessage
                  id='identityverification.personal.address_line1required'
                  defaultMessage='Address Line 1 *'
                />
              ) : (
                <FormattedMessage
                  id='identityverification.personal.streetline1required'
                  defaultMessage='Street Line 1 *'
                />
              )}
            </FormLabel>
            <Field name='line1' validate={required} component={TextBox} />
          </FormGroup>
          <FormGroup margin='24px'>
            <FormLabel>
              {countryIsUS ? (
                <FormattedMessage
                  id='identityverification.personal.address_line2'
                  defaultMessage='Address Line 2'
                />
              ) : (
                <FormattedMessage
                  id='identityverification.personal.streetline2'
                  defaultMessage='Street Line 2'
                />
              )}
            </FormLabel>
            <Field name='line2' component={TextBox} />
          </FormGroup>
          <FormGroup margin='24px'>
            <FormLabel>
              <FormattedMessage
                id='identityverification.personal.cityrequired'
                defaultMessage='City *'
              />
            </FormLabel>
            <Field name='city' validate={required} component={TextBox} />
          </FormGroup>
          <FormGroup inline>
            <FormItem>
              <FormLabel>
                {countryIsUS ? (
                  <FormattedMessage
                    id='identityverification.personal.staterequired'
                    defaultMessage='State *'
                  />
                ) : (
                  <FormattedMessage
                    id='identityverification.personal.region'
                    defaultMessage='Region'
                  />
                )}
              </FormLabel>
              {countryIsUS ? (
                <Field
                  name='state'
                  component={SelectBoxUSState}
                  validate={[required]}
                  normalize={val => val.name}
                />
              ) : (
                <Field name='state' component={TextBox} />
              )}
            </FormItem>
            {countryUsesZipOrPostcode && (
              <FormItem>
                <FormLabel htmlFor='postCode'>
                  {countryUsesZipcode(countryCode) ? (
                    <FormattedMessage
                      id='identityverification.personal.zip'
                      defaultMessage='Zip Code *'
                    />
                  ) : (
                    <FormattedMessage
                      id='identityverification.personal.postcoderequired'
                      defaultMessage='Postcode *'
                    />
                  )}
                </FormLabel>
                <Field
                  name='postCode'
                  validate={requiredZipCode}
                  component={TextBox}
                />
              </FormItem>
            )}
          </FormGroup>
          <Button
            fullwidth
            type='submit'
            data-e2e='udpateBillingAddr'
            nature='primary'
            height='48px'
            size='16px'
          >
            <FormattedMessage
              id='modals.simplebuy.save_my_card'
              defaultMessage='Save My Card'
            />
          </Button>
        </FlyoutWrapper>
      </Form>
    </>
  )
}

export default reduxForm<{}, Props>({
  form: 'ccBillingAddress',
  destroyOnUnmount: false
})(Success)
