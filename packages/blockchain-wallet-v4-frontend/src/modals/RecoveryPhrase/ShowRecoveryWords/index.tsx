import { LinkDispatchPropsType, LinkStatePropsType } from '../index'
import FirstSetWords from './template'
import React, { PureComponent } from 'react'

type Props = LinkDispatchPropsType & LinkStatePropsType

class ShowRecoveryWords extends PureComponent<Props> {
  handleBackArrow = () => {
    this.props.step === 'FIRST_SET_WORDS'
      ? this.props.recoveryPhraseActions.setStep('RECOVERY_PHRASE_INTRO')
      : this.props.recoveryPhraseActions.setStep('FIRST_SET_WORDS')
  }
  render () {
    return <FirstSetWords handleBackArrow={this.handleBackArrow} />
  }
}

export default ShowRecoveryWords
