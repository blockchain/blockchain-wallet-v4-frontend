import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

class BtcBalance extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount () {
    this.props.actions.fetchData()
  }

  handleRefresh () {
    this.props.actions.fetchData()
  }

  render () {
    const { data, large } = this.props

    return data.cata({
      Success: value => <Success balance={value} large={large} />,
      Failure: message => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance large={large} coin='BTC' />,
      NotAsked: () => <LoadingBalance large={large} coin='BTC' />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BtcBalance)
