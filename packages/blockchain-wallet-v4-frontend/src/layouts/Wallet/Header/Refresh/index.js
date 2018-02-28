import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Success from './template'

class RefreshContainer extends React.Component {
  render () {
    const { data, btcActions } = this.props

    return data.cata({
      Success: (value) => <Success handleRefresh={() => btcActions.fetchData(value.bitcoinContext)} />,
      Failure: (message) => <div>{message}</div>,
      NotAsked: () => <Success />,
      Loading: () => <Success />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  btcActions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RefreshContainer)
