import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { SubmissionError } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { take, map, sortBy, prop, range, keysIn, forEach, split } from 'ramda'

import { actions } from 'data'
import ThirdStep from './template.js'

class ThirdStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      indexes: []
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    const { updateUI } = this.props
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(
      take(4),
      map(prop(1)),
      randomize,
      pair
    )(range(0, 12))
    this.setState({ indexes })
  }

  onSubmit (values, disptach, props) {
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
      this.setState({ hasError: true })
      throw new SubmissionError(errors)
    } else {
      this.props.walletActions.verifyMnemonic()
      this.props.goBackOnSuccess()
    }
  }

  render () {
    const { ...rest } = this.props
    return (
      <ThirdStep
        {...rest}
        indexes={this.state.indexes}
        onSubmit={this.onSubmit}
        hasError={this.state.hasError}
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
