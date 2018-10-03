import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import { actions } from 'data'
import Content from './template'

class ContentContainer extends React.PureComponent {
  componentDidMount () {
    this.props.txActions.initialized()
  }

  handleRefresh = () => {
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

const mapStateToProps = (state, ownProps) => getData(state, ownProps.coin)

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
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH']).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
