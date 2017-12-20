import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RemoteData } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EthereumTicker extends React.Component {
  render () {
    const { coin, data } = this.props
    console.log(this.props)
    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success selected={coin === 'ETH'} {...this.props}>{value}</Success>,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
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
