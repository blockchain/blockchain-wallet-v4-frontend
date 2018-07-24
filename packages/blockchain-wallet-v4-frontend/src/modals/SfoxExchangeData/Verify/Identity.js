import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormGroup, FormItem, TextBox, PasswordBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { Button, HeartbeatLoader, Icon, Text, Link } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

import { requiredSSN, requiredDOB, normalizeSocialSecurity, normalizeDateOfBirth, ageOverEighteen } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ErrorWrapper, ColRightInner } from 'components/BuySell/Signup'

const LockIcon = styled(Icon)`
  display: flex;
  align-items: center;
  font-size: 24px;
  margin-left: 7px;
`
const FormContainer = styled.div`
  margin-top: 25px;
`
const IconHeader = styled(PartnerHeader)`
  display: flex;
  flex-direction: row;
`

const Identity = (props) => {
  const { handleReset, handleSubmit, invalid, pristine, submitting, verificationError, viewSSN, toggleSSN } = props
  const { busy } = props.ui

  return (
    <Form onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper>
          <IconHeader>
            <FormattedMessage id='sfoxexchangedata.verify.partner.header' defaultMessage='The Hidden Details' />
            <LockIcon name='lock-filled' />
          </IconHeader>
          <PartnerSubHeader>
            <FormattedMessage id='sfoxexchangedata.verify.partner.subheader' defaultMessage="We know this information is personal, but we need to make sure you're you. As always, this will be sent directly to SFOX and will not be saved in your Blockchain wallet." />
          </PartnerSubHeader>
          <FormContainer>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.dateofbirth' defaultMessage='Your Birthday (MM/DD/YYYY)' />
                </Text>
                <Field name='dob' validate={[requiredDOB, ageOverEighteen]} component={TextBox} placeholder='01/01/1991' normalize={normalizeDateOfBirth} />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.ssn' defaultMessage='Social Security Number' />
                </Text>
                {
                  viewSSN
                    ? <Field name='ssn' validate={[requiredSSN]} component={TextBox} placeholder='___-__-___' normalize={normalizeSocialSecurity} />
                    : <Field name='ssn' validate={[requiredSSN]} component={PasswordBox} placeholder='___-__-___' normalize={normalizeSocialSecurity} />
                }
                <Link size='12px' weight={300} onClick={toggleSSN} style={spacing('mt-5')}>
                  {
                    viewSSN
                      ? <FormattedMessage id='sfoxexchangedata.verify.hidessn' defaultMessage='Hide SSN' />
                      : <FormattedMessage id='sfoxexchangedata.verify.viewssn' defaultMessage='View SSN' />
                  }
                </Link>
              </FormItem>
            </FormGroup>
          </FormContainer>
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <Button uppercase nature='primary' fullwidth type='submit' disabled={busy || invalid || pristine || submitting || verificationError}>
            {
              !busy
                ? <FormattedMessage id='sfoxexchangedata.verify.continue' defaultMessage='Continue' />
                : <HeartbeatLoader height='20px' width='20px' color='white' />
            }
          </Button>
          <ErrorWrapper>
            {
              verificationError && <Text size='12px' color='error' weight={300} onClick={handleReset}>
                <FormattedMessage
                  id='sfoxexchangedata.verify.identity.error'
                  defaultMessage='Unfortunately there was a problem verifying your identity. {clickHere} to start over.'
                  values={{ clickHere: <a>Click here</a> }} />
              </Text>
            }
          </ErrorWrapper>
          { props.faqs() }
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxIdentity' })(Identity)
