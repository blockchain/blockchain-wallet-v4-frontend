import React from 'react'
import { FormattedMessage } from 'react-intl'
import { has } from 'ramda'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import Terms from 'components/Terms'
import {
  required,
  validEmail,
  validPasswordConfirmation,
  validStrongPassword
} from 'services/forms'

import { Props as OwnProps } from '.'

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

const SecondStep = (props: Props) => {
  const { invalid, isRegistering, isRestoringFromMetadata, previousStep, recoverPassword } = props
  return (
    <>
      <Header>
        <Text size='20px' color='blue900' weight={600} capitalize>
          <FormattedMessage id='scenes.recover.secondstep.funds' defaultMessage='Recover Funds' />
        </Text>
      </Header>
      <Form>
        {!isRestoringFromMetadata && (
          <FormGroup>
            <FormLabel htmlFor='email'>
              <FormattedMessage id='scenes.recover.secondstep.email' defaultMessage='New Email' />
            </FormLabel>
            <Field
              bgColor='grey000'
              name='email'
              validate={[required, validEmail]}
              component={TextBox}
            />
          </FormGroup>
        )}
        <FormGroup>
          <FormLabel htmlFor='password'>
            <FormattedMessage id='scenes.recover.secondstep.password' defaultMessage='Password' />
          </FormLabel>
          <Field
            bgColor='grey000'
            name='recoverPassword'
            validate={[required, validStrongPassword]}
            component={PasswordBox}
            showPasswordScore
            passwordScore={has('zxcvbn', window) ? window.zxcvbn(recoverPassword).score : 0}
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
          <Button
            data-e2e='recoverSubmit'
            disabled={isRegistering || invalid}
            nature='primary'
            type='submit'
          >
            {isRegistering ? (
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
    </>
  )
}

type Props = OwnProps & {
  isRegistering?: boolean
  isRestoringFromMetadata?: boolean
}
export default SecondStep
