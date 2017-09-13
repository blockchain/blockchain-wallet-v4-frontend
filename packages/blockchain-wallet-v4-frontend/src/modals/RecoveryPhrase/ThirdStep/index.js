import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { take, map, sortBy, prop, range } from 'ramda'
import { actions, selectors } from 'data'
import ThirdStep from './template.js'

class ThirdStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleFinish = this.handleFinish.bind(this)
  }

  handleFinish () {
    this.props.walletActions.verifyMnemonic()
    this.props.modalActions.closeModal()
    this.props.alertActions.displaySuccess('Your mnemonic has been verified !')
  }

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
      <ThirdStep {...rest} indexes={ui.indexes} handleFinish={this.handleFinish} />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  mnemonic: selectors.core.wallet.getMnemonic(state).split(' ')
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  walletActions: bindActionCreators(actions.core.wallet, dispatch)
})

const enhance = compose(
  ui({ key: 'RecoveryPhraseVerification', state: { indexes: [] } }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ThirdStepContainer)
