import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { actions, selectors } from 'data'
import { Button } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

import Loading from '../loading.public'
import {LOGIN_NEW} from './model'
// step templates
import EnterEmailOrGuid from './EnterEmailOrGuid'
import EnterPassword from './EnterPassword'
import EnterTwoFactor from './EnterTwoFactor'
import VerificationEmail from './VerificationEmail'
import VerificationMobile from './VerificationMobile'

// TODO: move this
enum LoginSteps {
  ENTER_EMAIL_GUID,
  ENTER_PASSWORD,
  ENTER_TWO_FACTOR,
  LOADING,
  VERIFICATION_EMAIL,
  VERIFICATION_MOBILE
}

type LoginFormValues = {
  guidOrEmail: string
  password: string
  twoFA?: number |string 
}

// TODO: remove temp
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`

class Login extends PureComponent<Props> {
  state = { currentStep: LoginSteps.ENTER_EMAIL_GUID }

  componentDidMount() {
    // TODO: browser check
    // TODO: check for existing cookie/localstorage?
  }

setStep = (step: LoginSteps) => {
  this.props.formActions.change(LOGIN_NEW, 'step', step)
}

  render() {
    const { currentStep } = this.state
    return (
      <>
        <Wrapper>
          {(() => {
            switch (currentStep) {
              case LoginSteps.ENTER_EMAIL_GUID:
                return <EnterEmailOrGuid />

              case LoginSteps.ENTER_PASSWORD:
                return <EnterPassword />

              case LoginSteps.ENTER_TWO_FACTOR:
                return <EnterTwoFactor />

              case LoginSteps.VERIFICATION_EMAIL:
                return <VerificationEmail />

              case LoginSteps.VERIFICATION_MOBILE:
                return <VerificationMobile />

              case LoginSteps.LOADING:
              default:
                return <Loading />
            }
          })()}
        </Wrapper>
        <ButtonRow>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.ENTER_EMAIL_GUID)}
          >
            Enter Email/Guid
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.ENTER_PASSWORD)}
          >
            Enter Password
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.ENTER_TWO_FACTOR)}
          >
            Enter 2FA
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.VERIFICATION_EMAIL)}
          >
            Verify Email
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.setStep(LoginSteps.VERIFICATION_MOBILE)}
          >
            Verify Mobile
          </Button>
        </ButtonRow>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues(LOGIN_NEW)(
    state
  )
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>
const enhance = compose<any>(
  reduxForm({
    form: LOGIN_NEW,
  }),
  connector
)

export default enhance(Login)
