import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getCurrency, getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'

class FiatAtTime extends React.Component {
  componentWillMount () {
    console.log('COMPONENT WILL MOUNT')
    const { currency, amount, time, hash } = this.props
    if (Remote.NotAsked.is(this.props.data)) {
      switch (this.props.coin) {
        case 'BTC': return this.props.btcActions.fetchFiatAtTime(hash, amount, time * 1000, currency)
        case 'ETH': return this.props.ethActions.fetchFiatAtTime(hash, amount, time * 1000, currency)
        case 'BCH': return this.props.bchActions.fetchFiatAtTime(hash, amount, time * 1000, currency)
      }
    }
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success currency={value.currency} fiatAtTime={value.fiatAtTime} type={this.props.type}/>,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading type={this.props.type}/>,
      NotAsked: () => <Loading type={this.props.type}/>
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  currency: getCurrency(state),
  data: getData(state, ownProps.hash, ownProps.coin)
})

const mapDispatchToProps = (dispatch) => ({
  btcActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  bchActions: bindActionCreators(actions.core.data.bch, dispatch)
})

FiatAtTime.propTypes = {
  amount: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FiatAtTime)
