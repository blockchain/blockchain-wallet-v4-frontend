import React from 'react'
import { connect } from 'react-redux'
import { path, toLower } from 'ramda'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { actions } from 'data'
import { getData } from './selectors'
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
  const { coin } = ownProps
  const coinLower = toLower(coin)
  // TODO: better ERC20 support
  if (coin === 'PAX') {
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
  return {
    fetchData: () => dispatch(actions.core.data[coinLower].fetchData()),
    initTxs: () =>
      dispatch(actions.components[`${coinLower}Transactions`].initialized()),
    loadMoreTxs: () =>
      dispatch(actions.components[[`${coinLower}Transactions`]].loadMore()),
    setAddressArchived: address =>
      dispatch(actions.core.wallet.setAddressArchived(address, true))
  }
}

ContentContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
