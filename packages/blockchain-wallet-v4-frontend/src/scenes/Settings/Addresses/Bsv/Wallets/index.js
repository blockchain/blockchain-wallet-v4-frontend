import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model } from 'data'
import { getData } from './selectors'
import Wallets from './template'
const { WALLET_TX_SEARCH } = model.form

class BsvWalletsContainer extends React.Component {
  state = { toSwap: false }

  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  componentWillUnmount () {
    if (!this.state.toSwap) this.props.bsvDataActions.resetData()
  }

  onUnarchiveWallet = index => {
    this.props.bsvActions.setAccountArchived(index, false)
  }

  onSendBsv = index => {
    this.props.modalActions.showModal(model.components.sendBsv.MODAL, { index })
  }

  onSwapBsv = index => {
    this.setState({ toSwap: true }, () => {
      this.props.routerActions.push({
        pathname: '/swap',
        state: {
          from: 'BSV',
          to: 'BTC',
          amount: '0',
          fix: model.rates.FIX_TYPES.BASE_IN_FIAT
        }
      })
    })
  }

  render () {
    const { data, search } = this.props

    return data.cata({
      Success: value => {
        return (
          <Wallets
            data={value}
            search={search && search.toLowerCase()}
            onUnarchiveWallet={this.onUnarchiveWallet}
            onSendBsv={this.onSendBsv}
            onSwapBsv={this.onSwapBsv}
          />
        )
      },
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector(WALLET_TX_SEARCH)(state, 'search')
})

const mapDispatchToProps = dispatch => ({
  bsvDataActions: bindActionCreators(actions.core.data.bsv, dispatch),
  bsvActions: bindActionCreators(actions.core.kvStore.bsv, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BsvWalletsContainer)
