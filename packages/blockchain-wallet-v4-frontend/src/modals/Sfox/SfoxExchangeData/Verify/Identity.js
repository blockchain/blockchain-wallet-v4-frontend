import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { FormGroup, FormItem, PasswordBox, TextBox } from 'components/Form'
import { spacing } from 'services/StyleService'
import React from 'react'
import styled from 'styled-components'

import {
  ageOverEighteen,
  normalizeDateOfBirth,
  normalizeSocialSecurity,
  requiredDOB,
  requiredSSN
} from 'services/FormHelper'
import {
  ColLeft,
  ColRight,
  ColRightInner,
  ErrorWrapper,
  Form,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader
} from 'components/IdentityVerification'
import media from 'services/ResponsiveService'

const FormContainer = styled.div`
  margin-top: 25px;
`
const IconHeader = styled(PartnerHeader)`
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
`
const IdentityForm = styled(Form)`
  ${media.mobile`
    flex-direction: column;
    div:last-of-type {
      margin-bottom: 15px;
    }
  `};
`

const Identity = props => {
  const {
    busy,
    handleReset,
    handleSubmit,
    invalid,
    pristine,
    submitting,
    verificationError,
    viewSSN,
    toggleSSN
  } = props

  return (
    <IdentityForm onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper>
          <IconHeader>
            <FormattedMessage
              id='sfoxexchangedata.verify.identity.header'
              defaultMessage='The Hidden Details'
            />
          </IconHeader>
          <PartnerSubHeader>
            <FormattedMessage
              id='sfoxexchangedata.verify.identity.subheader'
              defaultMessage="We know this information is personal, but we need to make sure you're you. As always, this will be sent directly to SFOX and will not be saved in your Blockchain wallet."
            />
          </PartnerSubHeader>
          <FormContainer>
            <FormGroup>
              <FormItem>
                <Text
                  size='14px'
                  weight={500}
                  style={{ 'margin-bottom': '5px' }}
                >
                  <FormattedMessage
                    id='sfoxexchangedata.verify.dateofbirth'
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
                <Text
                  size='14px'
                  weight={500}
                  style={{ 'margin-bottom': '5px' }}
                >
                  <FormattedMessage
                    id='sfoxexchangedata.verify.ssn'
                    defaultMessage='Social Security Number'
                  />
                </Text>
                {viewSSN ? (
                  <Field
                    name='ssn'
                    validate={[requiredSSN]}
                    component={TextBox}
                    placeholder='___-__-___'
                    normalize={normalizeSocialSecurity}
                  />
                ) : (
                  <Field
                    name='ssn'
                    validate={[requiredSSN]}
                    component={PasswordBox}
                    placeholder='___-__-___'
                    normalize={normalizeSocialSecurity}
                  />
                )}
                <Link
                  size='12px'
                  weight={400}
                  onClick={toggleSSN}
                  style={spacing('mt-5')}
                >
                  {viewSSN ? (
                    <FormattedMessage
                      id='sfoxexchangedata.verify.hidessn'
                      defaultMessage='Hide SSN'
                    />
                  ) : (
                    <FormattedMessage
                      id='sfoxexchangedata.verify.viewssn'
                      defaultMessage='View SSN'
                    />
                  )}
                </Link>
              </FormItem>
            </FormGroup>
          </FormContainer>
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <Button
            nature='primary'
            fullwidth
            type='submit'
            disabled={
              busy || invalid || pristine || submitting || verificationError
            }
          >
            {!busy ? (
              <FormattedMessage
                id='sfoxexchangedata.verify.identity.continue'
                defaultMessage='Continue'
              />
            ) : (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            )}
          </Button>
          <ErrorWrapper>
            {verificationError && (
              <Text
                size='12px'
                color='error'
                weight={400}
                onClick={handleReset}
              >
                <FormattedMessage
                  id='sfoxexchangedata.verify.identity.error'
                  defaultMessage='Unfortunately there was a problem verifying your identity. {clickHere} to start over.'
                  values={{ clickHere: <a>Click here</a> }}
                />
              </Text>
            )}
          </ErrorWrapper>
          {props.faqs}
        </ColRightInner>
      </ColRight>
    </IdentityForm>
  )
}

export default reduxForm({ form: 'sfoxIdentity' })(Identity)
