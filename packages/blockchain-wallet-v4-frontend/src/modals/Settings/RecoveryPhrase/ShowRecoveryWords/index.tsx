import React, { PureComponent } from 'react'

import {
  LinkDispatchPropsType,
  LinkStatePropsType,
  OwnPropsType
} from '../index'
import WordsList from './template'

type Props = OwnPropsType & LinkDispatchPropsType & LinkStatePropsType

class ShowRecoveryWords extends PureComponent<Props> {
  handleNextButton = () => {
    this.props.step === 'FIRST_SET_WORDS'
      ? this.props.recoveryPhraseActions.setStep('SECOND_SET_WORDS')
      : this.props.recoveryPhraseActions.setStep('CONFIRM_WORDS')
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
