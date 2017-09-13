import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import ui from 'redux-ui'
import { take, map, sortBy, prop, range } from 'ramda'
import { selectors } from 'data'
import ThirdStep from './template.js'

class ThirdStepContainer extends React.Component {
  componentWillMount () {
    const { updateUI } = this.props
    const randomize = sortBy(prop(0))
    const pair = map(x => [Math.random(), x])
    const indexes = compose(take(4), map(prop(1)), randomize, pair)(range(0, 12))

    updateUI({ indexes })
  }

  render () {
    const { ui, ...rest } = this.props

    return (
      <ThirdStep {...rest} indexes={ui.indexes}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  mnemonic: selectors.core.wallet.getMnemonic(state).split(' ')
})

const enhance = compose(
  ui({ key: 'RecoveryPhraseVerification', state: { indexes: [] } }),
  connect(mapStateToProps)
)

export default enhance(ThirdStepContainer)
