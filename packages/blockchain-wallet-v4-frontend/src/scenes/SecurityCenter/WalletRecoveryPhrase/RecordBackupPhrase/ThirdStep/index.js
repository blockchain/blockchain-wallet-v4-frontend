import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { SubmissionError } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import ui from 'redux-ui'
import { take, map, sortBy, prop, range, keysIn, forEach, split } from 'ramda'

import { actions } from 'data'
import ThirdStep from './template.js'

class ThirdStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    const { updateUI } = this.props
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(take(4), map(prop(1)), randomize, pair)(range(0, 12))
    updateUI({ indexes })
  }

  onSubmit (values, disptach, props) {
    const errors = {}
    compose(forEach(word => {
      if (values[word] !== props.recoveryPhrase[split('w', word)[1]]) {
        errors[word] = <FormattedMessage id='scenes.securitycenter.walletrecoveryphrase.thirdstep.incorrectword' defaultMessage='Incorrect Word' />
      }
    }), keysIn)(values)

    if (keysIn(errors).length) {
      this.setState({ hasError: true })
      throw new SubmissionError(errors)
    } else {
      this.props.walletActions.verifyMnemonic()
      this.props.goBackOnSuccess()
    }
  }

  render () {
    const { ui, ...rest } = this.props
    return (
      <ThirdStep {...rest} indexes={ui.indexes} onSubmit={this.onSubmit} hasError={this.state.hasError} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  ui({ key: 'RecoveryPhraseVerification', state: { indexes: [] } }),
  connect(undefined, mapDispatchToProps)
)

export default enhance(ThirdStepContainer)
