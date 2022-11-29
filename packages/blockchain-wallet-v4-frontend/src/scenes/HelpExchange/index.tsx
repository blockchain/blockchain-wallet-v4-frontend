import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { RemoteDataType } from '@core/types'
import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { required, validEmail } from 'services/forms'
import { media } from 'services/styles'

const FormWrapper = styled(Wrapper)`
  padding: 24px 0;
  ${media.mobile`
  padding: 16px 0;
`}
`

const WrapperWithPadding = styled.div`
  padding: 0 32px;
  ${media.mobile`
  padding: 0 16px;
  `}
`

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 0;
  ${media.mobile`
  flex-direction: column;
  align-items: center;
`};
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

const ErrorOrSuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const CircleBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  background-color: ${(props) => props.theme.blue600};
  border-radius: 40px;
  margin: 16px 0;
`

const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
`

const removeWhitespace = (string) => string.replace(/\s/g, ``)

class Help extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  componentWillUnmount() {
    this.props.authActions.exchangeResetPasswordNotAsked()
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.authActions.exchangeResetPassword(this.props.formValues?.email)
  }

  render() {
    const { invalid, submitting } = this.props
    return (
      <FormWrapper>
        <WrapperWithPadding>
          <LinkContainer to='/login?product=exchange'>
            <BackArrow>
              <Icon
                data-e2e='needHelpBack'
                name='arrow-back'
                size='24px'
                color='blue600'
                style={{ marginRight: '4px' }}
                role='button'
              />
              <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
                <FormattedMessage id='copy.back' defaultMessage='Back' />
              </Text>
            </BackArrow>
          </LinkContainer>
          <Text color='grey900' size='20px' weight={600} style={{ textAlign: 'center' }}>
            <FormattedMessage
              id='copy.forgot_exchange_password'
              defaultMessage='Forgot Exchange Password'
            />
          </Text>
          {this.props.resetExchangePasswordR.cata({
            Failure: () => (
              <ErrorOrSuccessWrapper>
                <Icon color='error' name='close-circle' size='40px' />
                <Text size='20px' weight={600} color='black' style={{ margin: '8px 0' }}>
                  <FormattedMessage id='copy.oops' defaultMessage='Oops. Something went wrong.' />
                </Text>
                <Text size='16px' weight={500} color='grey600'>
                  <FormattedMessage
                    id='copy.exchange_password_reset_failed'
                    defaultMessage='Failed to reset exchange password.'
                  />
                </Text>
              </ErrorOrSuccessWrapper>
            ),
            Loading: () => (
              <LoadingWrapper>
                <SpinningLoader width='40px' height='40px' />
              </LoadingWrapper>
            ),
            NotAsked: () => (
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <FormItem style={{ marginTop: '30px' }}>
                    <FormLabel htmlFor='email'>
                      <FormattedMessage id='scenes.register.youremail' defaultMessage='Email' />
                    </FormLabel>
                    <Field
                      component={TextBox}
                      data-e2e='exchangeEmail'
                      disableSpellcheck
                      name='email'
                      normalize={removeWhitespace}
                      validate={[required, validEmail]}
                      placeholder='Enter Email'
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
            Success: () => (
              <ErrorOrSuccessWrapper>
                <CircleBackground>
                  <Icon name='computer' color='white' size='24px' />
                </CircleBackground>
                <Text
                  size='16px'
                  weight={500}
                  color='grey600'
                  lineHeight='1.5'
                  style={{ textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='scenes.login.exchange.help.passwordresetsuccess'
                    defaultMessage="If you're registered on the Exchange, you will receive an email with instructions on how to reset your password shortly."
                  />
                </Text>
              </ErrorOrSuccessWrapper>
            )
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
  resetExchangePasswordR: RemoteDataType<null, null>
}
type Props = LinkStatePropsType & {
  showHelpOptions: () => void
}

const enhance = compose(reduxForm<{}, Props>({ form: 'exchangePasswordReset' }), connector)

export default enhance(Help) as React.ComponentType
