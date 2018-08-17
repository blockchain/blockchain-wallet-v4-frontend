import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import { replace } from 'ramda'

import { required, requiredDOB, ageOverEighteen } from 'services/FormHelper'
import { model } from 'data'
import media from 'services/ResponsiveService'
import { getElementsPropType } from 'utils/proptypes'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

import { Button, Text, HeartbeatLoader } from 'blockchain-info-components'
import {
  DateInputBox,
  FaqMessage,
  FooterShadowWrapper,
  FormGroup,
  FormItem,
  TextBox,
  SelectBox
} from 'components/Form'
import {
  Form,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  EmailHelper
} from 'components/IdentityVerification'
import Terms from 'components/Terms'
import { countryHasStates } from 'components/Form/SelectBoxRegion'

const FormContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 138px;
  ${media.mobile`
    margin-bottom: 40px;
  `};
`
const PersonalForm = styled(Form)`
  height: 100%;
`
const PersonalFormGroup = styled(FormGroup)`
  width: 60%;
  ${media.mobile`
    width: 100%;
    flex-direction: column;
    div:first-of-type {
      margin-bottom: 10px;
    }
  `};
`
const FaqFormMessage = styled(FaqMessage)`
  position: absolute;
  margin-top: 23px;
  right: 0;
  width: 35%;
`
const FaqFormGroup = styled(FormGroup)`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const FaqFormItem = styled(FormItem)`
  width: 60%;
  ${media.mobile`
    width: 100%;
  `};
`
const Footer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${media.mobile`
    width: 100%;
  `};
`
const TermsText = styled(Text)`
  width: 50%;
  font-weight: 300px;
  font-size: 12px;
