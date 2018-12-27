import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { path } from 'ramda'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getData } from './selectors'
import { actions } from 'data'
import Content from './template'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`
const ContentWrapper = styled.div`
  height: 100%;
`

class ContentContainer extends React.PureComponent {
  componentDidMount () {
    this.props.txActions.initialized()
  }

  componentDidUpdate (prevProps) {
    if (
      path(['location', 'pathname'], prevProps) !==
      path(['location', 'pathname'], this.props)
    ) {
      this.props.txActions.initialized()
    }
  }

  handleLoadMore = () => {
    this.props.txActions.loadMore()
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
      <Wrapper>
        <ContentWrapper>
          <Content
            coin={coin}
            empty={empty}
            pages={pages}
            search={search}
            currency={currency}
            onRefresh={this.handleRefresh}
            onArchive={this.handleArchive}
            onLoadMore={this.handleLoadMore}
            buySellPartner={buySellPartner}
          />
        </ContentWrapper>
      </Wrapper>
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
    case 'BSV':
      return {
        dataActions: bindActionCreators(actions.core.data.bsv, dispatch),
        txActions: bindActionCreators(
          actions.components.bsvTransactions,
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
    case 'XLM':
      return {
        dataActions: bindActionCreators(actions.core.data.xlm, dispatch),
        txActions: bindActionCreators(
          actions.components.xlmTransactions,
          dispatch
        )
      }
    default:
      return {}
  }
}

ContentContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'BSV', 'ETH', 'XLM']).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
