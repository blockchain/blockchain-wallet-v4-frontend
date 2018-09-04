import React from 'react'
import { actions, model } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import Loading from 'components/BuySell/Loading'
import Failure from 'components/BuySell/Failure'

const { CHECKOUT_BUY_FORM } = model.coinify
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
    if (this.props.step !== 'checkout') {
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
      buyQuoteR,
      canTrade,
      coinifyActions,
      coinifyDataActions,
      currency,
      data,
      formActions,
      level,
      modalActions,
      paymentMedium,
      subscription,
      subscriptionData,
      trade,
      ...rest
    } = this.props
    const { step, checkoutBusy, coinifyBusy, subscriptions, trades, showRecurringModal, countryCode, showRecurringBuy } = rest
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
          busy={busy}
          buyQuoteR={buyQuoteR}
          canTrade={canTrade}
          checkoutBusy={checkoutBusy}
          clearTradeError={coinifyNotAsked}
          countryCode={countryCode}
          currency={currency}
          initiateBuy={this.startBuy}
          paymentMedium={paymentMedium}
          refreshQuote={refreshBuyQuote}
          step={step}
          subscriptions={subscriptions}
          showModal={showModal}
          showRecurringBuy={showRecurringBuy}
          showRecurringModal={showRecurringModal}
          subscription={subscription}
          subscriptionData={subscriptionData}
          trade={trade}
          trades={trades}
          value={value}
          handleKycAction={kyc =>
            openKYC(kyc)
          }
          coinifyNextCheckoutStep={step =>
            coinifyNextCheckoutStep(step)
          }
          fetchBuyQuote={quote =>
            fetchQuote({ quote, nextAddress: value.nextAddress })
          }
          setMax={amt =>
            formActions.change(CHECKOUT_BUY_FORM, 'leftVal', amt)
          }
          setMin={amt =>
            formActions.change(CHECKOUT_BUY_FORM, 'leftVal', amt)
          }
          changeTab={tab =>
            change('buySellTabStatus', 'status', tab)
          }
          openRecurringConfirmModal={() =>
            showRecurringModal
              ? showModal('CoinifyRecurringBuyConfirm')
              : null
          }
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
