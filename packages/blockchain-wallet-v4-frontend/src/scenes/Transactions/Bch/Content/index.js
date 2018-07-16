import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Content from './template'

class ContentContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }

  render () {
    const { actions, empty, pages, search } = this.props
    return <Content empty={empty} search={search} pages={pages} actions={actions} />
  }
}

const mapStateToProps = state => ({
  ...getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.bchTransactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
