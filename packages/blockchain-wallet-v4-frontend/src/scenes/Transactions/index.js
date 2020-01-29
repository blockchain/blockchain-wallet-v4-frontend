import { connect } from 'react-redux'
import { path, toLower } from 'ramda'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { Icon, Text } from 'blockchain-info-components'
import EmptyTx from 'components/EmptyTx'
import LazyLoadContainer from 'components/LazyLoadContainer'

import { getData } from './selectors'
import CoinIntroduction from './CoinIntroduction'
import Header from './Header'
import TransactionList from './TransactionList'

const Wrapper = styled(LazyLoadContainer)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 15px 30px;
`
const PageTitle = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;

  > :first-child {
    margin-right: 14px;
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 150px;
  margin: 24px 0;
`
const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 33%;
  padding: 12px;
  border: 1px solid ${props => props.theme.grey100};
  border-radius: 8px;
`
const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 66%;
  margin-left: 35px;
  padding: 12px;
  border: 1px solid ${props => props.theme.grey100};
  border-radius: 8px;
`

class TransactionsContainer extends React.PureComponent {
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
    const {
      buySellPartner,
      coin,
      coinModel,
      currency,
      empty,
      pages,
      search
    } = this.props
    const { colorCode, displayName, icons } = coinModel

    return (
      <Wrapper onLazyLoad={this.handleLoadMore}>
        {empty ? (
          search ? (
            <EmptyTx />
          ) : (
            <CoinIntroduction coin={coin} />
          )
        ) : (
          <>
            <PageTitle>
              <Icon size='36px' color={colorCode} name={icons.circleFilled} />
              <Text color='grey800' size='32px' weight={600}>
                {displayName}
              </Text>
            </PageTitle>
            <StatsContainer>
              <BalanceContainer>
                <Text color='grey400' weight={500} size='16px'>
                  Bitcoin Wallet Balance
                </Text>
              </BalanceContainer>
              <ChartContainer>
                <Text color='grey400' weight={500} size='16px'>
                  Current Price
                </Text>
              </ChartContainer>
            </StatsContainer>
            <Header coin={coin} />
            {pages.map((value, index) => (
              <TransactionList
                buySellPartner={buySellPartner}
                coin={coin}
                currency={currency}
                data={value}
                key={index}
                onArchive={this.handleArchive}
                onLoadMore={this.handleLoadMore}
                onRefresh={this.handleRefresh}
              />
            ))}
          </>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) =>
  getData(state, ownProps.coin, ownProps.isCoinErc20)

const mapDispatchToProps = (dispatch, ownProps) => {
  const { coin, isCoinErc20 } = ownProps
  if (isCoinErc20) {
    return {
      fetchData: () => dispatch(actions.core.data.eth.fetchErc20Data(coin)),
      initTxs: () =>
        dispatch(actions.components.ethTransactions.initializedErc20(coin)),
      loadMoreTxs: () =>
        dispatch(actions.components.ethTransactions.loadMoreErc20(coin))
    }
  }
  return {
    fetchData: () => dispatch(actions.core.data[toLower(coin)].fetchData()),
    initTxs: () =>
      dispatch(
        actions.components[`${toLower(coin)}Transactions`].initialized()
      ),
    loadMoreTxs: () =>
      dispatch(actions.components[[`${toLower(coin)}Transactions`]].loadMore()),
    setAddressArchived: address =>
      dispatch(actions.core.wallet.setAddressArchived(address, true))
  }
}

TransactionsContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsContainer)
