import {
  ageOverEighteen,
  countryUsesPostalcode,
  countryUsesZipcode,
  required,
  requiredDOB,
  requiredZipCode,
  validEmail
} from 'services/FormHelper'
import {
  Banner,
  Button,
  HeartbeatLoader,
  Separator,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  DateInputBox,
  EmailVerification,
  FooterShadowWrapper,
  FormItem,
  SelectBox,
  TextBox
} from 'components/Form'
import { defaultTo, replace } from 'ramda'
import {
  EmailHelper,
  FaqFormGroup,
  FaqFormMessage,
  FaqHeaderHelper,
  Footer,
  IdentityVerificationForm,
  IdentityVerificationHeader,
  InputWrapper,
  Label
} from 'components/IdentityVerification'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { getElementsPropType } from 'utils/proptypes'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import { model } from 'data'
import { SCROLL_REF_ID } from './index'
import media from 'services/ResponsiveService'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Terms from 'components/Terms'

const STICKY_HEADER_HEIGHT = 57
const PADDING = 20

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
  font-weight: 500;
  margin-bottom: 16px;
  display: block;
`

const KycEmailVerification = styled(EmailVerification)`
  label {
    font-size: 16px;
    font-weight: 400;
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

const PersonalAndCountryWrapper = styled.div`
  opacity: ${props => (props.dim ? 0.5 : 1)};
  transition: opacity 0.3s;
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
  showEmailError,
  showStateError,
  showPersonal,
  activeField,
  activeFieldError,
  onCountrySelect,
  onStateSelect,
  onPromptForEmailVerification,
  handleSubmit,
  sendEmailVerification,
  editEmail,
  updateEmail
}) => {
  const scrollToId = id => {
    const element = document.getElementById(id)
    const parent = document.getElementById(SCROLL_REF_ID)
    const { y } = element.getBoundingClientRect()
    parent.scrollTo(0, parent.scrollTop + y - STICKY_HEADER_HEIGHT - PADDING)
  }

  const countryUsesZipOrPostcode =
    countryUsesZipcode(countryCode) || countryUsesPostalcode(countryCode)

  return (
    <IdentityVerificationForm
      activeFieldError={activeFieldError}
      activeField={activeField}
      onSubmit={e =>
        emailVerified ? handleSubmit(e) : onPromptForEmailVerification(e)
      }
    >
      <FooterShadowWrapper
        scrollRefId={SCROLL_REF_ID}
        fields={
          <MediaContextConsumer>
            {({ mobile, tablet }) => (
              <InputWrapper>
                <IdentityVerificationHeader>
                  <FormattedMessage
                    id='identityverification.personal.header'
                    defaultMessage='Personal Details'
                  />
                  <FaqHeaderHelper>
                    <TooltipHost id='identityverification.headerhelper'>
                      <TooltipIcon
                        name='question-in-circle-filled'
                        color='blue900'
                        size='24px'
                      />
                    </TooltipHost>
                  </FaqHeaderHelper>
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
                  <PersonalAndCountryWrapper dim={showEmailError}>
                    <FaqFormGroup>
                      <FormItem>
                        <Label htmlFor='country'>
                          <FormattedMessage
                            id='identityverification.personal.countryrequired'
                            defaultMessage='Country *'
                          />
                        </Label>
                        <Field
                          data-e2e='selectCountryDropdown'
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
                              id='identityverification.personal.staterequired'
                              defaultMessage='State *'
                            />
                          </Label>
                          <Field
                            data-e2e='selectStateDropdown'
                            name='state'
                            validate={[required]}
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
                          defaultMessage='Unfortunately this feature is not available in your state at this time.'
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
                              <Label htmlFor='firstName' id='firstName'>
                                <FormattedMessage
                                  id='identityverification.personal.firstnamerequired'
                                  defaultMessage='First Name *'
                                />
                              </Label>
                              <Field
                                date-e2e='personalInformationFirstName'
                                name='firstName'
                                validate={required}
                                component={TextBox}
                                errorBottom
                                onFocus={() => scrollToId('firstName')}
                              />
                            </PersonalField>
                            <PersonalField>
                              <Label htmlFor='lastName'>
                                <FormattedMessage
                                  id='identityverification.personal.lastnamerequired'
                                  defaultMessage='Last Name *'
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
                              id='identityverification.personal.dateofbirthrequired'
                              defaultMessage='Date of Birth *'
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
                            <Label htmlFor='line1' id='line1'>
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
                            </Label>
                            <Field
                              name='line1'
                              errorBottom
                              validate={required}
                              component={TextBox}
                              onFocus={() => scrollToId('line1')}
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
                            <Field
                              name='line2'
                              errorBottom
                              component={TextBox}
                            />
                          </FormItem>
                        </FaqFormGroup>
                        <FaqFormGroup>
                          <FormItem>
                            <Label htmlFor='city'>
                              <FormattedMessage
                                id='identityverification.personal.cityrequired'
                                defaultMessage='City *'
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
                        <FaqFormGroup>
                          <PersonalItem>
                            {!countryIsUS && (
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
                                  countryCode={countryCode}
                                  component={TextBox}
                                />
                              </PersonalField>
                            )}
                            {countryUsesZipOrPostcode && (
                              <PersonalField>
                                <Label htmlFor='postCode'>
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
                                </Label>
                                <Field
                                  name='postCode'
                                  errorBottom
                                  validate={requiredZipCode}
                                  component={TextBox}
                                />
                              </PersonalField>
                            )}
                          </PersonalItem>
                        </FaqFormGroup>
                      </AddressWrapper>
                    )}
                  </PersonalAndCountryWrapper>
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
            {showEmailError && (
              <EmailHelper error={true}>
                <FormattedMessage
                  id='identityverification.personal.emailerror'
                  defaultMessage='Please verify your email before continuing.'
                />
              </EmailHelper>
            )}
            <Button
              data-e2e='submitSilverVerification'
              type='submit'
              nature='primary'
              disabled={invalid || submitting || showStateError}
            >
              {!submitting ? (
                <FormattedMessage
                  id='buttons.continue'
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
