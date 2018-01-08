import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EthereumTicker extends React.Component {
  componentWillMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      this.props.actions.fetchRates()
    }
  }

  render () {
    const { coin, data } = this.props

    return data.cata({
      Success: (value) => <Success selected={coin === 'ETH'} {...this.props}>{value}</Success>,
      Failed: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.ethereum, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EthereumTicker)
