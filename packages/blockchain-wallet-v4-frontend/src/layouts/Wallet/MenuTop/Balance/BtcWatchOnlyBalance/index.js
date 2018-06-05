import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class BtcWatchOnlyBalance extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentWillMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      this.props.actions.fetchUnspendableBalance(this.props.context)
    }
  }

  handleRefresh () {
    this.props.actions.fetchUnspendableBalance(this.props.context)
  }

  render () {
    const { data, large } = this.props

    return data.cata({
      Success: (value) => <Success balance={value} large={large} />,
      Failure: (message) => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

BtcWatchOnlyBalance.propTypes = {
  context: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BtcWatchOnlyBalance)
