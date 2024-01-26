import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Field, InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { SofiMigrationStatusResponseType } from '@core/network/api/sofi/types'
import { Button, HeartbeatLoader, Text, TextGroup } from 'blockchain-info-components'
import CheckBox from 'components/Form/CheckBox'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import TextBox from 'components/Form/TextBox'
import Terms from 'components/Terms'
import { selectors } from 'data'
import {
  required,
  stringContainsLowercaseLetter,
  stringContainsNumber,
  stringContainsSpecialChar,
  stringContainsUppercaseLetter,
  stringLengthBetween,
  validEmail,
  validPasswordConfirmation,
  validStrongPassword
} from 'services/forms'

import { SIGNUP_FORM } from '../..'
import { SubviewProps } from '../../types'

const StyledForm = styled(Form)`
  margin-top: 20px;

  > div * {
    max-height: 26rem;
    transition: all 0.5s ease;
  }
`
const FieldWrapper = styled.div`
  margin-top: 0.25rem;
  margin-right: 0 !important;
`

const PasswordRequirementText = styled(Text)<{ isValid?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => (props.isValid ? props.theme.grey800 : props.theme.red600)};
`
const EmailErrorText = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  margin-top: 4px;
  margin-left: 2px;
  color: ${(props) => props.theme.red600};
`

const validatePasswordConfirmation = validPasswordConfirmation('password')

const SofiSignupForm = (props: Props) => {
  const {
    bakktRedirectUSStates,
    formActions,
    formValues,
    initialValues,
    invalid,
    isFormSubmitting,
    onSignupSubmit,
    routerActions
  } = props

  const { sofiJwtPayload } = useSelector(selectors.modules.profile.getSofiUserData).getOrElse(
    {}
  ) as SofiMigrationStatusResponseType
  useEffect(() => {
    if (!sofiJwtPayload) {
      routerActions.push('/sofi-error')
    }
  }, [])

  const passwordValue = formValues?.password || ''
  const isUSStateUnsupported = bakktRedirectUSStates.includes(formValues?.state)
  // @ts-ignore
  const lowercaseError = props.registering?.error?.reason === 'email.lowercase'
  useEffect(() => {
    formActions.change(SIGNUP_FORM, 'country', sofiJwtPayload?.country)
    formActions.change(SIGNUP_FORM, 'state', sofiJwtPayload?.state)
  }, [formActions, sofiJwtPayload])

  return (
    <StyledForm override onSubmit={onSignupSubmit} initialValues={initialValues}>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='email'>
            <FormattedMessage id='scenes.signup.sofi.email' defaultMessage='Your Email' />
          </FormLabel>
          <Field
            autoFocus
            bgColor='grey000'
            component={TextBox}
            data-e2e='signupEmail'
            name='email'
            props={{ autoCapitalize: 'off' }}
            validate={[required, validEmail]}
          />
        </FormItem>
        {lowercaseError && (
          <EmailErrorText>
            <FormattedMessage
              id='scenes.security.email.lowercase'
              defaultMessage='Please enter your email address using lowercase letters only.'
            />
          </EmailErrorText>
        )}
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='password' id='password'>
            <FormattedMessage defaultMessage='Password' id='scenes.register.password' />
          </FormLabel>
          <Field
            bgColor='grey000'
            component={PasswordBox}
            data-e2e='signupPassword'
            name='password'
            placeholder='Enter Password'
            validate={[required, validStrongPassword]}
          />
        </FormItem>
        {passwordValue.length > 0 && !!validStrongPassword(passwordValue) && (
          <div style={{ marginTop: '4px' }}>
            <TextGroup inline>
              <PasswordRequirementText isValid>
                <FormattedMessage
                  id='scenes.register.password.part1'
                  defaultMessage='Passwords must contain a'
                />{' '}
              </PasswordRequirementText>
              <PasswordRequirementText isValid={stringContainsLowercaseLetter(passwordValue)}>
                <FormattedMessage
                  id='scenes.register.password.part2'
                  defaultMessage='lowercase letter'
                />
                {', '}
              </PasswordRequirementText>
              <PasswordRequirementText isValid={stringContainsUppercaseLetter(passwordValue)}>
                <FormattedMessage
                  id='scenes.register.password.part3'
                  defaultMessage='uppercase letter'
                />
                {', '}
              </PasswordRequirementText>
              <PasswordRequirementText isValid={stringContainsNumber(passwordValue)}>
                <FormattedMessage id='scenes.register.password.part4' defaultMessage='number' />
                {', '}
              </PasswordRequirementText>
              <PasswordRequirementText isValid={stringContainsSpecialChar(passwordValue)}>
                <FormattedMessage
                  id='scenes.register.password.part5'
                  defaultMessage='special character'
                />{' '}
              </PasswordRequirementText>
              <PasswordRequirementText isValid>
                <FormattedMessage
                  id='scenes.register.password.part6'
                  defaultMessage='and be at least'
                />
              </PasswordRequirementText>
              <PasswordRequirementText isValid={stringLengthBetween(passwordValue, 8, 64)}>
                <FormattedMessage
                  id='scenes.register.password.characters'
                  defaultMessage='8 characters'
                />{' '}
              </PasswordRequirementText>
              <PasswordRequirementText isValid>
                <FormattedMessage id='copy.long' defaultMessage='long' />.
              </PasswordRequirementText>
            </TextGroup>
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='confirmationPassword' id='confirmationPassword'>
            <FormattedMessage
              defaultMessage='Confirm Password'
              id='scenes.register.confirmpassword'
            />
          </FormLabel>
          <Field
            bgColor='grey000'
            component={PasswordBox}
            data-e2e='signupConfirmPassword'
            name='confirmationPassword'
            placeholder='Re-enter Password'
            validate={[required, validatePasswordConfirmation]}
          />
        </FormItem>
      </FormGroup>

      <FormGroup inline>
        <FieldWrapper>
          <Field name='sofiAcceptTerms' validate={[required]} component={CheckBox} hideErrors />
        </FieldWrapper>
        <FormLabel style={{ marginTop: '1px' }}>
          <Terms company='sofi' />
        </FormLabel>
      </FormGroup>
      {isUSStateUnsupported && (
        <FormGroup inline>
          <FieldWrapper>
            <Field
              name='sofiBakktAcceptTerms'
              validate={[required]}
              component={CheckBox}
              hideErrors
            />
          </FieldWrapper>
          <FormLabel style={{ marginTop: '1px' }}>
            <Terms company='sofi-bakkt' />
          </FormLabel>
        </FormGroup>
      )}
      <Button
        data-e2e='signupButton'
        disabled={isFormSubmitting || invalid}
        fullwidth
        height='48px'
        nature='primary'
        type='submit'
      >
        {isFormSubmitting ? (
          <HeartbeatLoader height='20px' width='20px' color='white' />
        ) : (
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        )}
      </Button>
    </StyledForm>
  )
}

type Props = InjectedFormProps<{}> & SubviewProps

export default SofiSignupForm
