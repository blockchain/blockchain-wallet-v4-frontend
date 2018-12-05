import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import { defaultTo, replace } from 'ramda'

import {
  required,
  requiredDOB,
  ageOverEighteen,
  requiredZipCode
} from 'services/FormHelper'
import { model } from 'data'
import media from 'services/ResponsiveService'
import { getElementsPropType } from 'utils/proptypes'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

import {
  Button,
  Text,
  Banner,
  HeartbeatLoader
} from 'blockchain-info-components'
import {
  DateInputBox,
  FooterShadowWrapper,
  FormItem,
  TextBox,
  SelectBox
} from 'components/Form'
import {
  EmailHelper,
  IdentityVerificationForm,
  InputWrapper,
  IdentityVerificationHeader,
  IdentityVerificationSubHeader,
  FaqFormMessage,
  FaqFormGroup,
  Label,
  Footer
} from 'components/IdentityVerification'
import Terms from 'components/Terms'

const FormContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
  ${media.mobile`
    margin-bottom: 40px;
  `};
`
const PersonalItem = styled(FormItem)`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const PersonalField = styled.div`
  width: 100%;
  :first-of-type {
    margin-right: 15px;
  }
  ${media.mobile`
    :first-of-type {
      margin-right: 0;
      margin-bottom: 24px;
    }
  `};
`
const TermsText = styled(Text)`
  width: 50%;
  font-weight: 300px;
  font-size: 12px;
`
const LabeledDateInputBox = styled(DateInputBox)`
  ${media.mobile`
    .inputs-wrapper {
      margin-top: 54px;
    }
  `};
`
const ErrorBanner = styled(Banner)`
  width: 60%;
  max-width: 800px;
  box-sizing: border-box;
  padding: 16px;
  > span {
    display: none;
  }
  > div {
    display: flex;
    flex-direction: column;

    text-transform: none;
    font-size: 14px;
  }
`
const AddressWrapper = styled.div`
  margin-bottom: 120px;
`

const addTrailingZero = string => (string.length >= 2 ? string : `0${string}`)
const removeTrailingZero = replace(/^0/, '')
const { AddressPropType, CountryPropType } = model.profile
const { PERSONAL_FORM } = model.components.identityVerification
const objectToDOB = ({ date = '', month = '', year = '' }) =>
  `${year}-${month}-${addTrailingZero(date)}`
const DOBToObject = value => {
  const [year = '', month = '', date = ''] = defaultTo('', value).split('-')
  return {
    date: removeTrailingZero(date),
    month,
    year
  }
}
const countryUsesZipcode = code => code === 'US'

