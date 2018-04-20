import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

class RecoveryPhraseContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      case 3: return <ThirdStep {...this.props} />
      default: return <div />
    }
  }
}

const enhance = compose(
  modalEnhancer('RecoveryPhrase'),
  wizardProvider('recoveryPhrase', 3)
)

export default enhance(RecoveryPhraseContainer)
