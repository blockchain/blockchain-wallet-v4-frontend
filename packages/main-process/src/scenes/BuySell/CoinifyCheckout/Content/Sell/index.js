import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import Loading from 'components/BuySell/Loading'
import Failure from 'components/BuySell/Failure'
import { KYC_MODAL } from 'data/components/identityVerification/model'

class SellContainer extends React.Component {
  componentDidMount () {
    this.props.coinifyDataActions.getKyc()
    this.props.coinifyActions.initializePayment()
    this.props.coinifyActions.initializeCheckoutForm('sell')
  }

  submitQuote = () => {
    const { sellQuoteR } = this.props
    sellQuoteR.map(quote =>
      this.props.coinifyDataActions.getMediumsWithBankAccounts(quote)
    )
    this.props.coinifyActions.setMedium('blockchain')
  }

  startSell = () => {
    const { coinifyActions } = this.props
    coinifyActions.initiateSell()
  }

  render () {
    const {
      coinifyBusy,
      data,
      modalActions,
      coinifyActions,
      coinifyDataActions,
      formActions,
      ...rest
    } = this.props
    const { fetchQuote, refreshSellQuote } = coinifyDataActions
    const { showModal } = modalActions
    const { coinifyNotAsked } = coinifyActions
    const { change } = formActions

    const busy = coinifyBusy.cata({
      Success: () => false,
      Failure: err => err,
      Loading: () => true,
      NotAsked: () => false
    })

    return data.cata({
      Success: value => (
        <Success
          value={value}
          busy={busy}
          changeTab={tab => change('buySellTabStatus', 'status', tab)}
          showModal={showModal}
          fetchSellQuote={quote =>
            fetchQuote({ quote, nextAddress: value.nextAddress })
          }
          setMax={btcAmt => change('coinifyCheckoutSell', 'rightVal', btcAmt)}
          setMin={btcAmt => change('coinifyCheckoutSell', 'rightVal', btcAmt)}
          initiateSell={this.startSell}
          clearTradeError={() => coinifyNotAsked()}
          onOrderCheckoutSubmit={this.submitQuote}
          handleKycAction={() => showModal(KYC_MODAL, { isCoinify: true })}
          refreshQuote={refreshSellQuote}
          {...rest}
        />
      ),
      Failure: e => <Failure error={e} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(SellContainer)
