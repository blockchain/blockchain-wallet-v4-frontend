import React, { PureComponent } from 'react'

import { Props } from '../index'
import WordsList from './template'

class ShowRecoveryWords extends PureComponent<Props> {
  handleNextButton = () => {
    if (this.props.step === 'FIRST_SET_WORDS') {
      this.props.recoveryPhraseActions.setStep('SECOND_SET_WORDS')
    } else {
      this.props.recoveryPhraseActions.setStep('CONFIRM_WORDS')
    }
  }

  render() {
    const { handleBackArrow, recoveryPhrase, step } = this.props
    return (
      <WordsList
        handleBackArrow={handleBackArrow}
        handleNextButton={this.handleNextButton}
        words={recoveryPhrase}
        step={step}
      />
    )
  }
}

export default ShowRecoveryWords
