import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Image, Text, TextGroup } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import { actions, selectors } from 'data'
import { Analytics, SofiMigrationErrorIds } from 'data/types'
import { useRemote } from 'hooks'

import { SofiSsnForm } from './types'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  height: 100%;
  flex: 1;
`

const LoginFormLabel = styled(FormLabel)`
  margin-bottom: 8px;
`

const Error = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`

const SofiVerifyID = (props: InjectedFormProps) => {
  const { invalid, submitting } = props
  const formValues = useSelector(selectors.form.getFormValues('verifySofiSsn')) as SofiSsnForm
  const { data, error, isLoading, isNotAsked } = useRemote(
    selectors.modules.profile.getSofiMigrationStatus
  )

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.SOFI_MIGRATION_NEED_SSN_SHOWED,
        properties: {}
      })
    )
  }, [])

  const isSsnError = error?.id === SofiMigrationErrorIds.SSN_ERROR

  const validSsn = formValues?.sofiSSN?.length === 4

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(actions.modules.profile.migrateSofiUser())
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.SOFI_MIGRATION_NEED_SSN_CONTINUE_CLICKED,
        properties: {}
      })
    )
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FlyoutContainer>
        <FlyoutContent mode='top'>
          <FormBody>
            <Image name='identification-circle-black' height='88px' style={{ marginTop: '24px' }} />
            <Text
              size='20px'
              color='textBlack'
              weight={600}
              lineHeight='1.5'
              style={{ marginTop: '16px', textAlign: 'center' }}
            >
              <FormattedMessage id='scenes.login.sofi.ssn.header' defaultMessage='Verify your ID' />
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
                  component={PasswordBox}
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
        </FlyoutContent>
        <FlyoutFooter>
          <Button
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || !validSsn}
            data-e2e='submitSsnButton'
            style={{ marginBottom: '16px', marginTop: '56px' }}
          >
            {submitting || isLoading ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <Text color='whiteFade900' size='16px' weight={600}>
                <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
              </Text>
            )}
          </Button>
        </FlyoutFooter>
      </FlyoutContainer>
    </Form>
  )
}

export default reduxForm({ form: 'verifySofiSsn' })(SofiVerifyID)
