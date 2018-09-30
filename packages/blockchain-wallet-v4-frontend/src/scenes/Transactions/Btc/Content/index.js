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

  handleArchive = address =>
    this.props.coreWalletActions.setAddressArchived(address, true)

  render () {
    const { empty, pages, currency, search, buysellPartner } = this.props

    return (
      <Content
        empty={empty}
        search={search}
        pages={pages}
        currency={currency}
        onRefresh={this.handleRefresh}
        buysellPartner={buysellPartner}
        onArchive={this.handleArchive}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...getData(state)
})

const mapDispatchToProps = dispatch => ({
  dataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  txActions: bindActionCreators(actions.components.btcTransactions, dispatch),
  coreWalletActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
