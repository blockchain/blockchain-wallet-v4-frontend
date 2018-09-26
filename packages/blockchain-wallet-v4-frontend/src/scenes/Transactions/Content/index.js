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
    const { empty, pages, coin, currency, search, buySellPartner } = this.props

    return (
      <Content
        empty={empty}
        search={search}
        pages={pages}
        currency={currency}
        coin={coin}
        onRefresh={this.handleRefresh}
        buySellPartner={buySellPartner}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...getData(state)
})

const mapDispatchToProps = dispatch => ({
  dataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  txActions: bindActionCreators(actions.components.btcTransactions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
