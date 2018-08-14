import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { required, requiredDOB, ageOverEighteen } from 'services/FormHelper'
import { model } from 'data'
import media from 'services/ResponsiveService'
import { spacing } from 'services/StyleService'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import {
  Link,
  Icon,
  Button,
  Text,
  HeartbeatLoader
} from 'blockchain-info-components'
import {
  FormGroup,
  FormItem,
  TextBox,
  PhoneNumberBox,
  DateInputBox,
  FaqMessage,
  FooterShadowWrapper
} from 'components/Form'
import {
  Form,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader
} from 'components/IdentityVerification'
import Terms from 'components/Terms'

const FormContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 64px;
`
const PersonalForm = styled(Form)`
  height: 100%;
`
const PersonalFormGroup = styled(FormGroup)`
  width: 60%;
  ${media.mobile`
    flex-direction: column;
    div:first-of-type {
      margin-bottom: 10px;
    }
    div:last-of-type {
      div:last-of-type {
        margin-bottom: 15px;
      }
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
`
const VerifiedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > div:first-child {
    width: 100%;
  }

  input {
    border: solid 1px #cccccc;
    background-color: #fff !important;
  }
`
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  ${media.mobile`
    align-items: flex-start;
  `};
`
const EditLink = styled(Link)`
  font-size: 12px;
  position: absolute;
  right: 40px;
  ${media.mobile`
    font-size: 12px;
  `};
`
const Footer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const TermsText = styled(Text)`
  width: 50%;
  font-weight: 300px;
  font-size: 12px;
`
const { PERSONAL_FORM } = model.components.identityVerification
const objectToDOB = ({ date = '', month = '', year = '' }) =>
  `${month}/${date}/${year}`
const DOBToObject = (value = '') => {
  const [month = '', date = '', year = ''] = value.split('/')
  return {
    date,
    month,
    year
  }
}

const Personal = ({
  invalid,
  submitting,
  handleSubmit,
  email,
  smsNumber,
  countryCode,
  emailVerified,
  smsVerified,
  editSms,
  activeField,
  setActiveField
}) => (
  <PersonalForm onSubmit={handleSubmit}>
    <FooterShadowWrapper
      fields={
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
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
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
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
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
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='identityverification.personal.dateofbirth'
                    defaultMessage='Your Birthday (MM/DD/YYYY)'
                  />
                </Text>
                <Field
                  name='dob'
                  validate={[requiredDOB, ageOverEighteen]}
                  component={DateInputBox}
                  fullwidth={true}
                  parse={objectToDOB}
                  format={DOBToObject}
                  onFocus={setActiveField.bind(null, 'dob')}
                  onBlur={setActiveField.bind(null, null)}
                />
              </FaqFormItem>
              {activeField === 'dob' && (
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
                      defaultMessage='We try and prefill your address so you dont have to fill out all the fields'
                    />
                  }
                />
              )}
            </FaqFormGroup>
            <FaqFormGroup>
              <FaqFormItem>
                <Text size='14px' style={spacing('mb-10')}>
                  <FormattedMessage
                    id='identityverification.personal.verifiedmobile'
                    defaultMessage='Verified Phone Number'
                  />
                </Text>
                <VerifiedContainer>
                  <Field
                    name='smsNumber'
                    countryCode={countryCode}
                    component={PhoneNumberBox}
                    disabled
                  />
                  <EditLink onClick={editSms} size='14px' weight={300}>
                    <MediaContextConsumer>
                      {({ tablet }) =>
                        tablet ? (
                          <FormattedMessage
                            id='identityverification.personal.edit'
                            defaultMessage='edit'
                          />
                        ) : (
                          <FormattedMessage
                            id='identityverification.personal.editmobile'
                            defaultMessage='edit mobile'
                          />
                        )
                      }
                    </MediaContextConsumer>
                  </EditLink>
                  <IconContainer>
                    {smsVerified ? (
                      <Icon
                        name='checkmark-in-circle-filled'
                        color='success'
                        size='20px'
                      />
                    ) : null}
                  </IconContainer>
                </VerifiedContainer>
              </FaqFormItem>
            </FaqFormGroup>
          </FormContainer>
        </InputWrapper>
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
            disabled={
              invalid ||
              submitting ||
              !smsNumber ||
              !email ||
              !smsVerified ||
              !emailVerified
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
  </PersonalForm>
)

Personal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  editEmail: PropTypes.func.isRequired,
  editSmsNumber: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  smsNumber: PropTypes.string.isRequired,
  emailVerified: PropTypes.number.isRequired,
  smsVerified: PropTypes.number.isRequired,
  countryCode: PropTypes.object.isRequired
}

export default reduxForm({
  form: PERSONAL_FORM,
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
})(Personal)
