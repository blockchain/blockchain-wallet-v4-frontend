import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Link, Text, TextGroup } from 'blockchain-info-components'
import CheckBox from 'components/Form/CheckBox'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import SelectBox from 'components/Form/SelectBox'
// import SelectBoxCountry from 'components/Form/SelectBoxCountry'
import SelectBoxUSState from 'components/Form/SelectBoxUSState'
import TextBox from 'components/Form/TextBox'
import Terms from 'components/Terms'
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

const getCountryElements = (countries) => [
  {
    group: '',
    items: countries.map((country) => ({
      text: country.name,
      value: country
    }))
  }
]

const SignupForm = (props: Props) => {
  const {
    formValues,
    invalid,
    isFormSubmitting,
    onCountrySelect,
    onSignupSubmit,
    showState,
    supportedCountries
  } = props
  const passwordValue = formValues?.password || ''

  return (
    <StyledForm override onSubmit={onSignupSubmit}>
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
                  id='scenes.register.password.part7'
                  defaultMessage='8 characters'
                />{' '}
              </PasswordRequirementText>
              <PasswordRequirementText isValid>
                <FormattedMessage id='scenes.register.password.part7' defaultMessage='long' />.
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
            placeholder='Reenter Password'
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
            elements={getCountryElements(supportedCountries)}
            component={SelectBox}
            menuPlacement='auto'
            onChange={onCountrySelect}
            label={
              <FormattedMessage
                id='scenes.register.select_country'
                defaultMessage='Select Country'
              />
            }
          />
        </FieldWithoutBottomRadius>
        {showState ? (
          <FieldWithoutTopRadius setBorder={showState}>
            <Field
              name='state'
              component={SelectBoxUSState}
              errorBottom
              validate={[required]}
              normalize={(val) => val && val.code}
              label={
                <FormattedMessage
                  id='components.selectboxstate.label'
                  defaultMessage='Select state'
                />
              }
            />
          </FieldWithoutTopRadius>
        ) : null}
      </FormGroup>

      <FormGroup inline>
        <FieldWrapper>
          <Field name='secretPhase' validate={[required]} component={CheckBox} hideErrors />
        </FieldWrapper>
        <FormLabel style={{ marginTop: '1px' }}>
          <TextGroup inline>
            <Text color='grey800' size='12px' weight={500}>
              <FormattedMessage
                id='scenes.register.backupphrase1'
                defaultMessage='I understand that Blockchain.com never stores passwords and therefore cannot recover or reset my password. If I lose access to my wallet, I must use my'
              />
            </Text>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/209564506-Make-a-Wallet-Backup'
              target='_blank'
              size='12px'
              weight={500}
              data-e2e='blockchainTermsLink'
            >
              <FormattedMessage
                id='scenes.securitysettings.basicsecurity.secretrecoveryphrase.title'
                defaultMessage='Secret Private Key Recovery Phrase'
              />
            </Link>{' '}
            <Text color='grey800' size='12px' weight={500}>
              <FormattedMessage
                id='scenes.register.backupphrase2'
                defaultMessage='to access my funds.'
              />
            </Text>
          </TextGroup>
        </FormLabel>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <Terms style={{ textAlign: 'center', width: '397px' }} isCentered />
        </FormItem>
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
