import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  required,
  requiredDOB,
  ageOverEighteen,
  normalizeDateOfBirth
} from 'services/FormHelper'
import { PERSONAL_FORM } from 'data/components/identityVerification/model'
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
import { FormGroup, FormItem, TextBox, PhoneNumberBox } from 'components/Form'
import {
  Form,
  ColLeft,
  ColRight,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  ColRightInner
} from 'components/IdentityVerification'
import renderFaq from 'components/FaqDropdown'

const FormContainer = styled.div`
  margin-top: 25px;
`
const PersonalForm = styled(Form)`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const PersonalFormGroup = styled(FormGroup)`
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

const faqQuestions = [
  {
    question: (
      <FormattedMessage
        id='identityverification.personal.faq.whycollect.question'
        defaultMessage='Why do you need this information?'
      />
    ),
    answer: (
      <FormattedMessage
        id='identityverification.personal.faq.whycollect.answer'
        defaultMessage='To comply with government regulated anti-money laundering legislation, we need to obtain additional information in order to verify your identity.'
      />
    )
  }
]

const Personal = ({
  invalid,
  submitting,
  handleSubmit,
  email,
  smsNumber,
  countryCode,
  emailVerified,
  smsVerified,
  formBusy,
  editEmail,
  editSms
}) => (
  <PersonalForm onSubmit={handleSubmit}>
    <ColLeft>
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
            <FormItem>
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
            </FormItem>
            <FormItem>
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
            </FormItem>
          </PersonalFormGroup>
          <FormGroup>
            <FormItem>
              <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                <FormattedMessage
                  id='identityverification.personal.dateofbirth'
                  defaultMessage='Your Birthday (MM/DD/YYYY)'
                />
              </Text>
              <Field
                name='dob'
                validate={[requiredDOB, ageOverEighteen]}
                component={TextBox}
                placeholder='01/01/1991'
                normalize={normalizeDateOfBirth}
              />
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
              <Text size='14px' style={spacing('mb-10')}>
                <FormattedMessage
                  id='identityverification.personal.verifiedemail'
                  defaultMessage='Verified Email Address'
                />
              </Text>
              <VerifiedContainer>
                <Field name='email' component={TextBox} disabled />

                <EditLink onClick={editEmail} size='14px' weight={300}>
                  <MediaContextConsumer>
                    {({ tablet }) =>
                      tablet ? (
                        <FormattedMessage
                          id='identityverification.personal.edit'
                          defaultMessage='edit'
                        />
                      ) : (
                        <FormattedMessage
                          id='identityverification.personal.editemail'
                          defaultMessage='edit email'
                        />
                      )
                    }
                  </MediaContextConsumer>
                </EditLink>
                <IconContainer>
                  {emailVerified ? (
                    <Icon
                      name='checkmark-in-circle-filled'
                      color='success'
                      size='20px'
                    />
                  ) : null}
                </IconContainer>
              </VerifiedContainer>
            </FormItem>
          </FormGroup>
          <FormGroup>
            <FormItem>
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
            </FormItem>
          </FormGroup>
        </FormContainer>
      </InputWrapper>
    </ColLeft>
    <ColRight>
      <ColRightInner>
        <Button
          uppercase
          nature='primary'
          type='submit'
          fullwidth
          disabled={
            invalid ||
            submitting ||
            formBusy ||
            !smsNumber ||
            !email ||
            !smsVerified ||
            !emailVerified
          }
        >
          {!formBusy ? (
            <FormattedMessage
              id='identityverification.personal.continue'
              defaultMessage='Continue'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
        {renderFaq(faqQuestions)}
      </ColRightInner>
    </ColRight>
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
