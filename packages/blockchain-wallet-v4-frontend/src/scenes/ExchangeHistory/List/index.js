import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import List from './template'
import React from 'react'

class ListContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }

  render () {
    const {
      coinModels,
      complete,
      incomplete,
      showComplete,
      showIncomplete,
      loadingNextPage,
      onScrollPastFinish
    } = this.props

    return (
      <List
        coinModels={coinModels}
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

export default connect(undefined, mapDispatchToProps)(ListContainer)
