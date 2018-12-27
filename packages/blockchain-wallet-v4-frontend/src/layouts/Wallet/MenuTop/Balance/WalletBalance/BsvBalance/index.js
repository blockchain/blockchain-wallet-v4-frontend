import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

class BsvBalance extends React.PureComponent {
  componentWillMount () {
    this.props.actions.fetchData()
  }

  handleRefresh = () => {
    this.props.actions.fetchData()
  }

  render () {
    const { data, large } = this.props

    return data.cata({
      Success: value => <Success balance={value} large={large} />,
      Failure: () => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance large={large} coin='BSV' />,
      NotAsked: () => <LoadingBalance large={large} coin='BSV' />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.bsv, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BsvBalance)
