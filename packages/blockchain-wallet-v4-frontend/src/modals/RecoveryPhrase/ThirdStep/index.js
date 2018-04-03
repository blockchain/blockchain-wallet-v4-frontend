import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { take, map, sortBy, prop, range } from 'ramda'
import { actions } from 'data'
import ThirdStep from './template.js'

class ThirdStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    const { updateUI } = this.props
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(take(4), map(prop(1)), randomize, pair)(range(0, 12))
    updateUI({ indexes })
  }

  onSubmit () {
    this.props.walletActions.verifyMnemonic()
  }

  render () {
    const { ui, ...rest } = this.props

    return (
      <ThirdStep {...rest} indexes={ui.indexes} onSubmit={this.onSubmit} />
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
