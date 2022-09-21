import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { find, propEq, propOr } from 'ramda'
import { Field, InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

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
const FieldWithoutBottomRadius = styled(FormItem)<{ setBorder: boolean }>`
  .bc__control {
    border-radius: ${(props) => (props.setBorder ? '8px 8px 0 0 ' : '8px')};
  }

  .bc__menu {
    overflow: hidden;
  }
`
const FieldWithoutTopRadius = styled(FormItem)<{ setBorder: boolean }>`
  .bc__control {
    border-radius: ${(props) => (props.setBorder ? '0 0 8px 8px' : '8px')};
  }
  .bc__menu {
    overflow: hidden;
  }
`
const PasswordRequirementText = styled(Text)<{ isValid?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => (props.isValid ? props.theme.grey800 : props.theme.red600)};
`

const validatePasswordConfirmation = validPasswordConfirmation('password')

const getCountryElements = (countries: Array<CountryType>) => [
  {
    group: '',
    items: countries.map((country: CountryType) => ({
      text: country.name,
      value: country.code
    }))
  }
]

const getStateElements = (states: Array<StateType>) => [
  {
    group: '',
    items: states.map((state: StateType) => ({
      text: state.name,
      value: state.code
    }))
  }
]

const SignupForm = (props: Props) => {
  const {
    formActions,
    formValues,
    goals,
    initialValues,
    invalid,
    isFormSubmitting,
    isReferralEnabled,
    isValidReferralCode,
    onCountrySelect,
    onSignupSubmit,
    showState
  } = props
  const passwordValue = formValues?.password || ''
  const referralValue = formValues?.referral || ''
  const showReferralError =
    referralValue.length > 0 && isValidReferralCode !== undefined && !isValidReferralCode

  const { data: supportedCountries } = useCountryList({ scope: CountryScope.SIGNUP })
  const { data: supportedUSStates } = useUSStateList()

  const dataGoal = find(propEq('name', 'signup'), goals)
  const goalData: SignUpGoalDataType = propOr({}, 'data', dataGoal)
  const { email } = goalData

  useEffect(() => {
    if (email) {
      formActions.change(SIGNUP_FORM, 'email', email)
    }
  }, [formActions, email])

  if (!supportedCountries?.countries || !supportedUSStates?.states) {
    return <></>
  }

  return (
    <StyledForm override onSubmit={onSignupSubmit} initialValues={initialValues}>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='email'>
            <FormattedMessage
              id='scenes.security.email.verifiedtitle'
              defaultMessage='Email Address'
            />
          </FormLabel>
          <Field
            autoFocus
            bgColor='grey000'
            component={TextBox}
            data-e2e='signupEmail'
            name='email'
            noLastPass
            placeholder='Enter Email Address'
            validate={[required, validEmail]}
          />
        </FormItem>
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
      <FormGroup>
        <FieldWithoutBottomRadius setBorder={showState}>
          <FormLabel htmlFor='country' id='country'>
            <FormattedMessage
              defaultMessage='Country of Residence'
              id='scenes.register.countryofresidence'
            />
          </FormLabel>
          <Field
            data-e2e='selectCountryDropdown'
            name='country'
            validate={required}
            elements={getCountryElements(supportedCountries.countries)}
            component={SelectBox}
            menuPlacement='auto'
            onChange={onCountrySelect}
            label='Select Country'
          />
        </FieldWithoutBottomRadius>
        {showState ? (
          <FieldWithoutTopRadius setBorder={showState}>
            <Field
              name='state'
              elements={getStateElements(supportedUSStates.states)}
              component={SelectBox}
              errorBottom
              validate={[required]}
              label='Select State'
            />
          </FieldWithoutTopRadius>
        ) : null}
      </FormGroup>
      {isReferralEnabled && (
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='referral' id='referral'>
              <FormattedMessage
                defaultMessage='Have a referral code?'
                id='scenes.register.referralcode'
              />
            </FormLabel>
            <Field
              bgColor='grey000'
              component={TextBox}
              data-e2e='referral'
              name='referral'
              normalize={applyToUpperCase}
              placeholder='Enter Referral Code'
            />
            {showReferralError && (
              <FormError data-e2e='referralError' style={{ paddingTop: '5px' }}>
                <FormattedMessage
                  defaultMessage='Please enter a valid referral code'
                  id='scenes.register.referralcode.error'
                />
              </FormError>
            )}
          </FormItem>
        </FormGroup>
      )}
      <FormGroup inline>
        <FieldWrapper>
          <Field name='secretPhase' validate={[required]} component={CheckBox} hideErrors />
        </FieldWrapper>
        <FormLabel style={{ marginTop: '1px' }}>
          <Terms />
        </FormLabel>
      </FormGroup>
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

export default SignupForm
