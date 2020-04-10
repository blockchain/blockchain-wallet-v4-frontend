import {
  LinkDispatchPropsType,
  LinkStatePropsType,
  OwnPropsType
} from '../index'
import React, { PureComponent } from 'react'
import WordsList from './template'

type Props = OwnPropsType & LinkDispatchPropsType & LinkStatePropsType

class ShowRecoveryWords extends PureComponent<Props> {
  handleBackArrow = () => {
    this.props.step === 'FIRST_SET_WORDS'
      ? this.props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
      : this.props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
  }

  render () {
    const { recoveryPhrase, step } = this.props
    return (
      <WordsList
        handleBackArrow={this.handleBackArrow}
        words={recoveryPhrase}
        step={step}
      />
    )
  }
}

export default ShowRecoveryWords
