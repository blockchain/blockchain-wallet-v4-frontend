import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Banner, Button, HeartbeatLoader, Link, Text, TextGroup } from 'blockchain-info-components'
import {
  CheckBox,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  SelectBoxCountry,
  SelectBoxUSState,
  TextBox
} from 'components/Form'
import Terms from 'components/Terms'
import { isBrowserSupported } from 'services/browser'
import {
  required,
  validEmail,
  validPasswordConfirmation,
  validStrongPassword
} from 'services/forms'

import { SubviewProps } from '../../types'

const isSupportedBrowser = isBrowserSupported()

const StyledForm = styled(Form)`
  margin-top: 20px;

  > div * {
    max-height: 26rem;
    transition: all 0.5s ease;
  }
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
const PasswordTip = styled(Text)`
  margin-top: 4px;
`
const FieldWrapper = styled.div`
  margin-top: 0.25rem;
  margin-right: 0 !important;
`
const FieldWithoutBottomRadius = styled(FormItem)<{ setBorder: boolean }>`
  .bc__control {
    border-radius: ${(props) => (props.setBorder ? '8px 8px 0 0 ' : '8px')};
  }
`
const FieldWithoutTopRadius = styled(FormItem)<{ setBorder: boolean }>`
  .bc__control {
    border-radius: ${(props) => (props.setBorder ? '0 0 8px 8px' : '8px')};
  }
`

const validatePasswordConfirmation = validPasswordConfirmation('password')

const SignupForm = (props: InjectedFormProps<{}, SubviewProps> & SubviewProps) => {
  const {
    formValues,
    invalid,
    isFormSubmitting,
    onCountrySelect,
    onSignupSubmit,
    showState,
    signupCountryEnabled
  } = props
  const { password = '' } = formValues || {}
  const passwordScore = window.zxcvbn ? window.zxcvbn(password).score : 0

  return (
    <StyledForm override onSubmit={onSignupSubmit}>
      {!isSupportedBrowser && (
        <BrowserWarning>
          <Banner type='warning'>
            <FormattedMessage
              defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, IE 11, or Opera '
              id='scenes.register.browserwarning'
            />
          </Banner>
        </BrowserWarning>
      )}
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='email'>
            <FormattedMessage id='scenes.register.youremail' defaultMessage='Your Email' />
          </FormLabel>
          <Field
            autoFocus
            bgColor='grey000'
            component={TextBox}
            data-e2e='signupEmail'
            disabled={!isSupportedBrowser}
            name='email'
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
            disabled={!isSupportedBrowser}
            name='password'
            passwordScore={passwordScore}
            showPasswordScore
            validate={[required, validStrongPassword]}
          />
        </FormItem>
        {password.length > 0 && (
          <div>
            <PasswordTip size='12px' weight={400}>
              {passwordScore <= 1 && (
                <FormattedMessage
                  id='formhelper.passwordsuggest.weak'
                  defaultMessage='Weak. Use at least 8 characters, a mix of letters, numbers and symbols.'
                />
              )}
              {passwordScore >= 2 && passwordScore < 4 && (
                <FormattedMessage
                  id='formhelper.passwordsuggest.medium'
                  defaultMessage='Medium. Use at least 8 characters, a mix of letters, numbers and symbols.'
                />
              )}
              {passwordScore === 4 && (
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
            disabled={!isSupportedBrowser}
            name='confirmationPassword'
            validate={[required, validatePasswordConfirmation]}
          />
        </FormItem>
      </FormGroup>
      {signupCountryEnabled && (
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
              component={SelectBoxCountry}
              menuPlacement='auto'
              // @ts-ignore
              onChange={onCountrySelect}
              label={
                <FormattedMessage
                  id='components.selectboxcountry.label'
                  defaultMessage='Select country'
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
      )}

      <FormGroup inline>
        <FieldWrapper>
          <Field name='secretPhase' validate={[required]} component={CheckBox} hideErrors />
        </FieldWrapper>
        <FormLabel>
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
            </Link>
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
          <Terms style={{ width: '397px' }} />
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
            <FormattedMessage
              id='scenes.public.register.createWallet'
              defaultMessage='Create Wallet'
            />
          </Text>
        )}
      </Button>
    </StyledForm>
  )
}

export default SignupForm
