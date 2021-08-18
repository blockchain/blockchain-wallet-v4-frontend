import React from 'react'
import { FormattedMessage } from 'react-intl'
import { has, props } from 'ramda'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import Terms from 'components/Terms'
import { RecoverSteps } from 'data/types'
import {
  required,
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
    const { invalid, isRestoring, isRestoringFromMetadata, recoverPassword } = this.props
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
              <Form>
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
                      <FormattedMessage
                        id='copy.new_password'
                        defaultMessage='New Password'
                      />
                    )}
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
                    <FormattedMessage id='button.continue' defaultMessage='Continue' />
                  )}
                </Button>
              </Form>
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
