import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { SubmissionError } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { take, map, sortBy, prop, range, keysIn, forEach, split } from 'ramda'

import { actions, model } from 'data'
import ThirdStep from './template'

const { BACKUP_PHRASE_VERIFIED } = model.analytics.PREFERENCE_EVENTS.SECURITY
class ThirdStepContainer extends React.PureComponent {
  state = { indexes: [] }

  componentDidMount () {
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(
      take(4),
      map(prop(1)),
      randomize,
      pair
    )(range(0, 12))
    /* eslint-disable */
    this.setState({ indexes })
    /* eslint-enable */
  }

  onSubmit = (values, dispatch, props) => {
    const errors = {}
    compose(
      forEach(word => {
        if (values[word] !== props.recoveryPhrase[split('w', word)[1]]) {
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
      this.props.analyticsActions.logEvent(BACKUP_PHRASE_VERIFIED)
    }
  }

  render () {
    const { ...rest } = this.props
    return (
      <ThirdStep
        {...rest}
        indexes={this.state.indexes}
        onSubmit={this.onSubmit}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(ThirdStepContainer)
