import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import wizardProvider from 'providers/WizardProvider'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RecoverContainer extends React.PureComponent {
  componentDidMount() {
    this.props.resetStep()
  }

  componentWillUnmount() {
    this.props.formActions.destroy('recover')
  }

  render() {
    const { nextStep, previousStep, step, ...rest } = this.props

    switch (step) {
      case 1:
        return <FirstStep onSubmit={nextStep} {...rest} />
      case 2:
        return <SecondStep previousStep={previousStep} {...rest} />
      default:
        return <FirstStep onSubmit={nextStep} {...rest} />
    }
  }
}

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(null, mapDispatchToProps),
  wizardProvider('recover', 2)
)

export default enhance(RecoverContainer)
