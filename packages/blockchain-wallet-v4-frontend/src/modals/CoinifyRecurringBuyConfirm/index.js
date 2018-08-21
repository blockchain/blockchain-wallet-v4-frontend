import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal } from 'blockchain-info-components'

class CoinifyRecurringBuyConfirm extends React.PureComponent {
  render () {
    return (
      <div>
        confirm
      </div>
    )
  }
}

const mapStateToProps = state => ({
  account: undefined,
  subscriptions: selectors.core.data.coinify
    .getSubscriptions(state)
    .getOrElse([])
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyRecurringBuyConfirm'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(CoinifyRecurringBuyConfirm)
