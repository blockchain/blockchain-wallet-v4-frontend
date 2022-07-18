import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import { actions, selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { LoginSteps } from 'data/auth/types'
import { RootState } from 'data/rootReducer'
import { required, validStrongPassword } from 'services/forms'

const Wrapper = styled(Flex)`
  height: 100%;

  input {
    background-color: transparent !important;
  }
`

const PasswordBoxStyled = styled(PasswordBox)`
  & input {
    background-color: transparent !important;
  }
`

const Unlock = (props: Props) => {
  const onSubmit = (e) => {
    e.preventDefault()
    props.authActions.continueLoginProcess()
  }

  const setStep = (step: LoginSteps) => {
    props.formActions.change(LOGIN_FORM, 'step', step)
  }

  useEffect(() => {
    props.authActions.initializeLogin()
    setStep(LoginSteps.ENTER_PASSWORD_WALLET)
    const { guidStored, lastEmail, lastGuid } = props.cache
    if (guidStored || lastGuid) {
      props.formActions.change(LOGIN_FORM, 'guid', lastGuid || guidStored)
      props.formActions.change(LOGIN_FORM, 'email', lastEmail)
      props.formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET)
    }
  }, [])

  const { formValues } = props
  const passwordValue = formValues?.password || ''

  const passwordError = passwordValue.length < 1 && !!validStrongPassword(passwordValue)

  return (
    <Wrapper flexDirection='column' justifyContent='space-between'>
      <Flex flexDirection='column' alignItems='center'>
        <Text weight={700} size='20px' color='white'>
          <FormattedMessage
            id='plugin.welcomeBackTitle'
            defaultMessage='Welcome back to Blockchain.com'
          />
        </Text>
      </Flex>
      <Flex alignItems='center'>
        <Form override onSubmit={onSubmit}>
          <FormGroup>
            <FormItem>
              <FormLabel htmlFor='confirmationPassword' id='confirmationPassword'>
                <FormattedMessage defaultMessage='Password' id='plugin.password' />
              </FormLabel>
              <Field
                component={PasswordBoxStyled}
                data-e2e='unlockPassword'
                name='password'
                placeholder='Enter Password'
                validate={[required]}
              />
            </FormItem>
          </FormGroup>
          <Button disabled={passwordError} type='submit' width='100%' data-e2e='unlock-btn'>
            <Text weight={500}>
              <FormattedMessage id='plugin.unlock' defaultMessage='Unlock' />
            </Text>
          </Button>
        </Form>
      </Flex>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  cache: selectors.cache.getCache(state),
  formValues: selectors.form.getFormValues(LOGIN_FORM)(state) as { password: string }
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch),
  websocketActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

const enhance = compose(reduxForm<{}, Props>({ form: LOGIN_FORM }), connector)

export default enhance(Unlock) as React.ComponentClass<Props>
