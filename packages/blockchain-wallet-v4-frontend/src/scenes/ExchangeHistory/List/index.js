import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { concat } from 'ramda'

import { actions } from 'data'
import List from './template'

class ListContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized(concat(this.props.incomplete, this.props.complete))
  }

  render () {
    const { complete, incomplete } = this.props

    return <List complete={complete} incomplete={incomplete} />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListContainer)
