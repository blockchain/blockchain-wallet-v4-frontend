import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'

import { required, validEmail } from 'services/FormHelper'
import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'
import { CheckBox, Form, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import Terms from 'components/Terms'

const Wrapper = styled.div`
  width: 100%;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const RegisterForm = styled(Form)`
  margin: 20px 0;
`

let Register = (props) => {
  const { onSubmit, submitting, invalid, password, confirmationPassword } = props
  const checkboxShouldBeChecked = value => value ? undefined : 'You must agree with the terms and conditions'
  const passwordsMatch = () => {
    console.log(password)
    console.log(confirmationPassword)
    console.log(password === confirmationPassword ? undefined : 'Passwords must match')
    return password === confirmationPassword ? undefined : 'Passwords must match'
  }

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
      <RegisterForm override onSubmit={onSubmit}>
        <FormGroup>
          <FormItem>
            <FormLabel for='email'>
              <FormattedMessage id='scenes.register.email' defaultMessage='Email' />
            </FormLabel>
            <Field name='email' validate={[required]} component={TextBox} />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='password'>
              <FormattedMessage id='scenes.register.password' defaultMessage='Password' />
            </FormLabel>
            <Field name='password' validate={[required]} component={PasswordBox} score />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='confirmationPassword'>
              <FormattedMessage id='scenes.register.confirmationPassword' defaultMessage='Confirm Password' />
            </FormLabel>
            <Field name='confirmationPassword' validate={[passwordsMatch]} component={PasswordBox} />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <Field name='terms' validate={[checkboxShouldBeChecked]} component={CheckBox}>
              <Terms />
            </Field>
          </FormItem>
        </FormGroup>
        <FormGroup>
          <Button type='submit' nature='primary' fullwidth uppercase disabled={submitting || invalid}>
            <FormattedMessage id='scenes.register.submit' defaultMessage='Continue' />
          </Button>
        </FormGroup>
      </RegisterForm>
    </Wrapper>
  )
}

Register = reduxForm({
  form: 'register'
})(Register)

const selector = formValueSelector('register')
Register = connect(
  state => {
    const password = selector(state, 'password')
    const confirmationPassword = selector(state, 'confirmationPassword')

    return { password, confirmationPassword }
  }
)(Register)

export default Register
