import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Button } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

import Loading from '../loading.public'
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

  onStepChange = newStep => {
    this.setState({ currentStep: newStep })
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
            onClick={() => this.onStepChange(LoginSteps.ENTER_EMAIL_GUID)}
          >
            Enter Email/Guid
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.onStepChange(LoginSteps.ENTER_PASSWORD)}
          >
            Enter Password
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.onStepChange(LoginSteps.ENTER_TWO_FACTOR)}
          >
            Enter 2FA
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.onStepChange(LoginSteps.VERIFICATION_EMAIL)}
          >
            Verify Email
          </Button>
          <Button
            data-e2e=''
            nature='empty-blue'
            onClick={() => this.onStepChange(LoginSteps.VERIFICATION_MOBILE)}
          >
            Verify Mobile
          </Button>
        </ButtonRow>
      </>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Login)
