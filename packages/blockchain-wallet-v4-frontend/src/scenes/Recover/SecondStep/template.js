import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import {
  Form,
  FormGroup,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { has } from 'ramda'
import {
  required,
  validEmail,
  validPasswordConfirmation
} from 'services/FormHelper'
import { Wrapper } from 'components/Public'
import React from 'react'
import styled from 'styled-components'
import Terms from 'components/Terms'

// load zxcvbn dependency async and set on window
require.ensure(
  ['zxcvbn'],
  require => (window.zxcvbn = require('zxcvbn')),
  'zxcvbn'
)

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const GoBackLink = styled(Link)`
  margin-right: 15px;
`

const validatePasswordConfirmation = validPasswordConfirmation('password')

const validStrongPassword = value =>
  value !== undefined && window.zxcvbn(value).score > 1
    ? undefined
    : () => (
        <FormattedMessage
          id='scenes.register.invalidstrongpassword'
          defaultMessage='Your password is not strong enough'
        />
      )

const SecondStep = props => {
  const { busy, invalid, handleSubmit, password, previousStep } = props

  return (
    <Wrapper>
      <Header>
        <Text size='20px' color='blue900' weight={600} capitalize>
          <FormattedMessage
            id='scenes.recover.secondstep.funds'
            defaultMessage='Recover Funds'
          />
        </Text>
      </Header>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor='email'>
            <FormattedMessage
              id='scenes.recover.secondstep.email'
              defaultMessage='New Email'
            />
          </FormLabel>
          <Field
            bgColor='grey000'
            name='email'
            validate={[required, validEmail]}
            component={TextBox}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor='password'>
            <FormattedMessage
              id='scenes.recover.secondstep.password'
              defaultMessage='Password'
            />
          </FormLabel>
          <Field
            bgColor='grey000'
            name='password'
            validate={[required, validStrongPassword]}
            component={PasswordBox}
            showPasswordScore
            passwordScore={
              has('zxcvbn', window) ? window.zxcvbn(password).score : 0
            }
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor='confirmationPassword'>
            <FormattedMessage
              id='scenes.recover.secondstep.confirmapassword'
              defaultMessage='Confirm Password'
            />
          </FormLabel>
          <Field
            bgColor='grey000'
            name='confirmationPassword'
            validate={[required, validatePasswordConfirmation]}
            component={PasswordBox}
          />
        </FormGroup>
        <FormGroup>
          <Terms recovery />
        </FormGroup>
        <Footer>
          <GoBackLink onClick={previousStep} size='13px' weight={400}>
            <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
          </GoBackLink>
          <Button type='submit' nature='primary' disabled={busy || invalid}>
            {busy ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='scenes.recover.secondstep.recover'
                defaultMessage='Recover Funds'
              />
            )}
          </Button>
        </Footer>
      </Form>
    </Wrapper>
  )
}

export default reduxForm({
  form: 'recover',
  destroyOnUnmount: false
})(SecondStep)
