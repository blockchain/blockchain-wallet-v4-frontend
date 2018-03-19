import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { FormGroup, FormItem, TextBox, SelectBoxUSState } from 'components/Form'
import { Text, Button, HeartbeatLoader } from 'blockchain-info-components'

import { required, requiredUsZipcode, normalizeUSZipcode } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ColRightInner } from '../styled'
import { Helper1, Helper2 } from './helpers.js'

const FormContainer = styled.div`
  margin-top: 25px;
`
const AddressLabel = styled(Text)`
  span:last-of-type {
    margin-left: 3px;
    color: ${props => props.theme['gray-3']};
  }
`

const Address = (props) => {
  const { invalid, submitting } = props
  const { busy } = props.ui

  const handleSubmit = (e) => {
    e.preventDefault()
    props.updateUI({ verify: 'identity' })
  }

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
                <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.firstname' defaultMessage='First Name' />
                </Text>
                <Field name='firstName' validate={[required]} component={TextBox} />
              </FormItem>
              <FormItem>
                <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.lastname' defaultMessage='Last Name' />
                </Text>
                <Field name='lastName' validate={[required]} component={TextBox} />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <AddressLabel size='14px' weight={400} style={{'marginBottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.address' defaultMessage='Address' />
                  <FormattedMessage id='sfoxexchangedata.verify.addressdetail' defaultMessage='(Please use your primary billing address.)' />
                </AddressLabel>
                <Field name='address1' validate={[required]} component={TextBox} placeholder='Street Address' />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.address2' defaultMessage='Address Line 2' />
                </Text>
                <Field name='address2' component={TextBox} placeholder='Apartment, unit, floor, etc..' />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.city' defaultMessage='City' />
                </Text>
                <Field name='city' validate={[required]} component={TextBox} />
              </FormItem>
            </FormGroup>
            <FormGroup inline>
              <FormItem>
                <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.state' defaultMessage='State' />
                </Text>
                <Field name='state' validate={[required]} component={SelectBoxUSState} />
              </FormItem>
              <FormItem>
                <Text size='14px' weight={400} style={{'marginBottom': '5px'}}>
                  <FormattedMessage id='sfoxexchangedata.verify.zip' defaultMessage='Zipcode' />
                </Text>
                <Field name='zipcode' validate={[requiredUsZipcode]} component={TextBox} normalize={normalizeUSZipcode} />
              </FormItem>
            </FormGroup>
          </FormContainer>
        </InputWrapper>
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <Button uppercase nature='primary' fullwidth type='submit' disabled={invalid || submitting || busy}>
            {
              !busy
                ? <FormattedMessage id='sfoxexchangedata.verify.continue' defaultMessage='Continue' />
                : <HeartbeatLoader height='20px' width='20px' color='white' />
            }
          </Button>
          <Helper1 />
          <Helper2 />
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxAddress', destroyOnUnmount: false })(Address)
