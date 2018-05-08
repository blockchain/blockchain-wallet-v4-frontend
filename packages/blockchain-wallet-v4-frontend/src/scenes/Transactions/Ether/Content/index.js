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
    const { empty, list, search } = this.props
    return <Content empty={empty} search={search} list={list} />
  }
}

const mapStateToProps = state => ({
  ...getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.btcTransactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
