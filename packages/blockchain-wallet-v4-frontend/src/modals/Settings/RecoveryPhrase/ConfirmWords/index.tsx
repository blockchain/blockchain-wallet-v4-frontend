import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { forEach, keysIn, map, prop, range, sortBy, split, take } from 'ramda'
import { compose } from 'redux'
import { SubmissionError } from 'redux-form'

import { Props } from '../index'
import ConfirmWordsForm from './template'

class ConfirmWords extends PureComponent<Props, StateType> {
  constructor(props) {
    super(props)
    this.state = { indexes: [] }
  }

  componentDidMount() {
    // @ts-ignore
    const randomize = sortBy(prop(0))
    const pair = map((x) => [Math.random(), x])
    const indexes = compose(
      take(5),
      // @ts-ignore
      map(prop(1)),
      // @ts-ignore
      randomize,
      pair
      // @ts-ignore
    )(range(0, 12))
    /* eslint-disable */
    this.setState({ indexes })
    /* eslint-enable */
  }

  handleSubmit = (values) => {
    const errors = {}
    compose(
      forEach((word) => {
        // @ts-ignore
        if (values[word] !== this.props.recoveryPhrase[split('w', word)[1]]) {
          // @ts-ignore
          errors[word] = (
            <FormattedMessage
              id='modals.recoveryphrase.confirmwords.incorrect'
              defaultMessage='Incorrect Word'
            />
          )
        }
      }),
      keysIn
    )(values)

    if (keysIn(errors).length) {
      throw new SubmissionError(errors)
    } else {
      this.props.walletActions.verifyMnemonic()
      this.props.walletActions.updateMnemonicBackup()
      this.props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SUCCESS')
    }
  }

  render() {
    const { ...rest } = this.props
    return <ConfirmWordsForm {...rest} indexes={this.state.indexes} onSubmit={this.handleSubmit} />
  }
}

type StateType = {
  indexes: Array<any>
}

export default ConfirmWords
