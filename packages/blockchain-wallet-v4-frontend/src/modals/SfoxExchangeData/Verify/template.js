import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { FormGroup, FormItem, TextBox, SelectBoxUSState } from 'components/Form'
import { Text, Button, Icon, HeartbeatLoader } from 'blockchain-info-components'
import {
  required,
  requiredSSN,
  requiredDOB,
  requiredUsZipcode,
  normalizeSocialSecurity,
  normalizeDateOfBirth,
  normalizeUSZipcode,
  ageOverEighteen } from 'services/FormHelper'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
`
const ColLeft = styled.div`
  width: 50%;
`
const ColRight = styled.div`
  width: 50%;
`
const InputWrapper = styled.div`
  width: 80%;
`
const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
`
const PartnerSubHeader = styled.div`
  margin-top: 5px;
  font-size: 14px;
`
const FormContainer = styled.div`
  margin-top: 25px;
`
const AddressLabel = styled(Text)`
  span:last-of-type {
    margin-left: 3px;
    color: ${props => props.theme['gray-3']};
  }
`

const Verify = (props) => {
  const { handleSubmit, invalid, pristine, submitting, verificationError } = props
  const { busy, error } = props.ui
  // TODO decide where to put verificationError/error
  return (
    <Form onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper>
          <PartnerHeader>
            <FormattedMessage id='sfoxexchangedata.verify.partner.header' defaultMessage='Personal Information' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='sfoxexchangedata.verify.partner.subheader' defaultMessage='We are required to collect this information to open your exchange account. This information will be sent directly to SFOX and will not be saved to your Blockchain wallet.' />
          </PartnerSubHeader>
          <FormContainer>
            <FormGroup inline>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.firstname' defaultMessage='First Name' />
                </Text>
                <Field name='firstName' validate={[required]} component={TextBox} />
              </FormItem>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.lastname' defaultMessage='Last Name' />
                </Text>
                <Field name='lastName' validate={[required]} component={TextBox} />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <AddressLabel size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.address' defaultMessage='Address' />
                  <FormattedMessage id='sfoxexchangedata.verify.addressdetail' defaultMessage='(Please use your primary billing address.)' />
                </AddressLabel>
                <Field name='address1' validate={[required]} component={TextBox} placeholder='Street Address' />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.address2' defaultMessage='Address Line 2' />
                </Text>
                <Field name='address2' component={TextBox} placeholder='Apartment, unit, floor, etc..' />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.city' defaultMessage='City' />
                </Text>
                <Field name='city' validate={[required]} component={TextBox} />
              </FormItem>
            </FormGroup>
            <FormGroup inline>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.state' defaultMessage='State' />
                </Text>
                <Field name='state' validate={[required]} component={SelectBoxUSState} />
              </FormItem>
              <FormItem>
                <Text size='14px' weight={400} style={{'margin-bottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.zip' defaultMessage='Zipcode' />
                </Text>
                <Field name='zipcode' validate={[requiredUsZipcode]} component={TextBox} normalize={normalizeUSZipcode} />
              </FormItem>
            </FormGroup>
          </FormContainer>
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <Button nature='primary' fullwidth type='submit' disabled={invalid || pristine || submitting}>
          {
            !busy
              ? <FormattedMessage id='sfoxexchangedata.verify.continue' defaultMessage='Continue' />
              : <HeartbeatLoader height='20px' width='20px' color='white' />
          }
        </Button>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxVerify' })(Verify)
