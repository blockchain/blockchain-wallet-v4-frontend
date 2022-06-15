import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Button, Text, TextGroup } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'
import {
  required,
  stringContainsLowercaseLetter,
  stringContainsNumber,
  stringContainsSpecialChar,
  stringContainsUppercaseLetter,
  stringLengthBetween,
  validPasswordConfirmation,
  validStrongPassword
} from 'services/forms'

import ScreenHeader from '../../components/ScreenHeader'
import { StyledTemporaryButton } from '../AccountUpgrade.models'

const PasswordRequirementText = styled(Text)<{ isValid?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => (props.isValid ? props.theme.grey800 : props.theme.red600)};
`
const validatePasswordConfirmation = validPasswordConfirmation('upgradePassword')

const CreateWallet = (props) => {
  const passwordValue = props.formValues?.upgradePassword || ''
  return (
    <>
      <Wrapper>
        <ScreenHeader
          title={
            <FormattedMessage
              id='scenes.login.upgrade.newpassword'
              defaultMessage='Create a New Password'
            />
          }
        />
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='upgradePassword' id='upgradePassword'>
              <FormattedMessage defaultMessage='Password' id='scenes.register.password' />
            </FormLabel>
            <Field
              bgColor='grey000'
              component={PasswordBox}
              data-e2e='upgradePassword'
              name='upgradePassword'
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
                <PasswordRequirementText isValid={stringLengthBetween(passwordValue, 12, 64)}>
                  <FormattedMessage
                    id='scenes.register.password.part7'
                    defaultMessage='12 characters'
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
              data-e2e='upgradeConfirmPassword'
              name='confirmationPassword'
              placeholder='Enter Password'
              validate={[required, validatePasswordConfirmation]}
            />
          </FormItem>
        </FormGroup>

        <Button
          nature='primary'
          data-e2e='createWalletUpgradeAccount'
          fullwidth
          height='48px'
          onClick={() =>
            props.signupActions.createWalletForExchangeAccountUpgrade({
              captchaToken: '',
              password: 'blockchain'
            })
          }
        >
          Next
        </Button>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_OVERVIEW)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.ERROR_WALLET_CREATION)
        }
        type='button'
      >
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(CreateWallet)
