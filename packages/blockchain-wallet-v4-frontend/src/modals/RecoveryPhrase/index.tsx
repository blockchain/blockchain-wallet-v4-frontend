import { compose } from 'redux'
import FirstSetWords from './FirstSetWords'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
// import RecoveryPhraseIntroContainer from './RecoveryPhraseIntro'

export type OwnPropsType = {
  close: () => void
  in: boolean
  position: number
  total: number
  userClickedOutside: boolean
}

type Props = OwnPropsType

type State = {
  // step:
  // | 'RECOVERY_PHRASE_INTRO'
  // | 'FIRST_SET_WORDS'
  // | 'SECOND_SET_WORDS'
  // | 'CONFIRM_WORDS'
  // | 'CONFIRM_WORDS_SUCCESS';
  show: boolean
}

class RecoveryPhraseFlyout extends React.PureComponent<Props, State> {
  state: State = {
    // step: 'RECOVERY_PHRASE_INTRO',
    show: false
  }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    const { userClickedOutside, ...rest } = this.props
    return (
      <Flyout
        {...rest}
        in={this.state.show}
        onClose={this.handleClose}
        userClickedOutside={userClickedOutside}
        data-e2e='recoveryPhraseModal'
      >
        <FlyoutChild>
          <FirstSetWords />
        </FlyoutChild>
      </Flyout>
    )
  }
}

const enhance = compose<any>(
  modalEnhancer('RECOVERY_PHRASE_MODAL', { transition: duration })
)

export default enhance(RecoveryPhraseFlyout)
