import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { validate } from 'postal-codes-js'
// @ts-ignore
import postalCodes from 'postal-codes-js/generated/postal-codes-alpha2'
import { path } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { CountryScope } from '@core/types'
import { BlockchainLoader, Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { Padding } from 'components/Padding'
import { actions, model, selectors } from 'data'
import { ResidentialAddress as ResidentialAddressFormValues } from 'data/components/debitCard/types'
import { RootState } from 'data/rootReducer'
import { CountryType, StateType } from 'data/types'
import { useCountryList, useRemote, useUSStateList } from 'hooks'
import { countryUsesZipcode, required } from 'services/forms'

const { RESIDENTIAL_ADDRESS_FORM } = model.components.debitCard

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

const getCountryElements = (countries: Array<CountryType>) => [
  {
    group: '',
    items: countries.map((country: CountryType) => ({
      text: country.name,
      value: country.code
    }))
  }
]

const getStateElements = (states: Array<StateType>) => [
  {
    group: '',
    items: states.map((state: StateType) => ({
      text: state.name,
      value: state.code
    }))
  }
]

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${(props) => props.theme.grey900};
`

const CustomForm = styled(Form)`
  height: 100%;
`

const FormWrapper = styled(Flex)`
  height: 100%;
`

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

type Props = {
  handleClose: () => void
}

const ResidentialAddress = ({
  handleClose,
  invalid,
  submitting
}: InjectedFormProps<{}, Props> & Props) => {
  const dispatch = useDispatch()

  const { data: supportedCountries } = useCountryList({ scope: CountryScope.SIGNUP })
  const { data: supportedUSStates } = useUSStateList()
  const { data: residentialAddress, isLoading: isResidentialAddressLoading } = useRemote(
    selectors.components.debitCard.getResidentialAddress
  )

  const formValues = useSelector((state: RootState) =>
    selectors.form.getFormValues(RESIDENTIAL_ADDRESS_FORM)(state)
  ) as ResidentialAddressFormValues

  const disabled = invalid || submitting

  useEffect(() => {
    dispatch(actions.components.debitCard.getResidentialAddress())
  }, [dispatch])

  useEffect(() => {
    if (residentialAddress) {
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'country', residentialAddress.country))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'state', residentialAddress.state))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'city', residentialAddress.city))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'line1', residentialAddress.line1))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'line2', residentialAddress.line2))
      dispatch(
        actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'postCode', residentialAddress.postCode)
      )
    }
  }, [dispatch, residentialAddress])

  if (
    submitting ||
    !supportedCountries?.countries ||
    !supportedUSStates?.states ||
    isResidentialAddressLoading
  ) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  const onCountryChange = (country: CountryType) => {
    const selectedCountry = supportedCountries.countries.find((c) => c.code === country.code)

    dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'country', selectedCountry))

    dispatch(actions.form.clearFields(RESIDENTIAL_ADDRESS_FORM, false, false, 'state'))
  }

  const onStateChange = (state: StateType) => {
    const selectedState = supportedUSStates.states.find((s) => s.code === state.code)

    dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'state', selectedState))
  }

  const countryUsesZipOrPostcode =
    countryUsesZipcode(formValues?.country) || countryUsesPostalCode(formValues?.country)

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(actions.components.debitCard.submitResidentialAddress())
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='residentialAddressHeader' mode='close' onClick={handleClose}>
        <FormattedMessage
          id='modals.residential_address.title'
          defaultMessage='Verify Your Address'
        />
      </FlyoutHeader>
      <FlyoutContent mode='middle'>
        <CustomForm onSubmit={handleSubmit}>
          <FormWrapper flexDirection='column' justifyContent='space-between'>
            <Padding horizontal={40}>
              <FormGroup>
                <FormItem>
                  <Label htmlFor='line1'>
                    <Text weight={500} size='14px' color='grey900'>
                      {formValues?.country === 'US' ? (
                        <FormattedMessage
                          id='debitcard.residential_address.address_line1required'
                          defaultMessage='Address Line 1 *'
                        />
                      ) : (
                        <FormattedMessage
                          id='debitcard.residential_address.streetline1required'
                          defaultMessage='Street Line 1 *'
                        />
                      )}
                    </Text>
                  </Label>
                  <Field name='line1' errorBottom validate={required} component={TextBox} />
                </FormItem>
              </FormGroup>

              <FormGroup>
                <FormItem>
                  <Label htmlFor='line2'>
                    <Text weight={500} size='14px' color='grey900'>
                      {formValues?.country === 'US' ? (
                        <FormattedMessage
                          id='debitcard.residential_address.address_line2_optional'
                          defaultMessage='Address Line 2 (optional)'
                        />
                      ) : (
                        <FormattedMessage
                          id='debitcard.residential_address.streetline2'
                          defaultMessage='Street Line 2'
                        />
                      )}
                    </Text>
                  </Label>
                  <Field name='line2' errorBottom component={TextBox} />
                </FormItem>
              </FormGroup>

              <FormGroup>
                <FormItem>
                  <Label htmlFor='city'>
                    <Text weight={500} size='14px' color='grey900'>
                      <FormattedMessage
                        id='debitcard.residential_address.cityrequired'
                        defaultMessage='City *'
                      />
                    </Text>
                  </Label>
                  <Field name='city' errorBottom validate={required} component={TextBox} />
                </FormItem>
              </FormGroup>
              <FormGroup inline>
                <FormItem>
                  <FormLabel>
                    {formValues?.country === 'US' ? (
                      <FormattedMessage
                        id='debitcard.residential_address.staterequired'
                        defaultMessage='State *'
                      />
                    ) : (
                      <FormattedMessage
                        id='debitcard.residential_address.region'
                        defaultMessage='Region'
                      />
                    )}
                  </FormLabel>
                  {formValues?.country === 'US' ? (
                    <Field
                      name='state'
                      // @ts-ignore
                      elements={getStateElements(supportedUSStates.states)}
                      onChange={(_, value) => onStateChange(value)}
                      component={SelectBox}
                      errorBottom
                      validate={required}
                    />
                  ) : (
                    <Field
                      name='state'
                      component={TextBox}
                      errorBottom
                      countryCode={formValues?.country}
                    />
                  )}
                </FormItem>
                {countryUsesZipOrPostcode && (
                  <FormItem>
                    <FormLabel htmlFor='postCode'>
                      <Text weight={500} size='14px' color='grey900'>
                        {countryUsesZipcode(formValues?.country) ? (
                          <FormattedMessage
                            id='debitcard.residential_address.zip'
                            defaultMessage='Zip Code *'
                          />
                        ) : (
                          <FormattedMessage
                            id='debitcard.residential_address.postCoderequired'
                            defaultMessage='Postcode *'
                          />
                        )}
                      </Text>
                    </FormLabel>
                    <Field
                      name='postCode'
                      errorBottom
                      validate={requiredZipCode}
                      component={TextBox}
                    />
                  </FormItem>
                )}
              </FormGroup>

              <FormGroup>
                <FormItem>
                  <Label htmlFor='country'>
                    <Text weight={500} size='14px' color='grey900'>
                      <FormattedMessage
                        id='modals.simplebuy.info_and_residential.country'
                        defaultMessage='Country'
                      />
                    </Text>
                  </Label>

                  <Field
                    data-e2e='selectCountryDropdown'
                    name='country'
                    validate={required}
                    // @ts-ignore
                    elements={getCountryElements(supportedCountries.countries)}
                    component={SelectBox}
                    menuPlacement='auto'
                    onChange={(_, value) => onCountryChange(value)}
                    label={
                      <FormattedMessage
                        id='components.selectboxcountry.label'
                        defaultMessage='Select country'
                      />
                    }
                    // we shouldn't be able to change the country
                    disabled
                  />
                </FormItem>
              </FormGroup>
            </Padding>

            <FlyoutFooter collapsed>
              <Button
                data-e2e='submitResidentialAddress'
                height='48px'
                size='16px'
                nature='primary'
                type='submit'
                fullwidth
                disabled={disabled}
              >
                {submitting ? (
                  <HeartbeatLoader height='16px' width='16px' color='white' />
                ) : (
                  <FormattedMessage id='buttons.next' defaultMessage='Next' />
                )}
              </Button>
            </FlyoutFooter>
          </FormWrapper>
        </CustomForm>
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: RESIDENTIAL_ADDRESS_FORM
})(ResidentialAddress)
