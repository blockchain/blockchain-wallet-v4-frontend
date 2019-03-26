import React from 'react'
import { connect } from 'react-redux'
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
    this.props.initTxs()
  }

  componentDidUpdate (prevProps) {
    if (
      path(['location', 'pathname'], prevProps) !==
      path(['location', 'pathname'], this.props)
    ) {
      this.props.initTxs()
    }
  }

  handleLoadMore = () => {
    this.props.loadMoreTxs()
  }

  handleRefresh = () => {
    this.props.fetchData()
    this.props.initTxs()
  }

  handleArchive = address => this.props.setAddressArchived(address)

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
        fetchData: () => dispatch(actions.core.data.btc.fetchData()),
        initTxs: () =>
          dispatch(actions.components.btcTransactions.initialized()),
        loadMoreTxs: () =>
          dispatch(actions.components.btcTransactions.loadMore()),
        setAddressArchived: address =>
          dispatch(actions.core.wallet.setAddressArchived(address, true))
      }
    case 'BCH':
      return {
        fetchData: () => dispatch(actions.core.data.bch.fetchData()),
        initTxs: () =>
          dispatch(actions.components.bchTransactions.initialized()),
        loadMoreTxs: () =>
          dispatch(actions.components.bchTransactions.loadMore())
      }
    case 'BSV':
      return {
        fetchData: () => dispatch(actions.core.data.bsv.fetchData()),
        initTxs: () =>
          dispatch(actions.components.bsvTransactions.initialized()),
        loadMoreTxs: () =>
          dispatch(actions.components.bsvTransactions.loadMore())
      }
    case 'ETH':
      return {
        fetchData: () => dispatch(actions.core.data.eth.fetchData()),
        initTxs: () =>
          dispatch(actions.components.ethTransactions.initialized()),
        loadMoreTxs: () =>
          dispatch(actions.components.ethTransactions.loadMore())
      }
    case 'XLM':
      return {
        fetchData: () => dispatch(actions.core.data.xlm.fetchData()),
        initTxs: () =>
          dispatch(actions.components.xlmTransactions.initialized()),
        loadMoreTxs: () =>
          dispatch(actions.components.xlmTransactions.loadMore())
      }
    default:
      // ERC20
      return {
        fetchData: () =>
          dispatch(actions.core.data.eth.fetchErc20Data(ownProps.coin)),
        initTxs: () =>
          dispatch(
            actions.components.ethTransactions.initializedErc20(ownProps.coin)
          ),
        loadMoreTxs: () =>
          dispatch(
            actions.components.ethTransactions.loadMoreErc20(ownProps.coin)
          )
      }
  }
}

ContentContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
