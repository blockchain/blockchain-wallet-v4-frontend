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

class ContentContainer extends React.PureComponent {
  componentWillMount () {
    const { context, data } = this.props
    if (Remote.Success.is(context) && Remote.NotAsked.is(data)) {
      context.map(x => this.props.dataEthereumActions.fetchData(x))
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.context, nextProps.context)) {
      nextProps.context.map(x => this.props.dataEthereumActions.fetchData(x))
    }
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success isEmpty={equals(value.total, 0)} transactions={value.transactions} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  context: getContext(state)
  // scroll: selectors.scroll.selectScroll(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  kvStoreEthereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
