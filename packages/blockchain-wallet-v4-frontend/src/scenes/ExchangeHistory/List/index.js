import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { concat } from 'ramda'

import { actions } from 'data'
import List from './template'

class ListContainer extends React.PureComponent {
  componentDidMount () {
    const tradesWithDeposit = concat(this.props.incomplete, this.props.complete)
    this.props.actions.initialized(tradesWithDeposit)
  }

  render () {
    const { complete, incomplete, error } = this.props
    const allIncomplete = concat(incomplete, error)

    return <List complete={complete} incomplete={allIncomplete} />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListContainer)
