import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import Loading from 'components/BuySell/Loading'
import Failure from 'components/BuySell/Failure'

class CoinifyBuyContainer extends React.Component {
  constructor (props) {
    super(props)

    this.startBuy = this.startBuy.bind(this)
  }

  componentDidMount () {
    this.props.coinifyActions.initializeCheckoutForm('buy')
    this.props.coinifyDataActions.fetchTrades()
    this.props.coinifyDataActions.getKyc()
    this.props.coinifyDataActions.fetchSubscriptions()
    if (this.props.step === 'isx') {
      this.props.coinifyActions.coinifyNextCheckoutStep('checkout')
    }
  }

  startBuy () {
    const { buyQuoteR, paymentMedium, coinifyActions } = this.props
    coinifyActions.coinifyLoading()
    buyQuoteR.map(q =>
      this.props.coinifyActions.initiateBuy({ quote: q, medium: paymentMedium })
    )
  }

  render () {
    const {
      data,
      modalActions,
      coinifyActions,
      coinifyDataActions,
      buyQuoteR,
      currency,
      paymentMedium,
      trade,
      formActions,
      canTrade,
      ...rest
    } = this.props
    const { step, checkoutBusy, coinifyBusy, subscriptions, trades } = rest
    const { fetchQuote, refreshBuyQuote } = coinifyDataActions
    const { showModal } = modalActions
    const { coinifyNotAsked, openKYC, coinifyNextCheckoutStep } = coinifyActions
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
          showModal={showModal}
          buyQuoteR={buyQuoteR}
          fetchBuyQuote={quote =>
            fetchQuote({ quote, nextAddress: value.nextAddress })
          }
          refreshQuote={refreshBuyQuote}
          currency={currency}
          checkoutBusy={checkoutBusy}
          setMax={amt =>
            formActions.change('coinifyCheckoutBuy', 'leftVal', amt)
          }
          setMin={amt =>
            formActions.change('coinifyCheckoutBuy', 'leftVal', amt)
          }
          paymentMedium={paymentMedium}
          initiateBuy={this.startBuy}
          step={step}
          busy={busy}
          clearTradeError={() => coinifyNotAsked()}
          trade={trade}
          handleKycAction={kyc => openKYC(kyc)}
          changeTab={tab => change('buySellTabStatus', 'status', tab)}
          coinifyNextCheckoutStep={step => coinifyNextCheckoutStep(step)}
          canTrade={canTrade}
          subscriptions={subscriptions}
          trades={trades}
        />
      ),
      Failure: e => <Failure error={e} />,
      Loading: () => <Loading />,
      NotAsked: () => <div>Not Asked</div>
    })
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinifyBuyContainer)
