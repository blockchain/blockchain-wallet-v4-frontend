import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import { replace, defaultTo } from 'ramda'

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
const FaqFormMessage = styled(FaqMessage)`
  position: absolute;
  margin-top: 23px;
  right: 0;
  width: 35%;
`
const DobFaqFormMessage = styled(FaqFormMessage)`
  margin-top: 46px;
`
const PersonalFormGroup = styled(FormGroup)`
  margin-bottom: 24px;
`
const FaqFormGroup = styled(PersonalFormGroup)`
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
const PersonalItem = styled(FaqFormItem)`
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
const {
  PERSONAL_FORM,
  MANUAL_ADDRESS_ITEM
} = model.components.identityVerification
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

const ManualAddressText = styled(Text)`
  span {
    font-weight: 300;
    font-size: 14px;
    color: ${props =>
      props.isSelected
        ? props.theme['white']
        : props.theme['brand-secondary']} !important;
  }
`
const renderAddressItem = props => {
  if (props.text === MANUAL_ADDRESS_ITEM.text)
    return (
      <ManualAddressText isSelected={props.isSelected}>
        <FormattedMessage
          id='identityverification.personal.manualaddress'
          defaultMessage='Enter Address Manually'
        />
      </ManualAddressText>
    )
  return props.text
}

const renderAddressDisplay = (props, children) => {
  if (props.text === MANUAL_ADDRESS_ITEM.text) {
    return (
      <React.Fragment>
        <FormattedMessage
          id='identityverification.personal.manualaddress'
          defaultMessage='Enter Address Manually'
        />
        <div hidden>{children}</div>
      </React.Fragment>
    )
  }
  return children
}

const Personal = ({
  invalid,
  submitting,
  address,
  postCode,
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
                <FaqFormGroup>
                  <PersonalItem>
                    <PersonalField>
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
                    </PersonalField>
                    <PersonalField>
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
                      fullwidth
                      label
                      errorBottom
                      parse={objectToDOB}
                      format={DOBToObject}
                    />
                  </FaqFormItem>
                  {activeField === 'dob' &&
                    !mobile && (
                      <DobFaqFormMessage
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
                <PersonalFormGroup>
                  <FaqFormItem>
                    <Text
                      size='14px'
                      weight={400}
                      style={{ marginBottom: '5px' }}
                    >
                      <FormattedMessage
                        id='identityverification.personal.country'
                        defaultMessage='Select your country of residence'
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
                </PersonalFormGroup>
                {countryCode && (
                  <FaqFormGroup>
                    <FaqFormItem>
                      <Text
                        size='14px'
                        weight={400}
                        style={{ marginBottom: '5px' }}
                      >
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
                      </Text>
                      <Field
                        name='postCode'
                        onChange={onPostCodeChange}
                        errorBottom
                        validate={[required]}
                        component={TextBox}
                      />
                      {countryCode &&
                        addressRefetchVisible &&
                        !mobile && (
                          <EmailHelper error={true}>
                            <FormattedMessage
                              id='identityverification.personal.addressrefetch'
                              defaultMessage='Oops, address lookup failed. {retry}'
                              values={{
                                retry: (
                                  <a
                                    onClick={onPostCodeChange.bind(
                                      null,
                                      null,
                                      postCode
                                    )}
                                  >
                                    Try again?
                                  </a>
                                )
                              }}
                            />
                          </EmailHelper>
                        )}
                    </FaqFormItem>
                    {activeField === 'postCode' && (
                      <FaqFormMessage
                        icon='map-marker-alt-regular'
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
                  Boolean(possibleAddresses[0].items.length) && (
                    <PersonalFormGroup>
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
                          validate={required}
                          elements={possibleAddresses}
                          onChange={onAddressSelect}
                          templateDisplay={renderAddressDisplay}
                          templateItem={renderAddressItem}
                          component={SelectBox}
                          label={
                            <FormattedMessage
                              id='identityverification.personal.selectaddress'
                              defaultMessage='Select Address'
                            />
                          }
                        />
                      </FaqFormItem>
                    </PersonalFormGroup>
                  )}
                {address && (
                  <div>
                    <PersonalFormGroup>
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
                    </PersonalFormGroup>
                    <PersonalFormGroup>
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
                    </PersonalFormGroup>
                    <PersonalFormGroup>
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
                    </PersonalFormGroup>
                    <PersonalFormGroup>
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
                    </PersonalFormGroup>
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
  destroyOnUnmount: false
})(Personal)
