import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Content from './template'

class ContentContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount () {
    this.props.txActions.initialized()
  }

  handleRefresh () {
    this.props.dataActions.fetchData()
    this.props.txActions.initialized()
  }

  render () {
    const { empty, pages, search } = this.props
    return <Content empty={empty} search={search} pages={pages} onRefresh={this.handleRefresh} />
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  txActions: bindActionCreators(actions.components.ethTransactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
