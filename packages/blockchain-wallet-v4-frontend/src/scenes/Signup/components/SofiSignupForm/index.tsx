import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Field, InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { SofiMigrationStatusResponseType } from '@core/network/api/sofi/types'
import { CountryScope } from '@core/types'
import { Button, HeartbeatLoader, Text, TextGroup } from 'blockchain-info-components'
import CheckBox from 'components/Form/CheckBox'
import Form from 'components/Form/Form'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import Terms from 'components/Terms'
import { selectors } from 'data'
import { CountryType, SignUpGoalDataType, StateType } from 'data/types'
import { useCountryList, useUSStateList } from 'hooks'
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
import { applyToUpperCase } from 'services/forms/normalizers'

import { SIGNUP_FORM } from '../..'
import { SubviewProps } from '../../types'
import ContinueOnPhone from '../SignupForm/ContinueOnPhone'

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

const validatePasswordConfirmation = validPasswordConfirmation('password')

const SofiSignupForm = (props: Props) => {
  const {
    bakktRedirectUSStates,
    formActions,
    formValues,
    goals,
    initialValues,
    invalid,
    isFormSubmitting,
    onSignupSubmit,
    setShowModal
  } = props

  const { sofiJwtPayload } = useSelector(selectors.modules.profile.getSofiUserData).getOrElse({
    sofiJwtPayload: {
      country: '',
      email: '',
      state: ''
    }
  }) as SofiMigrationStatusResponseType

  const { country, email, state } = sofiJwtPayload
  const passwordValue = formValues?.password || ''
  const isUSStateUnsupported = bakktRedirectUSStates.includes(formValues?.state)

  const dataGoal = goals.find((g) => g.name === 'signup')

  useEffect(() => {
    if (email) {
      formActions.change(SIGNUP_FORM, 'email', email)
    }
    formActions.change(SIGNUP_FORM, 'country', country)
    formActions.change(SIGNUP_FORM, 'state', state)
  }, [formActions, email])

  return (
    <StyledForm override onSubmit={onSignupSubmit} initialValues={initialValues}>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='email'>
            <FormattedMessage id='scenes.signup.sofi.email' defaultMessage='Your Email' />
          </FormLabel>
          <Field bgColor='grey000' component={TextBox} data-e2e='signupEmail' name='email' />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='password' id='password'>
            <FormattedMessage defaultMessage='Password' id='scenes.register.password' />
          </FormLabel>
          <Field
            autoFocus
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

type Props = InjectedFormProps<{}> & SubviewProps & { setShowModal?: (e) => void }

export default SofiSignupForm
