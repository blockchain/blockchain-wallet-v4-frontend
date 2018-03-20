import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData, getEthereumContext } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'

class ActivityListContainer extends React.Component {
  componentWillMount () {
    this.props.miscActions.fetchLogs()
    this.props.btcActions.fetchTransactions('', true)
    if (Remote.Success.is(this.props.ethContext)) {
      this.props.ethContext.map(x => this.props.ethActions.fetchData(x))
    }
    this.props.bchActions.fetchTransactions('', true)
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success activities={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, 8),
  ethContex: getEthereumContext(state)
})

const mapDispatchToProps = (dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch),
  btcActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  bchActions: bindActionCreators(actions.core.data.bch, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityListContainer)
