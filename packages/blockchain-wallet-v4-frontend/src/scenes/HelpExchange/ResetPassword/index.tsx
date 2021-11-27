import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { RemoteDataType } from '@core/types'
import { Button, HeartbeatLoader, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { required, validEmail } from 'services/forms'

const FormWrapper = styled(Wrapper)`
  padding: 32px 0;
`

const WrapperWithPadding = styled.div`
  padding: 0 32px;
`

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 0;
`
const SignUpText = styled(Text)`
  &:hover {
    font-weight: 600;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const removeWhitespace = (string) => string.replace(/\s/g, ``)

const EnterEmail: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const { invalid, submitting } = props

  const onSubmit = (e) => {
    e.preventDefault()
    props.authActions.exchangeResetPassword(props.formValues?.email)
  }
  return (
    <FormWrapper>
      <WrapperWithPadding>
        {props.resetExchangePasswordR.cata({
          Failure: (val) => <Text>Fail</Text>,
          Loading: () => (
            <LoadingWrapper>
              <SpinningLoader width='40px' height='40px' />
            </LoadingWrapper>
          ),
          NotAsked: () => (
            <Form onSubmit={onSubmit}>
              <Text color='grey900' size='20px' weight={600} style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id='copy.forgot_exchange_password'
                  defaultMessage='Forgot Exchange Password'
                />
              </Text>
              <FormGroup>
                <FormItem style={{ marginTop: '30px' }}>
                  <FormLabel htmlFor='email'>
                    <FormattedMessage id='scenes.register.youremail' defaultMessage='Your Email' />
                  </FormLabel>
                  <Field
                    component={TextBox}
                    data-e2e='exchangeEmail'
                    disableSpellcheck
                    name='email'
                    normalize={removeWhitespace}
                    validate={[required, validEmail]}
                    placeholder='Enter your email'
                    autoFocus
                  />
                </FormItem>
              </FormGroup>
              <Button
                type='submit'
                nature='primary'
                fullwidth
                height='48px'
                disabled={submitting || invalid}
                data-e2e='loginButton'
                style={{ marginBottom: '16px' }}
              >
                {submitting ? (
                  <HeartbeatLoader height='20px' width='20px' color='white' />
                ) : (
                  <Text color='whiteFade900' size='16px' weight={600}>
                    <FormattedMessage
                      id='scenes.login.exchange.help.requestpasswordreset'
                      defaultMessage='Request password reset'
                    />
                  </Text>
                )}
              </Button>
            </Form>
          ),
          Success: () => <Text>YAY</Text>
        })}
      </WrapperWithPadding>
      <LinkContainer data-e2e='signupLink' to='/signup'>
        <Link>
          <SubCard>
            <Text size='16px' color='grey600' weight={500} style={{ marginTop: '16px' }}>
              <FormattedMessage
                id='scenes.login.account_signup'
                defaultMessage="Don't have a Blockchain Account?"
              />
            </Text>
            &nbsp;
            <SignUpText size='16px' color='blue600' weight={600} style={{ marginTop: '16px' }}>
              <FormattedMessage id='buttons.signup_now' defaultMessage='Sign up Now ->' />
            </SignUpText>
          </SubCard>
        </Link>
      </LinkContainer>
    </FormWrapper>
  )
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('exchangePasswordReset')(state),
  resetExchangePasswordR: selectors.auth.getExchangeResetPassword(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  authActions: typeof actions.auth
  formValues: {
    email: string
  }
  resetExchangePasswordR: RemoteDataType<string, null>
}
type Props = LinkStatePropsType & {
  showPasswordResetForm: () => void
}
const enhance = compose(reduxForm<{}, Props>({ form: 'exchangePasswordReset' }), connector)

export default enhance(EnterEmail) as React.ComponentType
