import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success.js'
import Loading from '../../../template.loading.js'

class OrderHistoryContainer extends React.Component {
  componentDidMount () {
    this.props.coinifyDataActions.fetchTrades()
  }

  startBuy () {
    const { buyQuoteR, paymentMedium, coinifyActions } = this.props
    coinifyActions.coinifyLoading()
    buyQuoteR.map(q => this.props.coinifyActions.initiateBuy({ quote: q, medium: paymentMedium }))
  }

  render () {
    const { data, modalActions, coinifyActions, step, trade } = this.props
    const { showModal } = modalActions
    const { finishTrade } = coinifyActions
    return data.cata({
      Success: (value) => <Success
        trades={value}
        showModal={showModal}
        finishTrade={finishTrade}
        trade={trade}
        step={step}
      />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryContainer)
