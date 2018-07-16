import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { concat } from 'ramda'

import { actions } from 'data'
import List from './template'

class ListContainer extends React.PureComponent {
  componentDidMount () {
    const { complete, incomplete } = this.props
    const tradesWithDeposit = concat(incomplete, complete)
    this.props.actions.initialized(tradesWithDeposit)
  }

  render () {
    const { complete, incomplete, showComplete, showIncomplete } = this.props

    return <List
      complete={complete}
      incomplete={incomplete}
      showComplete={showComplete}
      showIncomplete={showIncomplete}
    />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListContainer)
