import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class CoinTicker extends React.Component {
  componentWillMount () {
    const { coin, data } = this.props
    if (Remote.NotAskedIs(data)) {
      switch (coin) {
        case 'BTC':
          this.props.bitcoinActions.fetchRates()
          break
        case 'ETH':
          this.props.ethereumActions.fetchRates()
          break
        case 'BCH':
          this.props.bchActions.fetchRates()
          break
      }
    }
  }

  render () {
    const { coin, selected, data } = this.props

    return data.cata({
      Success: (value) => <Success coin={coin} selected={selected} {...this.props}>{value}</Success>,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin)
})

const mapDispatchToProps = dispatch => ({
  bitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  bchActions: bindActionCreators(actions.core.data.bch, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoinTicker)
