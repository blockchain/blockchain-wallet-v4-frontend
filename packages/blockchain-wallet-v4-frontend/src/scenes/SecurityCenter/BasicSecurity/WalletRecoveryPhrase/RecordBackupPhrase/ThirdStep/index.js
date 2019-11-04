import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { forEach, keysIn, map, prop, range, sortBy, split, take } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { SubmissionError } from 'redux-form'
import React from 'react'
import ThirdStep from './template'

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
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(ThirdStepContainer)
