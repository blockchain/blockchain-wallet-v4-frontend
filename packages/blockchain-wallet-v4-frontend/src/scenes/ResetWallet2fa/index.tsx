import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { RemoteDataType } from '@core/remote/types'
import { Button, Icon, Link, SpinningLoader, Text, TextGroup } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { required, validEmail, validWalletId } from 'services/forms'
import { media } from 'services/styles'

const FormWrapper = styled(Wrapper)`
  padding: 24px 32px 32px;
  ${media.mobile`
  padding: 16px;
`}
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`
const ResetForm = styled(Form)`
  margin-top: 15px;
`
const InfoMsg = styled(Text)`
  margin-top: 5px;
`
const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
`

const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
`

const validNullableEmail = (emailVal) => {
  return emailVal && emailVal.length ? validEmail(emailVal) : undefined
}

class ResetWallet2fa extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  componentWillUnmount() {
    this.props.actions.resetForm()
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.props.actions.resetWallet2fa(this.props.formValues)
  }

  render() {
    const { invalid, resetWallet2faR } = this.props

    return (
      <FormWrapper>
        <LinkContainer to='/help'>
          <BackArrow>
            <Icon
              data-e2e='resetBack'
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
        <Header>
          <Text size='20px' color='blue900' weight={600} capitalize>
            <FormattedMessage id='scenes.reset2fa.firststep.reset' defaultMessage='Reset 2FA' />
          </Text>
        </Header>
        {resetWallet2faR.cata({
          Failure: (val) => (
            <>
              <Text size='14px' style={{ margin: '28px 0 16px' }} weight={500}>
                <FormattedMessage
                  id='scenes.walletguidreminder.error'
                  defaultMessage='We were unable to process your request at this time. Please try again or contact support if the issue persists.'
                />
              </Text>
              {val && (
                <Text color='red600' size='14px' style={{ margin: '0 0 28px' }} weight={500}>
                  Error: {val}
                </Text>
              )}
              <LinkContainer to='/login'>
                <Button data-e2e='continueToLogin' nature='primary' fullwidth>
                  <FormattedMessage
                    id='buttons.continue_to_login'
                    defaultMessage='Continue to Login'
                  />
                </Button>
              </LinkContainer>
            </>
          ),
          Loading: () => (
            <LoadingWrapper>
              <SpinningLoader width='40px' height='40px' />
            </LoadingWrapper>
          ),
          NotAsked: () => (
            <>
              <TextGroup>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.reset2fa.firststep.explanation'
                    defaultMessage='Fill out the form below to regain access to your Blockchain.com Account by resetting your 2FA or restricted IP.'
                  />
                </Text>
                <Text size='13px' weight={400}>
                  <FormattedMessage
                    id='scenes.reset2fa.firststep.explain2'
                    defaultMessage='Note: Your IP address and browser information will be recorded upon submission.'
                  />
                </Text>
              </TextGroup>
              <ResetForm onSubmit={this.onSubmit}>
                <FormGroup>
                  <FormItem>
                    <FormLabel htmlFor='guid'>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.firststepform.walletid'
                        defaultMessage='Wallet ID'
                      />
                    </FormLabel>
                    <Field
                      bgColor='grey000'
                      autoFocus
                      component={TextBox}
                      disableSpellcheck
                      name='guid'
                      validate={[required, validWalletId]}
                    />
                    <TextGroup inline>
                      <Text size='12px' weight={400}>
                        <FormattedMessage
                          id='scenes.reset2fa.firststep.firststepform.guidexplain'
                          defaultMessage='If you forgot your wallet identifier, please'
                        />
                      </Text>
                      <LinkContainer to='/reminder'>
                        <Link size='12px' weight={500}>
                          <FormattedMessage
                            id='scenes.reset2fa.firststep.look'
                            defaultMessage='look it up here.'
                          />
                        </Link>
                      </LinkContainer>
                    </TextGroup>
                  </FormItem>
                </FormGroup>
                <FormGroup>
                  <FormItem>
                    <FormLabel htmlFor='email'>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.firststepform.email'
                        defaultMessage='Registered Email'
                      />
                    </FormLabel>
                    <Field
                      bgColor='grey000'
                      name='email'
                      validate={[required, validEmail]}
                      component={TextBox}
                    />
                    <Text size='12px' weight={400}>
                      <FormattedMessage
                        id='scenes.reset2fa.firststep.firststepform.emailexplanation'
                        defaultMessage='Enter the email associated with your wallet.'
                      />
                    </Text>
                  </FormItem>
                </FormGroup>

                <Footer>
                  <Button
                    data-e2e='2faResetContinue'
                    type='submit'
                    nature='primary'
                    disabled={invalid}
                    fullwidth
                  >
                    <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
                  </Button>
                </Footer>
              </ResetForm>
            </>
          ),
          Success: () => (
            <>
              <TextGroup inline style={{ margin: '32px 0' }}>
                <Text size='14px' weight={500}>
                  <FormattedMessage
                    id='scenes.reset2fa.thirdstep.message'
                    defaultMessage='Thank you for submitting a two-factor authentication reset request. Please check your email for further instructions.'
                  />
                </Text>
                <Text size='14px' weight={500}>
                  <FormattedMessage
                    id='scenes.reset2fa.thirdstep.info'
                    defaultMessage='This process usually takes two weeks. If you would like to learn more about the reset process, visit our'
                  />
                </Text>
                <Link
                  size='14px'
                  weight={500}
                  href='https://support.blockchain.com/hc/en-us/articles/360000286426-I-lost-my-2FA-device-How-do-I-get-back-into-my-wallet-'
                  target='_blank'
                >
                  <FormattedMessage
                    id='scenes.reset2fa.thirdstep.infolink'
                    defaultMessage='support page.'
                  />
                </Link>
              </TextGroup>
              <Footer>
                <LinkContainer to='/login'>
                  <Button data-e2e='reset2faContinue' nature='primary' fullwidth>
                    <FormattedMessage
                      id='buttons.continue_to_login'
                      defaultMessage='Continue to Login'
                    />
                  </Button>
                </LinkContainer>
              </Footer>
            </>
          )
        })}
      </FormWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('wallet2faReset')(state),
  resetWallet2faR: selectors.components.resetWallet2fa.getFormRequestState(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.resetWallet2fa, dispatch)
})

type LinkStatePropsType = {
  actions: typeof actions.components.resetWallet2fa
  formValues: {
    email: string
    guid: string
    newEmail?: string
  }
  resetWallet2faR: RemoteDataType<string, null>
}

type Props = LinkStatePropsType

// @ts-ignore
const enhance = compose(
  reduxForm<{}, Props>({ form: 'wallet2faReset' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ResetWallet2fa) as React.ComponentType