const Personal = ({
  invalid,
  submitting,
  error,
  supportedCountries,
  states,
  countryCode,
  showStateSelect,
  showStateError,
  showPersonal,
  activeField,
  onCountrySelect,
  onStateSelect,
  handleSubmit
}) => (
  <IdentityVerificationForm onSubmit={handleSubmit}>
    <FooterShadowWrapper
      fields={
        <MediaContextConsumer>
          {({ mobile }) => (
            <InputWrapper>
              <IdentityVerificationHeader>
                <FormattedMessage
                  id='identityverification.personal.header'
                  defaultMessage='Personal Details'
                />
              </IdentityVerificationHeader>
              <IdentityVerificationSubHeader>
                <FormattedMessage
                  id='identityverification.personal.subheader'
                  defaultMessage='To get started, we need to verify your identity. It should only take a few minutes.'
                />
              </IdentityVerificationSubHeader>
              <FormContainer>
                <FaqFormGroup>
                  <FormItem>
                    <Label>
                      <FormattedMessage
                        id='identityverification.personal.country'
                        defaultMessage='Select your country of residence'
                      />
                    </Label>
                    <Field
                      name='country'
                      validate={required}
                      elements={supportedCountries}
                      component={SelectBox}
                      menuPlacement='auto'
                      onChange={onCountrySelect}
                      label={
                        <FormattedMessage
                          id='identityverification.personal.country.label'
                          defaultMessage='Select country'
                        />
                      }
                    />
                  </FormItem>
                </FaqFormGroup>
                {showStateSelect && (
                  <FaqFormGroup>
                    <FormItem>
                      <Label>
                        <FormattedMessage
                          id='identityverification.personal.state'
                          defaultMessage='State'
                        />
                      </Label>
                      <Field
                        name='state'
                        validate={required}
                        elements={states}
                        component={SelectBox}
                        menuPlacement='auto'
                        onChange={onStateSelect}
                        label={
                          <FormattedMessage
                            id='identityverification.personal.label.state'
                            defaultMessage='Select your state'
                          />
                        }
                      />
                    </FormItem>
                  </FaqFormGroup>
                )}
                {showStateError && (
                  <ErrorBanner type='warning'>
                    <FormattedMessage
                      id='identityverification.personal.unavailable'
                      defaultMessage='Unfortunately exchange is not available in your state at this time.'
                    />
                    <FormattedMessage
                      id='identityverification.personal.unavailablenotify'
                      defaultMessage='We will notify you when we expand to your area.'
                    />
                  </ErrorBanner>
                )}
                {showPersonal && (
                  <FaqFormGroup>
                    <PersonalItem>
                      <PersonalField>
                        <Label>
                          <FormattedMessage
                            id='identityverification.personal.firstname'
                            defaultMessage='First Name'
                          />
                        </Label>
                        <Field
                          name='firstName'
                          validate={required}
                          component={TextBox}
                          errorBottom
                        />
                      </PersonalField>
                      <PersonalField>
                        <Label>
                          <FormattedMessage
                            id='identityverification.personal.lastname'
                            defaultMessage='Last Name'
                          />
                        </Label>
                        <Field
                          name='lastName'
                          validate={required}
                          component={TextBox}
                          errorBottom
                        />
                      </PersonalField>
                    </PersonalItem>
                    {(activeField === 'firstName' ||
                      activeField === 'lastName') &&
                      !mobile && (
                        <FaqFormMessage
                          icon='id-card'
                          title={
                            <FormattedMessage
                              id='identityverification.personal.faq.name.title'
                              defaultMessage='First & Last Name'
                            />
                          }
                          text={
                            <FormattedMessage
                              id='identityverification.personal.faq.name.text'
                              defaultMessage='They should match exactly the details in your passport or driving license.'
                            />
                          }
                        />
                      )}
                  </FaqFormGroup>
                )}
                {showPersonal && (
                  <FaqFormGroup>
                    <FormItem>
                      <Label>
                        <FormattedMessage
                          id='identityverification.personal.dateofbirth'
                          defaultMessage='Date of Birth'
                        />
                      </Label>
                      <Field
                        name='dob'
                        validate={[requiredDOB, ageOverEighteen]}
                        component={LabeledDateInputBox}
                        fullwidth
                        label
                        errorBottom
                        parse={objectToDOB}
                        format={DOBToObject}
                      />
                    </FormItem>
                    {activeField === 'dob' &&
                      !mobile && (
                        <FaqFormMessage
                          icon='birthday-cake-light'
                          title={
                            <FormattedMessage
                              id='identityverification.personal.faq.dateofbirth.title'
                              defaultMessage='Age requirement'
                            />
                          }
                          text={
                            <FormattedMessage
                              id='identityverification.personal.faq.dateofbirth.text'
                              defaultMessage='Users must be at least 18 years old to trade crypto'
                            />
                          }
                        />
                      )}
                  </FaqFormGroup>
                )}
                {showPersonal && (
                  <AddressWrapper>
                    <FaqFormGroup>
                      <FormItem>
                        <Label>
                          <FormattedMessage
                            id='identityverification.personal.address'
                            defaultMessage='Address'
                          />
                        </Label>
                        <Field
                          name='line1'
                          validate={required}
                          component={TextBox}
                          placeholder='Street Address'
                        />
                      </FormItem>
                    </FaqFormGroup>
                    <FaqFormGroup>
                      <FormItem>
                        <Label>
                          <FormattedMessage
                            id='identityverification.personal.address2'
                            defaultMessage='Address 2'
                          />
                        </Label>
                        <Field
                          name='line2'
                          component={TextBox}
                          placeholder='Apartment, unit, floor, etc..'
                        />
                      </FormItem>
                    </FaqFormGroup>
                    <FaqFormGroup>
                      <FormItem>
                        <Label>
                          <FormattedMessage
                            id='identityverification.personal.city'
                            defaultMessage='City'
                          />
                        </Label>
                        <Field
                          name='city'
                          validate={required}
                          component={TextBox}
                        />
                      </FormItem>
                    </FaqFormGroup>
                    {!showStateSelect && (
                      <FaqFormGroup>
                        <FormItem>
                          <Label>
                            <FormattedMessage
                              id='identityverification.personal.region'
                              defaultMessage='Region'
                            />
                          </Label>
                          <Field
                            name='state'
                            validate={required}
                            countryCode={countryCode}
                            component={TextBox}
                          />
                        </FormItem>
                      </FaqFormGroup>
                    )}
                    <FaqFormGroup>
                      <FormItem>
                        <Label>
                          {countryUsesZipcode(countryCode) ? (
                            <FormattedMessage
                              id='identityverification.personal.zipcode'
                              defaultMessage='Zip Code'
                            />
                          ) : (
                            <FormattedMessage
                              id='identityverification.personal.postcode'
                              defaultMessage='Postcode'
                            />
                          )}
                        </Label>
                        <Field
                          name='postCode'
                          errorBottom
                          validate={requiredZipCode}
                          component={TextBox}
                        />
                      </FormItem>
                    </FaqFormGroup>
                  </AddressWrapper>
                )}
              </FormContainer>
            </InputWrapper>
          )}
        </MediaContextConsumer>
      }
      footer={
        <Footer>
          <TermsText>
            <Terms company='blockchain-kyc' />
          </TermsText>
          {error && (
            <EmailHelper error={true}>
              <FormattedMessage
                id='identityverification.personal.error'
                defaultMessage='Failed to save personal data. Please try again'
              />
            </EmailHelper>
          )}
          <Button
            nature='primary'
            type='submit'
            disabled={invalid || submitting || showStateError}
          >
            {!submitting ? (
              <FormattedMessage
                id='identityverification.personal.continue'
                defaultMessage='Continue'
              />
            ) : (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            )}
          </Button>
        </Footer>
      }
    />
  </IdentityVerificationForm>
)

Personal.propTypes = {
  address: AddressPropType,
  supportedCountries: getElementsPropType(CountryPropType),
  countryCode: PropTypes.string.isRequired,
  activeField: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: PERSONAL_FORM,
  destroyOnUnmount: false
})(Personal)
