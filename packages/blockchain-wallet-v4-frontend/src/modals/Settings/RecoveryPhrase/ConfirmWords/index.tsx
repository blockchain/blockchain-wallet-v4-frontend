import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { forEach, keysIn, map, prop, range, sortBy, split, take } from 'ramda'
import { compose } from 'redux'
import { SubmissionError } from 'redux-form'

import {
  LinkDispatchPropsType,
  LinkStatePropsType,
  OwnPropsType
} from '../index'
import ConfirmWordsForm from './template'

export type Props = OwnPropsType & LinkDispatchPropsType & LinkStatePropsType

class ConfirmWords extends PureComponent<Props> {
  state = { indexes: [] }

  componentDidMount() {
    // @ts-ignore
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(
      take(5),
      // @ts-ignore
      map(prop(1)),
      randomize,
      pair
    )(range(0, 12))
    /* eslint-disable */
    this.setState({ indexes })
    /* eslint-enable */
  }
  handleSubmit = values => {
    const errors = {}
    compose(
      forEach(word => {
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
      this.props.recoveryPhraseActions.setStep('CONFIRM_WORDS_SUCCESS')
    }
  }

  render() {
    const { ...rest } = this.props
    return (
      <ConfirmWordsForm
        {...rest}
        indexes={this.state.indexes}
        onSubmit={this.handleSubmit}
      />
    )
  }
}

export default ConfirmWords
