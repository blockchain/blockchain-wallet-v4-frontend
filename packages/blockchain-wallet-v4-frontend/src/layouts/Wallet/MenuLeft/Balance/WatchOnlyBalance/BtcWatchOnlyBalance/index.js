import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import { LoadingBalance } from 'components/Balances'
import Error from './template.error'
import Success from './template.success'

class BtcWatchOnlyBalance extends React.PureComponent {
  handleRefresh = () => {
    this.props.actions.fetchData()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success balance={value} />,
      Failure: () => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance coin='BTC' />,
      NotAsked: () => <LoadingBalance coin='BTC' />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.btc, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BtcWatchOnlyBalance)
