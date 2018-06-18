import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'ramda'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { actions } from '../../data'

class RecoverContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('recover')
  }

  render () {
    const { step, nextStep, previousStep, ...rest } = this.props

    switch (step) {
      case 1: return <FirstStep onSubmit={nextStep} {...rest} />
      case 2: return <SecondStep previousStep={previousStep} {...rest} />
      default: return <FirstStep onSubmit={nextStep} {...rest} />
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(null, mapDispatchToProps),
  wizardProvider('recover', 2)
)

export default enhance(RecoverContainer)
