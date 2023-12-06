import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Image,
  Link,
  SpinningLoader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { LoginSteps, ProductAuthOptions, SofiMigrationErrorIds } from 'data/types'
import { useRemote } from 'hooks'
import { required } from 'services/forms'
import { media } from 'services/styles'

import { SofiSsnForm } from './types'

const LoginWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`
const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const SoFiWrapperWithPadding = styled.div`
  padding: 0 32px;
  ${media.mobile`
    padding: 0 16px;
  `}
`

const LoginFormLabel = styled(FormLabel)`
  margin-bottom: 8px;
`
const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ActionButton = styled(Button)`
  margin-top: 15px;
`

const Error = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`

const LoadingWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 175px;
  gap: 16px;
`

const SofiVerifyID = (props: InjectedFormProps) => {
  const { invalid, submitting } = props
  const formValues = useSelector(selectors.form.getFormValues('verifySofiSsn')) as SofiSsnForm
  const { data, error, isLoading, isNotAsked } = useRemote(
    selectors.modules.profile.getSofiMigrationStatus
  )

  const dispatch = useDispatch()

  const isSsnError = error?.id === SofiMigrationErrorIds.SSN_ERROR

  const validSsn = formValues?.sofiSSN?.length === 4

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(actions.modules.profile.migrateSofiUser())
  }
  return (
    <Form onSubmit={handleSubmit}>
      <LoginWrapper isSofi>
        <SoFiWrapperWithPadding>
          {isLoading ? (
            <LoadingWrapper>
              <SpinningLoader width='40px' height='40px' />
              <Text size='20px' lineHeight='1.5' color='grey900' weight={600}>
                <FormattedMessage
                  id='scenes.login.sofi.ssn.creatingaccount'
                  defaultMessage='Creating your account...'
                />
              </Text>
            </LoadingWrapper>
          ) : (
            <>
              <FormBody>
                <Image name='identification-circle' style={{ marginTop: '24px' }} />
                <Text
                  size='20px'
                  color='textBlack'
                  weight={600}
                  lineHeight='1.5'
                  style={{ marginTop: '16px', textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='scenes.login.sofi.ssn.header'
                    defaultMessage='Verify your ID'
                  />
                </Text>

                <Text
                  size='16px'
                  color='textBlack'
                  weight={500}
                  lineHeight='1.5'
                  style={{ marginTop: '8px', textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='scenes.login.sofi.ssn.body'
                    defaultMessage='Enter the last 4 of your SSN to verify you’re the owner of this account. We will not store this information.'
                  />
                </Text>
                <FormGroup>
                  <FormItem style={{ marginTop: '24px' }}>
                    <LoginFormLabel htmlFor='sofiSSN'>
                      <FormattedMessage id='scenes.login.sofi.ssn' defaultMessage='Last 4 SSN' />
                    </LoginFormLabel>
                    <Field
                      autoFocus
                      component={TextBox}
                      data-e2e='sofiSSN'
                      name='sofiSSN'
                      noLastPass
                      placeholder='Enter last 4 of your SSN'
                    />
                  </FormItem>
                  {isSsnError && (
                    <Error inline>
                      <Text size='12px' color='error' weight={400} data-e2e='sofiSSNError'>
                        <FormattedMessage
                          id='scenes.login.sofi.ssn.error'
                          defaultMessage='Verification failed. Please try again.'
                        />
                      </Text>
                    </Error>
                  )}
                </FormGroup>
              </FormBody>
              <LinkRow>
                <ActionButton
                  type='submit'
                  nature='primary'
                  fullwidth
                  height='48px'
                  disabled={submitting || invalid || !validSsn}
                  data-e2e='loginButton'
                  style={{ marginBottom: '16px' }}
                >
                  {submitting || isLoading ? (
                    <HeartbeatLoader height='20px' width='20px' color='white' />
                  ) : (
                    <Text color='whiteFade900' size='16px' weight={600}>
                      <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
                    </Text>
                  )}
                </ActionButton>
              </LinkRow>
            </>
          )}
        </SoFiWrapperWithPadding>
      </LoginWrapper>
    </Form>
  )
}

export default reduxForm({ form: 'verifySofiSsn' })(SofiVerifyID)
