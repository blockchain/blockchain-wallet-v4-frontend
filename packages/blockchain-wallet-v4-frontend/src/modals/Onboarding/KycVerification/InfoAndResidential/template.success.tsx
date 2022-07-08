import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { validate } from 'postal-codes-js'
// @ts-ignore
import postalCodes from 'postal-codes-js/generated/postal-codes-alpha2'
import { defaultTo, path, replace } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { CountryScope } from '@core/types'
import { BlockchainLoader, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import DateInputBox from 'components/Form/DateInputBox'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { model } from 'data'
import { CountryType, StateType } from 'data/types'
import { useCountryList, useUSStateList } from 'hooks'
import { ageOverEighteen, countryUsesZipcode, required, requiredDOB } from 'services/forms'

import { Props as OwnProps, SuccessStateType } from '.'

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

const { INFO_AND_RESIDENTIAL_FORM } = model.components.identityVerification

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${(props) => props.theme.grey900};
`
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`
export const FullNameContainer = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`
export const CaptionContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
`
export const Caption = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.grey600};
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
const ErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`
const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${(props) => props.theme.red000};
  color: ${(props) => props.theme.red800};
  margin-bottom: 16px;
`

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
      value: state
    }))
  }
]

const addTrailingZero = (string) => (string.length >= 2 ? string : `0${string}`)
const removeTrailingZero = replace(/^0/, '')
const objectToDOB = ({ date = '', month = '', year = '' }) =>
  `${year}-${month}-${addTrailingZero(date)}`
