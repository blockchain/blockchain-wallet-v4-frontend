import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import { LoadingBalance } from 'components/Balances'
import Error from './template.error'
import Success from './template.success'

class XlmLockboxBalance extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleRefresh () {
    this.props.actions.fetchData()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success balance={value} />,
      Failure: message => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance coin='XLM' />,
      NotAsked: () => <LoadingBalance coin='XLM' />
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
)(XlmLockboxBalance)
