import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { getDataBtc, getDataBch, getDataEth } from './selectors'
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
    const { empty, pages, coin, currency, search, buySellPartner } = this.props

    return (
      <Content
        empty={empty}
        search={search}
        pages={pages}
        currency={currency}
        coin={coin}
        onRefresh={this.handleRefresh}
        onArchive={this.handleArchive}
        buySellPartner={buySellPartner}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  switch (ownProps.coin) {
    case 'BTC':
      return { ...getDataBtc(state) }
    case 'BCH':
      return { ...getDataBch(state) }
    case 'ETH':
      return { ...getDataEth(state) }
    default:
      return {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  switch (ownProps.coin) {
    case 'BTC':
      return {
        dataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
        txActions: bindActionCreators(
          actions.components.btcTransactions,
          dispatch
        ),
        coreWalletActions: bindActionCreators(actions.core.wallet, dispatch)
      }
    case 'BCH':
      return {
        dataActions: bindActionCreators(actions.core.data.bch, dispatch),
        txActions: bindActionCreators(
          actions.components.bchTransactions,
          dispatch
        )
      }
    case 'ETH':
      return {
        dataActions: bindActionCreators(actions.core.data.ethereum, dispatch),
        txActions: bindActionCreators(
          actions.components.ethTransactions,
          dispatch
        )
      }
    default:
      return {}
  }
}

ContentContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH'])
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
