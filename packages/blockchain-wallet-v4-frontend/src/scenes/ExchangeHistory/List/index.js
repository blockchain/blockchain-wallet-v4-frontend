import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import List from './template'

class ListContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }

  render () {
    const {
      complete,
      incomplete,
      showComplete,
      showIncomplete,
      loadingNextPage,
      onScrollPastFinish
    } = this.props

    return (
      <List
        complete={complete}
        incomplete={incomplete}
        showComplete={showComplete}
        showIncomplete={showIncomplete}
        loadingNextPage={loadingNextPage}
        handleScrollPastFinish={onScrollPastFinish}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchangeHistory, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(ListContainer)