const DOBToObject = (value) => {
  const [year = '', month = '', date = ''] = defaultTo('', value).split('-')
  return {
    date: removeTrailingZero(date),
    month,
    year
  }
}
const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const { data: supportedCountries } = useCountryList({ scope: CountryScope.SIGNUP })
  const { data: supportedUSStates } = useUSStateList()

  const disabled = props.invalid || props.submitting
  const [isCountryStateSet, setCountyStateSet] = useState(false)

  if (props.submitting || !supportedCountries?.countries || !supportedUSStates?.states) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  let countryCode =
    (props.formValues && props.formValues.country && props.formValues.country.code) ||
    props.countryCode

  let stateCode = (props.formValues && props.formValues.state) || props.usState

  if (props.userData?.country && props.userData.country !== countryCode) {
    countryCode = props.userData.country
  }

  if (props.userData?.state && props.userData.state !== stateCode) {
    stateCode = props.userData.state
  }

  const countryIsUS = countryCode === 'US'
  const countryUsesZipOrPostcode =
    countryUsesZipcode(countryCode) || countryUsesPostalCode(countryCode)

  const defaultCountry = supportedCountries.countries.find(
    (country) => country.code === countryCode
  )

  if (defaultCountry && (!props.formValues || (props.formValues && !props.formValues.country))) {
    props.updateDefaultCountry(defaultCountry.code)
  }

  if (countryIsUS && props.userData?.state && !isCountryStateSet) {
    const defaultState = supportedUSStates.states.find((state) => state.code === stateCode)
    if (defaultState) {
      setTimeout(() => {
        props.updateDefaultState(defaultState)
        setCountyStateSet(true)
      }, 500)
    }
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper style={{ borderBottom: 'grey000', paddingBottom: '0px' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <LeftTopCol>
            <Icon
              cursor
              data-e2e='kycBackToCryptoSelection'
              name='arrow-left'
              size='20px'
              color='grey600'
              role='button'
              style={{ marginRight: '8px' }}
              onClick={props.onClose}
            />
            <FormattedMessage
              id='modals.simplebuy.info_and_residential.title'
              defaultMessage='Info & Residential Address'
            />
          </LeftTopCol>
          <Icon
            cursor
            data-e2e='kycCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.onClose}
          />
        </TopText>
      </FlyoutWrapper>
      <FlyoutWrapper style={{ paddingTop: '36px' }}>
        {props.error && (
          <ErrorTextContainer>
            <ErrorText>
              <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
              Error: {props.error}
            </ErrorText>
          </ErrorTextContainer>
        )}
        <FormGroup inline>
          <FormItem>
            <Label htmlFor='firstName'>
              <Text weight={500} size='14px' color='grey900'>
                <FormattedMessage
                  id='identityverification.personal.firstnamerequired'
                  defaultMessage='First Name *'
                />
              </Text>
            </Label>
            <Field
              date-e2e='firstName'
              name='firstName'
              validate={required}
              component={TextBox}
              errorBottom
            />
          </FormItem>
          <FormItem>
            <Label htmlFor='lastName'>
              <Text weight={500} size='14px' color='grey900'>
                <FormattedMessage
                  id='identityverification.personal.lastnamerequired'
                  defaultMessage='Last Name *'
                />
              </Text>
            </Label>
            <Field
              date-e2e='lastName'
              name='lastName'
              validate={required}
              component={TextBox}
              errorBottom
            />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <Caption>
            <FormattedMessage
              id='modals.simplebuy.info_and_residential.id_or_password'
              defaultMessage='As shown on your government issued ID or Passport'
            />
          </Caption>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <Label htmlFor='dob'>
              <Text weight={500} size='14px' color='grey900'>
                <FormattedMessage
                  id='identityverification.personal.dateofbirthrequired'
                  defaultMessage='Date of Birth *'
                />
              </Text>
            </Label>
            <Field
              name='dob'
              validate={[requiredDOB, ageOverEighteen]}
              component={DateInputBox}
              fullwidth
              label
              errorBottom
              countryIsUS={countryIsUS}
              parse={objectToDOB}
              format={DOBToObject}
            />
          </FormItem>

          <CaptionContainer>
            <Icon name='info' style={{ marginRight: '2px' }} />
            <Caption>
              <FormattedMessage
                id='modals.simplebuy.info_and_residential.dob_caption'
                defaultMessage='You must be 18 years of age or older to Buy Crypto.'
              />
            </Caption>
          </CaptionContainer>
        </FormGroup>

        <FormGroup>
          <FormItem>
            <Label htmlFor='line1'>
              <Text weight={500} size='14px' color='grey900'>
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
              </Text>
            </Label>
            <Field name='line1' errorBottom validate={required} component={TextBox} />
          </FormItem>
        </FormGroup>

        <FormGroup>
          <FormItem>
            <Label htmlFor='line2'>
              <Text weight={500} size='14px' color='grey900'>
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
                  id='identityverification.personal.cityrequired'
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
                errorBottom
                validate={[required]}
                disabled={!!stateCode}
              />
            ) : (
              <Field name='state' component={TextBox} errorBottom countryCode={countryCode} />
            )}
          </FormItem>
          {countryUsesZipOrPostcode && (
            <FormItem>
              <FormLabel htmlFor='postCode'>
                <Text weight={500} size='14px' color='grey900'>
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
                </Text>
              </FormLabel>
              <Field name='postCode' errorBottom validate={requiredZipCode} component={TextBox} />
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
              elements={getCountryElements(supportedCountries.countries)}
              component={SelectBox}
              menuPlacement='auto'
              onChange={props.onCountrySelect}
              disabled={!!countryCode}
              label={
                <FormattedMessage
                  id='components.selectboxcountry.label'
                  defaultMessage='Select country'
                />
              }
            />
          </FormItem>
        </FormGroup>
        <Button
          data-e2e='submitKYCInforAndResidential'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
          disabled={disabled}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          )}
        </Button>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export type Props = OwnProps &
  SuccessStateType & {
    onCountrySelect: (e, value: CountryType) => void
    updateDefaultCountry: (country: CountryType) => void
    updateDefaultState: (state: StateType) => void
  }

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: INFO_AND_RESIDENTIAL_FORM
})(Success)
