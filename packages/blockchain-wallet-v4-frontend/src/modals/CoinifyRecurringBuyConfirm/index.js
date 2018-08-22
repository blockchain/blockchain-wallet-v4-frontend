import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { getCanMakeRecurringTrade, getNumberOfTradesAway, getCoinifyStatus } from './selectors'
import Template from './template'

class CoinifyRecurringBuyConfirmContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.coinifyActions.showRecurringModal(false)
  }

  render () {
    return <Template {...this.props} />
  }
}

const mapStateToProps = state => ({
  numberOfTradesAway: getNumberOfTradesAway(state),
  canMakeRecurringTrade: getCanMakeRecurringTrade(state),
  status: getCoinifyStatus(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyRecurringBuyConfirm'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(CoinifyRecurringBuyConfirmContainer)
