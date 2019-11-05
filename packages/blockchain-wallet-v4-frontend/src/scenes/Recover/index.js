import { actions } from '../../data'
import { bindActionCreators } from 'redux'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import FirstStep from './FirstStep'
import React from 'react'
import SecondStep from './SecondStep'
import wizardProvider from 'providers/WizardProvider'

class RecoverContainer extends React.PureComponent {
  componentDidMount () {
    this.props.resetStep()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('recover')
  }

  render () {
    const { step, nextStep, previousStep, ...rest } = this.props

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
  connect(
    null,
    mapDispatchToProps
  ),
  wizardProvider('recover', 2)
)

export default enhance(RecoverContainer)
