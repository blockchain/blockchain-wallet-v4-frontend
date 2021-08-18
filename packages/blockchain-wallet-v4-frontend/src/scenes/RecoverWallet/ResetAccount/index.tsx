import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { InjectedFormProps } from 'redux-form'

import { Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import { Form } from 'components/Form'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RecoverSteps } from 'data/types'

import { Props as OwnProps } from '..'
import StepOne from './StepOne'
import StepTwo from './StepTwo'

class ResetAccount extends React.PureComponent<InjectedFormProps<{}, Props> & Props, StateProps> {
  constructor(props) {
    super(props)
    this.state = {
      step: 1
    }
  }

  setFormStep = () => {
    this.setState({ step: 2 })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { authActions, cachedEmail, language, resetPassword } = this.props
    authActions.resetAccount(cachedEmail, resetPassword, language)
  }

  render() {
    const isRegistering = Remote.Loading.is(this.props.registering)
    return (
      <>
        <Wrapper>
          <Form onSubmit={this.handleSubmit}>
            {this.state.step === 1 && <StepOne {...this.props} setFormStep={this.setFormStep} />}
            {this.state.step === 2 && <StepTwo {...this.props} isRegistering={isRegistering} />}
          </Form>
        </Wrapper>
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  language: selectors.preferences.getLanguage(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type StateProps = {
  step: number
}

export type Props = OwnProps & {
  setStep: (step: RecoverSteps) => void
}

export default connector(ResetAccount)
