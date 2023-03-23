import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Text, TextGroup } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import Terms from 'components/Terms'
import { RecoverSteps } from 'data/types'
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

import { Column, ReverifyIdentityInfoBox } from '../../model'
import { Props as OwnProps } from '.'
import ImportWallet from './import.template'

const PageHeader = styled(Column)`
  align-items: center;
  margin-bottom: 32px;
`

const PasswordRequirementText = styled(Text)<{ isValid?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => (props.isValid ? props.theme.grey800 : props.theme.red600)};
`

const validatePasswordConfirmation = validPasswordConfirmation('recoverPassword')

class SecondStep extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      importWalletPrompt: true
    }
  }

  handleImportNowClick = () => {
    this.setState({ importWalletPrompt: false })
  }

  handleGoBackClick = () => {
    this.props.setStep(RecoverSteps.RECOVERY_OPTIONS)
  }

  render() {
    const { formValues, invalid, isRestoring, isRestoringFromMetadata } = this.props
    const passwordValue = formValues?.recoverPassword || ''
    return (
      <>
        {!isRestoringFromMetadata && !this.state.importWalletPrompt && (
          <PageHeader>
            <Text size='24px' color='white' weight={600} lineHeight='2'>
              <FormattedMessage
                id='scenes.recover.import.header'
                defaultMessage='Create Your Blockchain.com Account'
              />
            </Text>
            <Text size='16px' color='grey600' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.recover.import.subheader'
                defaultMessage='Create your account to access your imported wallet'
              />
            </Text>
          </PageHeader>
        )}
        {isRestoringFromMetadata && (
          <PageHeader>
            <Text size='24px' color='white' weight={600} lineHeight='2'>
              <FormattedMessage
                id='scenes.recover.reset_password'
                defaultMessage='Reset Password'
              />
            </Text>
          </PageHeader>
        )}
        <Wrapper>
          {!isRestoringFromMetadata && this.state.importWalletPrompt ? (
            <ImportWallet
              handleGoBackClick={this.handleGoBackClick}
              handleImportNowClick={this.handleImportNowClick}
              {...this.props}
            />
          ) : (
            <>
              {!isRestoringFromMetadata && (
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
              )}
              <FormGroup>
                <FormLabel htmlFor='password'>
                  {isRestoringFromMetadata && (
                    <FormattedMessage
                      id='scenes.recover.secondstep.password'
                      defaultMessage='Password'
                    />
                  )}
                  {!isRestoringFromMetadata && (
                    <FormattedMessage id='copy.new_password' defaultMessage='New Password' />
                  )}
                </FormLabel>
                <Field
                  bgColor='grey000'
                  name='recoverPassword'
                  validate={[required, validStrongPassword]}
                  component={PasswordBox}
                />
                {passwordValue.length > 0 && !!validStrongPassword(passwordValue) && (
                  <div style={{ marginTop: '4px' }}>
                    <TextGroup inline>
                      <PasswordRequirementText isValid>
                        <FormattedMessage
                          id='scenes.register.password.part1'
                          defaultMessage='Passwords must contain a'
                        />{' '}
                      </PasswordRequirementText>
                      <PasswordRequirementText
                        isValid={stringContainsLowercaseLetter(passwordValue)}
                      >
                        <FormattedMessage
                          id='scenes.register.password.part2'
                          defaultMessage='lowercase letter'
                        />
                        {', '}
                      </PasswordRequirementText>
                      <PasswordRequirementText
                        isValid={stringContainsUppercaseLetter(passwordValue)}
                      >
                        <FormattedMessage
                          id='scenes.register.password.part3'
                          defaultMessage='uppercase letter'
                        />
                        {', '}
                      </PasswordRequirementText>
                      <PasswordRequirementText isValid={stringContainsNumber(passwordValue)}>
                        <FormattedMessage
                          id='scenes.register.password.part4'
                          defaultMessage='number'
                        />
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
              {isRestoringFromMetadata && <ReverifyIdentityInfoBox />}

              <Button
                data-e2e='recoverSubmit'
                disabled={isRestoring || invalid}
                nature='primary'
                type='submit'
                fullwidth
                style={{ marginTop: '24px' }}
              >
                {isRestoring ? (
                  <HeartbeatLoader height='20px' width='20px' color='white' />
                ) : isRestoringFromMetadata ? (
                  <FormattedMessage
                    id='scenes.recover.reset_password'
                    defaultMessage='Reset Password'
                  />
                ) : (
                  <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
                )}
              </Button>
            </>
          )}
        </Wrapper>
      </>
    )
  }
}

type State = { importWalletPrompt: boolean }

type Props = OwnProps & {
  isRestoring?: boolean
  isRestoringFromMetadata?: boolean
}
export default SecondStep
