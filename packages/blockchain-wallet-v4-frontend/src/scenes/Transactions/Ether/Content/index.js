import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ContentContainer extends React.Component {
  componentWillMount () {
    this.props.dataEthereumActions.fetchData()
    // this.props.kvStoreEthereumActions.fetchMetadataEthereum()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success isEmpty={equals(value.total, 0)} transactions={value.transactions} />, // !isEmpty(this.props.txs) ? <List transactions={txlist} /> : <Empty />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
  // scroll: selectors.scroll.selectScroll(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  kvStoreEthereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
