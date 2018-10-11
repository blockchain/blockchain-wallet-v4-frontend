import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { LinkContainer } from 'react-router-bootstrap'
import { check, msie } from 'bowser'

import {
  validPasswordConfirmation,
  validStrongPassword,
  required,
  validEmail
} from 'services/FormHelper'
import {
  Banner,
  Button,
  Link,
  HeartbeatLoader,
  Separator,
  Text,
  TextGroup
} from 'blockchain-info-components'
import {
  CheckBox,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import Terms from 'components/Terms'

const isSupportedBrowser =
  check({ safari: '8', chrome: '45', firefox: '45', opera: '20' }) && !msie

const Wrapper = styled.div`
  width: 100%;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media (min-width: 768px) {
    width: 550px;
  }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const RegisterForm = styled(Form)`
  margin: 20px 0;
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
const PasswordTip = styled(Text)`
  margin-top: 4px;
`
const validatePasswordConfirmation = validPasswordConfirmation('password')
const checkboxShouldBeChecked = value =>
  value ? undefined : 'You must agree to the terms and conditions'

const Register = props => {
  const {
    handleSubmit,
    busy,
    invalid,
    passwordStrength,
    passwordLength
  } = props

  return (
    <Wrapper>
      <Header>
        <Text size='24px' weight={300} capitalize data-e2e='signupHeader'>
          <FormattedMessage
            id='scenes.register.create'
            defaultMessage='Create your Wallet'
          />
        </Text>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.register.or' defaultMessage='or' />
          </Text>
          <LinkContainer to='/login'>
            <Link size='13px' weight={300} data-e2e='signupLinkToLogin'>
              <FormattedMessage
                id='scenes.register.login'
                defaultMessage='Login'
              />
            </Link>
          </LinkContainer>
        </TextGroup>
      </Header>
      <Text size='14px' weight={300} altFont>
        <FormattedMessage
          id='scenes.register.explain'
          defaultMessage='Sign up for a free wallet below'
        />
      </Text>
      <Separator />
      <RegisterForm override onSubmit={handleSubmit}>
        {!isSupportedBrowser && (
          <BrowserWarning>
            <Banner type='warning'>
              <FormattedMessage
                id='scenes.register.browserwarning'
                defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, IE 11, or Opera '
              />
            </Banner>
          </BrowserWarning>
        )}
        <FormGroup>
          <FormItem>
            <FormLabel for='email'>
              <FormattedMessage
                id='scenes.register.email'
                defaultMessage='Email'
              />
            </FormLabel>
            <Field
              name='email'
              autoFocus
              validate={[required, validEmail]}
              component={TextBox}
              disabled={!isSupportedBrowser}
              data-e2e='signupEmail'
            />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='password'>
              <FormattedMessage
                id='scenes.register.password'
                defaultMessage='Password'
              />
            </FormLabel>
            <Field
              name='password'
              validate={[required, validStrongPassword]}
              component={PasswordBox}
              score
              disabled={!isSupportedBrowser}
              data-e2e='signupPassword'
            />
          </FormItem>
          {passwordLength > 0 && (
            <div>
              <PasswordTip size='12px' weight={200}>
                {passwordStrength <= 1 && (
                  <FormattedMessage
                    id='formhelper.passwordsuggest.weak'
                    defaultMessage='Weak. Use at least 8 characters, a mix of letters, numbers and symbols.'
                  />
                )}
                {passwordStrength >= 2 &&
                  passwordStrength < 4 && (
                    <FormattedMessage
                      id='formhelper.passwordsuggest.medium'
                      defaultMessage='Medium. Use at least 8 characters, a mix of letters, numbers and symbols.'
                    />
                  )}
                {passwordStrength === 4 && (
                  <FormattedMessage
                    id='formhelper.passwordsuggest.great'
                    defaultMessage='Great password.'
                  />
                )}
              </PasswordTip>
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <FormItem>
            <FormLabel for='confirmationPassword'>
              <FormattedMessage
                id='scenes.register.confirmpassword'
                defaultMessage='Confirm Password'
              />
            </FormLabel>
            <Field
              name='confirmationPassword'
              validate={[required, validatePasswordConfirmation]}
              component={PasswordBox}
              disabled={!isSupportedBrowser}
              data-e2e='signupConfirmPassword'
            />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <FormItem>
            <Field
              name='terms'
              validate={[checkboxShouldBeChecked]}
              component={CheckBox}
              disabled={!isSupportedBrowser}
              data-e2e='signupTermsCheckbox'
            >
              <Terms />
            </Field>
          </FormItem>
        </FormGroup>
        <FormGroup>
          <Button
            type='submit'
            nature='primary'
            fullwidth
            disabled={busy || invalid}
            data-e2e='signupButton'
          >
            {busy ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='scenes.register.submit'
                defaultMessage='Continue'
              />
            )}
          </Button>
        </FormGroup>
      </RegisterForm>
    </Wrapper>
  )
}

export default reduxForm({ form: 'register' })(Register)
