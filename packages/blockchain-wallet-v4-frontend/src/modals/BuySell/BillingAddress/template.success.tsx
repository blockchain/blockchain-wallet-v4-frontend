import React from 'react'
import { FormattedMessage } from 'react-intl'
import { validate } from 'postal-codes-js'
// @ts-ignore
import postalCodes from 'postal-codes-js/generated/postal-codes-alpha2'
import { path } from 'ramda'
import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { model } from 'data'
import { StateType } from 'data/types'
import { useUSStateList } from 'hooks'
import { countryUsesZipcode, required } from 'services/forms'

import { Props as OwnProps, SuccessStateType } from '.'
import CountrySelect from './CountrySelect'

const { FORMS_BS_BILLING_ADDRESS } = model.components.buySell

const countryUsesPostalCode = (countryCode) => {
  return path([countryCode, 'postalCodeFormat'], postalCodes)
}

const requiredZipCode = (value, allVals) => {
  const countryCode = (path(['country', 'code'], allVals) || path(['country'], allVals)) as string
  if (!path([countryCode, 'postalCodeFormat'], postalCodes)) return undefined
  if (!value)
    return (
      <div data-e2e='requiredMessage'>
        <FormattedMessage id='formhelper.required' defaultMessage='Required' />
      </div>
    )

  return validate(countryCode, value) === true ? undefined : (
    <FormattedMessage id='formhelper.requiredzipcode' defaultMessage='Invalid zipcode' />
  )
}

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  border-bottom: 1px solid ${(props) => props.theme.grey000};
  padding-bottom: 0;
`
const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

export type Props = OwnProps & SuccessStateType

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const { data: supportedUSStates } = useUSStateList()

  if (!props.formValues || !supportedUSStates?.states) return null

  const getStateElements = (states: Array<StateType>) => [
    {
      group: '',
      items: states.map((state: StateType) => ({
        text: state.name,
        value: state.code
      }))
    }
  ]

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
                props.buySellActions.setStep({
                  step: 'DETERMINE_CARD_PROVIDER'
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
                  id='identityverification.personal.address_line2_optional'
                  defaultMessage='Address Line 2 (optional)'
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
                  elements={getStateElements(supportedUSStates.states)}
                  component={SelectBox}
                  validate={[required]}
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
                <Field name='postCode' validate={requiredZipCode} component={TextBox} />
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
              id='modals.simplebuy.save_billing_address'
              defaultMessage='Save Billing Address'
            />
          </Button>
        </FlyoutWrapper>
      </Form>
    </>
  )
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: FORMS_BS_BILLING_ADDRESS
})(Success)
