import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { CheckBox, Form, PasswordBox, TextBox } from 'components/Form'
import Terms from 'components/Terms'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Register = (props) => {
  const { onSubmit, submitting, invalid } = props
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'

  return (
    <Wrapper>
      <Header>
        <Text size='24px' weight={300} capitalize>
          <FormattedMessage id='scenes.register.create' defaultMessage='Create your Wallet' />
        </Text>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.register.or' defaultMessage='or' />
          </Text>
          <LinkContainer to='/login'>
            <Link size='13px' weight={300}>
              <FormattedMessage id='scenes.register.login' defaultMessage='Login' />
            </Link>
          </LinkContainer>
        </TextGroup>
      </Header>
      <Text size='16px' weight={300} altFont>
        <FormattedMessage id='scenes.register.explain' defaultMessage='Sign up for a free wallet below' />
      </Text>
      <Separator />
      <Form onSubmit={onSubmit}>
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.register.email' defaultMessage='Email' />
        </Text>
        <Field name='email' validate={[required, validEmail]} component={TextBox} />
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.register.password' defaultMessage='Password' />
        </Text>
        <Field name='password' validate={[required]} component={PasswordBox} score />
        <Text size='14px' weight={500}>
          <FormattedMessage id='scenes.register.confirmationPassword' defaultMessage='Confirm Password' />
        </Text>
        <Field name='confirmationPassword' validate={[required]} component={PasswordBox} />
        <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
          <Terms />
        </Field>
        <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
          <FormattedMessage id='scenes.register.submit' defaultMessage='Continue' />
        </Button>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({ form: 'registerForm' })(Register)
