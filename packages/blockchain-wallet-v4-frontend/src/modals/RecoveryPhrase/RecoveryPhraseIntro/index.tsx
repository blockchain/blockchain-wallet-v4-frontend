import React from 'react'
import RecoveryPhraseIntro from './template'

export type OwnProps = {
  handleClose: () => void
}

export type Props = OwnProps

class RecoveryPhraseIntroContainer extends React.PureComponent<Props> {
  render () {
    return <RecoveryPhraseIntro {...this.props} />
  }
}

export default RecoveryPhraseIntroContainer
