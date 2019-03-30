import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { includes, toLower } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const { ERC20_COIN_LIST } = model.coins
class FiatDisplayContainer extends React.PureComponent {
  componentDidMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      const { coin } = this.props
      switch (true) {
        case coin === 'BCH':
          return this.props.bchActions.fetchRates()
        case coin === 'BTC':
          return this.props.btcActions.fetchRates()
        case coin === 'BSV':
          return this.props.bsvActions.fetchRates()
        case coin === 'ETH':
          return this.props.ethActions.fetchRates()
        case coin === 'XLM':
          return this.props.xlmActions.fetchRates()
        case includes(coin, ERC20_COIN_LIST):
          return this.props.ethActions.fetchErc20Rates(toLower(this.props.coin))
        default:
          return Remote.Failure('Unsupported Coin Code')
      }
    }
  }

  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => <Success {...rest}>{value}</Success>,
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

FiatDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin, ownProps.children)
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  bsvActions: bindActionCreators(actions.core.data.bsv, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiatDisplayContainer)
