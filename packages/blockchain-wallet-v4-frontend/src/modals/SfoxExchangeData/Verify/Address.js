import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { FormGroup, FormItem, TextBox, SelectBoxUSState } from 'components/Form'
import { Text, Button, HeartbeatLoader } from 'blockchain-info-components'

import { required, requiredUsZipcode, normalizeUSZipcode } from 'services/FormHelper'
import { Form, ColLeft, ColRight, InputWrapper, PartnerHeader, PartnerSubHeader, ColRightInner } from 'components/BuySell/Signup'

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
            <FormattedMessage id='sfoxexchangedata.verify.partner.header' defaultMessage="Let's Get to Know You" />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='sfoxexchangedata.verify.partner.subheader' defaultMessage="There's so much we'd love to know about you, but we only need a few things. Fear not, all of your personal information will be sent directly to SFOX, not saved in your Blockchain wallet." />
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
                  <FormattedHTMLMessage id='sfoxexchangedata.verify.addressdetail' defaultMessage='<span style="font-weight: 300">(Please use your primary billing address.)</span>' />
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
          { props.faqs() }
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxAddress', destroyOnUnmount: false })(Address)
