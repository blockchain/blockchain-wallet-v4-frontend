import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { KYC_MODAL } from 'data/components/identityVerification/model'
import Failure from 'components/BuySell/Failure'
import Loading from 'components/BuySell/Loading'
import React from 'react'
import Success from './template.success'

class CoinifyBuyContainer extends React.PureComponent {
  componentDidMount () {
    this.props.coinifyActions.initializeCheckoutForm('buy')
    this.props.coinifyActions.fetchCoinifyData()
    this.props.coinifyActions.compareCoinifyKyc()
    if (this.props.step === 'isx') {
      this.props.coinifyActions.coinifyNextCheckoutStep('checkout')
    }
  }

  startBuy = () => {
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
      formActions,
      coinifyBusy,
      ...rest
    } = this.props
    const { fetchQuote, refreshBuyQuote } = coinifyDataActions
    const { showModal } = modalActions
    const { coinifyNotAsked, coinifyNextCheckoutStep } = coinifyActions
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
          clearTradeError={coinifyNotAsked}
          changeTab={tab => change('buySellTabStatus', 'status', tab)}
          coinifyNextCheckoutStep={step => coinifyNextCheckoutStep(step)}
          fetchBuyQuote={quote =>
            fetchQuote({ quote, nextAddress: value.nextAddress })
          }
          handleKycAction={() => showModal(KYC_MODAL, { isCoinify: true })}
          initiateBuy={this.startBuy}
          refreshQuote={refreshBuyQuote}
          setMax={amt =>
            formActions.change('coinifyCheckoutBuy', 'leftVal', amt)
          }
          setMin={amt =>
            formActions.change('coinifyCheckoutBuy', 'leftVal', amt)
          }
          showModal={showModal}
          value={value}
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
)(CoinifyBuyContainer)
