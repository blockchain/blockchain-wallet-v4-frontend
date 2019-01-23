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
  requiredZipCode,
  validEmail
} from 'services/FormHelper'
import { model } from 'data'
import media from 'services/ResponsiveService'
import { getElementsPropType } from 'utils/proptypes'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

import {
  Banner,
  Button,
  HeartbeatLoader,
  Separator,
  Text
} from 'blockchain-info-components'
import {
  DateInputBox,
  FooterShadowWrapper,
  FormItem,
  EmailVerification,
  SelectBox,
  TextBox
} from 'components/Form'
import {
  EmailHelper,
  IdentityVerificationForm,
  InputWrapper,
  IdentityVerificationHeader,
  FaqFormMessage,
  FaqFormGroup,
  Label,
  Footer
} from 'components/IdentityVerification'
import Terms from 'components/Terms'

const FormContainer = styled.div`
  margin-top: 24px;
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
const EmailVerificationLabel = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 16px;
  display: block;
`

const KycEmailVerification = styled(EmailVerification)`
  label {
    font-size: 16px;
    font-weight: 300;
    margin-bottom: 12px;
    display: block;
  }
`

const KycSeparator = styled(Separator)`
  max-width: 576px;
  width: calc(100% - 260px);
  margin: 32px 0;
  ${media.mobile`
    width: 100%;
  `} ${media.tablet`
    width: 100%;
  `};
`

const addTrailingZero = string => (string.length >= 2 ? string : `0${string}`)
const removeTrailingZero = replace(/^0/, '')
const { AddressPropType, CountryPropType } = model.profile
const { PERSONAL_FORM, EMAIL_STEPS } = model.components.identityVerification
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
  showEmail,
  emailVerified,
  emailStep,
  supportedCountries,
  states,
  countryCode,
  countryIsUS,
  showStateError,
  showPersonal,
  activeField,
  activeFieldError,
  onCountrySelect,
  onStateSelect,
  handleSubmit,
  sendEmailVerification,
  editEmail,
  updateEmail
}) => {
  return (
    <IdentityVerificationForm
      activeFieldError={activeFieldError}
      activeField={activeField}
      onSubmit={handleSubmit}
    >
      <FooterShadowWrapper
        fields={
          <MediaContextConsumer>
            {({ mobile, tablet }) => (
              <InputWrapper>
                <IdentityVerificationHeader>
                  <FormattedMessage
                    id='identityverification.personal.header'
                    defaultMessage='Personal Details'
                  />
                </IdentityVerificationHeader>
                <FormContainer>
                  {showEmail && !emailVerified && (
                    <EmailVerificationLabel htmlFor='email'>
                      <FormattedMessage
                        id='identityverification.personal.verifyemail'
                        defaultMessage='Verify Your Email Address'
                      />
                    </EmailVerificationLabel>
                  )}
                  {showEmail && (
                    <React.Fragment>
                      <FaqFormGroup>
                        <FormItem>
                          <Field
                            name='email'
                            component={KycEmailVerification}
                            validate={[required, validEmail]}
                            verificationSent={emailStep === EMAIL_STEPS.verify}
                            verified={emailVerified}
                            onVerificationSend={sendEmailVerification}
                            onUpdate={updateEmail}
                            onEdit={editEmail}
                            errorBottom
                          />
                        </FormItem>
                      </FaqFormGroup>
                      <KycSeparator />
                    </React.Fragment>
                  )}
                  <FaqFormGroup>
                    <FormItem>
                      <Label htmlFor='country'>
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
                            id='components.selectboxcountry.label'
                            defaultMessage='Select country'
                          />
                        }
                      />
                    </FormItem>
                  </FaqFormGroup>
                  {countryIsUS && (
                    <FaqFormGroup>
                      <FormItem>
                        <Label htmlFor='state'>
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
                    <React.Fragment>
                      <KycSeparator />
                      <FaqFormGroup>
                        <PersonalItem>
                          <PersonalField>
                            <Label htmlFor='firstName'>
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
                            <Label htmlFor='lastName'>
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
                          !mobile &&
                          !tablet && (
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
                    </React.Fragment>
                  )}
                  {showPersonal && (
                    <FaqFormGroup>
                      <FormItem>
                        <Label htmlFor='dob'>
                          <FormattedMessage
                            id='identityverification.personal.dateofbirth'
                            defaultMessage='Date of Birth'
                          />
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
                      {activeField === 'dob' && !mobile && !tablet && (
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
                      <KycSeparator />
                      <FaqFormGroup>
                        <FormItem>
                          <Label htmlFor='line1'>
                            {countryIsUS ? (
                              <FormattedMessage
                                id='identityverification.personal.address_line1'
                                defaultMessage='Address Line 1'
                              />
                            ) : (
                              <FormattedMessage
                                id='identityverification.personal.streetline1'
                                defaultMessage='Street Line 1'
                              />
                            )}
                          </Label>
                          <Field
                            name='line1'
                            errorBottom
                            validate={required}
                            component={TextBox}
                          />
                        </FormItem>
                      </FaqFormGroup>
                      <FaqFormGroup>
                        <FormItem>
                          <Label htmlFor='line2'>
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
                          </Label>
                          <Field name='line2' errorBottom component={TextBox} />
                        </FormItem>
                      </FaqFormGroup>
                      <FaqFormGroup>
                        <FormItem>
                          <Label htmlFor='city'>
                            <FormattedMessage
                              id='identityverification.personal.city'
                              defaultMessage='City'
                            />
                          </Label>
                          <Field
                            name='city'
                            errorBottom
                            validate={required}
                            component={TextBox}
                          />
                        </FormItem>
                      </FaqFormGroup>
                      {!countryIsUS && (
                        <FaqFormGroup>
                          <PersonalItem>
                            <PersonalField>
                              <Label htmlFor='state'>
                                <FormattedMessage
                                  id='identityverification.personal.region'
                                  defaultMessage='Region'
                                />
                              </Label>
                              <Field
                                name='state'
                                errorBottom
                                validate={required}
                                countryCode={countryCode}
                                component={TextBox}
                              />
                            </PersonalField>
                            <PersonalField>
                              <Label htmlFor='postCode'>
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
                            </PersonalField>
                          </PersonalItem>
                        </FaqFormGroup>
                      )}
                      {countryIsUS && (
                        <FaqFormGroup>
                          <FormItem>
                            <Label htmlFor='postCode'>
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
                      )}
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
              disabled={
                invalid || submitting || showStateError || !emailVerified
              }
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
}

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
