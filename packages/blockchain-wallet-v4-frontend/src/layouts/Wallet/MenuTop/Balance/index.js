import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getContext, getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class Balance extends React.Component {
  componentWillMount () {
    // this.props.actions.fetchMetadataEthereum()

    const { context, data } = this.props
    if (Remote.Success.is(context) && Remote.NotAsked.is(data)) {
      context.map(x => this.props.ethereumActions.fetchData(x))
    }
    if (Remote.NotAsked.is(this.props.data)) {
      this.props.bitcoinActions.fetchData()
      this.props.bitcoinActions.fetchRates()
      this.props.ethereumActions.fetchRates()
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   if (!equals(this.props.context, nextProps.context)) {
  //     nextProps.context.map(x => this.props.ethereumActions.fetchData(x))
  //   }
  // }

  render () {
    const { data } = this.props
    return data.cata({
      Success: (value) => <Success balances={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  context: getContext(state)
})

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  bitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
