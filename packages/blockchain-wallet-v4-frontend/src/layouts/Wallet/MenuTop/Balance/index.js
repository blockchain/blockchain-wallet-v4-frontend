import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { path } from 'ramda'
import { actions } from 'data'
import { getData } from './selectors'
import { RemoteData } from 'blockchain-wallet-v4/src'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class Balance extends React.Component {
  constructor (props) {
    super(props)
    this.handleCoinDisplay = this.handleCoinDisplay.bind(this)
  }

  componentWillMount () {
    this.props.actions.fetchMetadataEthereum()
    // yield call(sagas.core.kvStore.ethereum.fetchEthereum)
    // const bitcoinContext = yield select(selectors.core.wallet.getWalletContext)
    // const etherContext = yield select(selectors.core.kvStore.ethereum.getContext)
    // yield all([
    //   call(sagas.core.common.bitcoin.fetchBlockchainData, { context: bitcoinContext }),
    //   call(sagas.core.common.ethereum.fetchEthereumData, { context: etherContext })
    // ])
  }

  handleCoinDisplay () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  render () {
    const { data } = this.props
    console.log('Balance render', data)

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success etherContext={value} handleCoinDisplay={this.handleCoinDisplay} />,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
