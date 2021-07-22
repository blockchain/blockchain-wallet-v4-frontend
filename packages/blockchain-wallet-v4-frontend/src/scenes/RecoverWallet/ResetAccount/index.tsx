import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { InjectedFormProps } from 'redux-form'

import { Form } from 'components/Form'
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
    // submit form to reset account
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.state.step === 1 && <StepOne {...this.props} setFormStep={this.setFormStep} />}
        {this.state.step === 2 && <StepTwo {...this.props} />}
      </Form>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  // email from state where we stored it from magic link
  language: selectors.preferences.getLanguage(state)
  // password from reset form
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
