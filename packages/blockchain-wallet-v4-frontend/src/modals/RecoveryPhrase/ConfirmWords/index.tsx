import { compose } from 'redux'
import { forEach, keysIn, map, prop, range, sortBy, split, take } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm, SubmissionError } from 'redux-form'
import {
  LinkDispatchPropsType,
  LinkStatePropsType,
  OwnPropsType
} from '../index'
import ConfirmWordsForm from './template'
import React, { PureComponent } from 'react'

export type Props = OwnPropsType & LinkDispatchPropsType & LinkStatePropsType

class ConfirmWords extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = { indexes: [] }

  componentDidMount () {
    // @ts-ignore
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(
      take(6),
      // @ts-ignore
      map(prop(1)),
      randomize,
      pair
    )(range(0, 12))
    /* eslint-disable */
    this.setState({ indexes })
    /* eslint-enable */
  }
  onSubmit = (values, props) => {
    const errors = {}
    compose(
      forEach(word => {
        // @ts-ignore
        if (values[word] !== props.recoveryPhrase[split('w', word)[1]]) {
          // @ts-ignore
          errors[word] = (
            <FormattedMessage
              id='scenes.securitycenter.walletrecoveryphrase.thirdstep.incorrectword'
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
      this.props.handleClose()
    }
  }

  render () {
    const { handleBackArrow, invalid, onSubmit, submitting } = this.props
    return (
      <ConfirmWordsForm
        handleBackArrow={handleBackArrow}
        indexes={this.state.indexes}
        invalid={invalid}
        onSubmit={onSubmit}
        submitting={submitting}
      />
    )
  }
}

export default reduxForm<{}, Props>({ form: 'confirmRecoveryWords' })(
  ConfirmWords
)