`
const addTrailingZero = string => (string.length >= 2 ? string : `0${string}`)
const removeTrailingZero = replace(/^0/, '')
const { AddressPropType, CountryPropType } = model.profile
const { PERSONAL_FORM } = model.components.identityVerification
const objectToDOB = ({ date = '', month = '', year = '' }) =>
  `${year}-${month}-${addTrailingZero(date)}`
const DOBToObject = (value = '') => {
  const [year = '', month = '', date = ''] = value.split('-')
  return {
    date: removeTrailingZero(date),
    month,
    year
  }
}

const Personal = ({
  invalid,
  submitting,
  address,
  addressRefetchVisible,
  supportedCountries,
  possibleAddresses,
  countryCode,
  activeField,
  onCountrySelect,
  onAddressSelect,
  onPostCodeChange,
  handleSubmit
}) => (
  <PersonalForm onSubmit={handleSubmit}>
    <FooterShadowWrapper
      fields={
        <MediaContextConsumer>
          {({ mobile }) => (
            <InputWrapper>
              <PartnerHeader>
                <FormattedMessage
                  id='identityverification.personal.header'
                  defaultMessage='Personal Details'
                />
              </PartnerHeader>
              <PartnerSubHeader>
                <FormattedMessage
                  id='identityverification.personal.subheader'
                  defaultMessage="There's so much we'd love to know about you, but we only need a few things."
                />
              </PartnerSubHeader>
              <FormContainer>
                <PersonalFormGroup inline>
                  <FaqFormItem>
                    <Text
                      size='14px'
                      weight={400}
                      style={{ marginBottom: '5px' }}
                    >
                      <FormattedMessage
                        id='identityverification.personal.firstname'
                        defaultMessage='First Name'
                      />
                    </Text>
                    <Field
                      name='firstName'
                      validate={[required]}
                      component={TextBox}
                    />
                  </FaqFormItem>
                  <FaqFormItem>
                    <Text
                      size='14px'
                      weight={400}
                      style={{ marginBottom: '5px' }}
                    >
                      <FormattedMessage
                        id='identityverification.personal.lastname'
                        defaultMessage='Last Name'
                      />
                    </Text>
                    <Field
                      name='lastName'
                      validate={[required]}
                      component={TextBox}
                    />
                  </FaqFormItem>
                </PersonalFormGroup>
                <FaqFormGroup>
                  <FaqFormItem>
                    <Text
                      size='14px'
                      weight={400}
                      style={{ marginBottom: '5px' }}
                    >
                      <FormattedMessage
                        id='identityverification.personal.dateofbirth'
                        defaultMessage='Your Birthday'
                      />
                    </Text>
                    <Field
                      name='dob'
                      validate={[requiredDOB, ageOverEighteen]}
                      component={DateInputBox}
                      fullwidth={true}
                      errorBottom
                      parse={objectToDOB}
                      format={DOBToObject}
                    />
                  </FaqFormItem>
                  {activeField === 'dob' &&
                    !mobile && (
                      <FaqFormMessage
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
                <FormGroup>
                  <FaqFormItem>
                    <Text
                      size='14px'
                      weight={400}
                      style={{ marginBottom: '5px' }}
                    >
                      <FormattedMessage
                        id='identityverification.personal.country'
                        defaultMessage='Country'
                      />
                    </Text>
                    <Field
                      name='country'
                      validate={[required]}
                      elements={supportedCountries}
                      component={SelectBox}
                      onChange={onCountrySelect}
                      label={
                        <FormattedMessage
                          id='components.selectboxcountry.label'
                          defaultMessage='Select country'
                        />
                      }
                    />
                  </FaqFormItem>
                </FormGroup>
                {countryCode && (
                  <FaqFormGroup>
                    <FaqFormItem>
                      <Text
                        size='14px'
                        weight={400}
                        style={{ marginBottom: '5px' }}
                      >
                        <FormattedMessage
                          id='identityverification.personal.zipcode'
                          defaultMessage='Zip Code'
                        />
                      </Text>
                      <Field
                        name='postCode'
                        onChange={onPostCodeChange}
                        errorBottom
                        validate={[required]}
                        component={TextBox}
                      />
                    </FaqFormItem>
                    {activeField === 'postCode' && (
                      <FaqFormMessage
                        title={
                          <FormattedMessage
                            id='identityverification.personal.faq.postcode.title'
                            defaultMessage='Address search'
                          />
                        }
                        text={
                          <FormattedMessage
                            id='identityverification.personal.faq.postcode.text'
                            defaultMessage='We try and prefill your address so you don’t have to fill out all the fields'
                          />
                        }
                      />
                    )}
                  </FaqFormGroup>
                )}
                {countryCode &&
                  addressRefetchVisible &&
                  !mobile && (
                    <EmailHelper error={true}>
                      <FormattedMessage
                        id='identityverification.personal.addressrefetch'
                        defaultMessage='Ooops, address lookup failed. {retry}'
                        values={{
                          retry: <a onClick={onPostCodeChange}>Try again?</a>
                        }}
                      />
                    </EmailHelper>
                  )}
                {Boolean(possibleAddresses[0].items.length) && (
                  <FormGroup>
                    <FaqFormItem>
                      <Text
                        size='14px'
                        weight={400}
                        style={{ marginBottom: '5px' }}
                      >
                        <FormattedMessage
                          id='identityverification.personal.selectaddress'
                          defaultMessage='Select Address'
                        />
                      </Text>
                      <Field
                        name='address'
                        elements={possibleAddresses}
                        onChange={onAddressSelect}
                        component={SelectBox}
                        label={
                          <FormattedMessage
                            id='identityverification.personal.selectaddress'
                            defaultMessage='Select Address'
                          />
                        }
                      />
                    </FaqFormItem>
                  </FormGroup>
                )}
                {address && (
                  <div>
                    <FormGroup>
                      <FaqFormItem>
                        <Text
                          size='14px'
                          weight={400}
                          style={{ marginBottom: '5px' }}
                        >
                          <FormattedMessage
                            id='identityverification.personal.address'
                            defaultMessage='Address'
                          />
                        </Text>
                        <Field
                          name='line1'
                          validate={[required]}
                          component={TextBox}
                          placeholder='Street Address'
                        />
                      </FaqFormItem>
                    </FormGroup>
                    <FormGroup>
                      <FaqFormItem>
                        <Text
                          size='14px'
                          weight={400}
                          style={{ marginBottom: '5px' }}
                        >
                          <FormattedMessage
                            id='identityverification.personal.address2'
                            defaultMessage='Address 2'
                          />
                        </Text>
                        <Field
                          name='line2'
                          component={TextBox}
                          placeholder='Apartment, unit, floor, etc..'
                        />
                      </FaqFormItem>
                    </FormGroup>
                    <FormGroup>
                      <FaqFormItem>
                        <Text
                          size='14px'
                          weight={400}
                          style={{ marginBottom: '5px' }}
                        >
                          <FormattedMessage
                            id='identityverification.personal.city'
                            defaultMessage='City'
                          />
                        </Text>
                        <Field
                          name='city'
                          validate={[required]}
                          component={TextBox}
                        />
                      </FaqFormItem>
                    </FormGroup>
                    <FormGroup>
                      <FaqFormItem>
                        <Text
                          size='14px'
                          weight={400}
                          style={{ marginBottom: '5px' }}
                        >
                          {countryHasStates(countryCode) ? (
                            <FormattedMessage
                              id='identityverification.personal.state'
                              defaultMessage='State'
                            />
                          ) : (
                            <FormattedMessage
                              id='identityverification.personal.region'
                              defaultMessage='Region'
                            />
                          )}
                        </Text>
                        <Field
                          name='state'
                          validate={[required]}
                          countryCode={countryCode}
                          component={TextBox}
                        />
                      </FaqFormItem>
                    </FormGroup>
                  </div>
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
          <Button
            uppercase
            nature='primary'
            type='submit'
            disabled={invalid || submitting}
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
  </PersonalForm>
)

Personal.propTypes = {
  address: AddressPropType,
  addressRefetchVisible: PropTypes.bool.isRequired,
  supportedCountries: getElementsPropType(CountryPropType),
  possibleAddresses: getElementsPropType(AddressPropType),
  countryCode: PropTypes.string.isRequired,
  activeField: PropTypes.string,
  onAddressSelect: PropTypes.func.isRequired,
  onPostCodeChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: PERSONAL_FORM,
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
})(Personal)
