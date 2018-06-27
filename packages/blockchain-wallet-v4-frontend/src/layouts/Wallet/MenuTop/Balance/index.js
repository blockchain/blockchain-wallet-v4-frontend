import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Template from './template'
import Failure from './template.failure'
import { getWatchOnlyBalances } from './selectors'

class Balance extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleRefresh () {
    this.props.ethActions.fetchData()
    this.props.btcActions.fetchData()
    this.props.bchActions.fetchData()
  }

  render () {
    return this.props.data.cata({
      Success: (val) => <Template val={val} path={this.props.path} />,
      Loading: () => <Template path={this.props.path} />,
      Failure: () => <Failure onRefresh={this.handleRefresh} />,
      NotAsked: () => <Template path={this.props.path} />
    })
  }
}

const mapStateToProps = state => ({
  path: selectors.router.getPathname(state),
  data: getWatchOnlyBalances(state)
})

const mapDispatchToProps = (dispatch) => ({
  ethActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  btcActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  bchActions: bindActionCreators(actions.core.data.bch, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
