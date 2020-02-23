import { actions, model } from 'data'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import { path, toLower } from 'ramda'
import { reduxForm } from 'redux-form'
import { SceneWrapper } from 'components/Layout'
import CoinIntroduction from './CoinIntroduction'
import CoinPerformance from './CoinPerformance'
import EmptyTx from 'components/EmptyTx'
import LazyLoadContainer from 'components/LazyLoadContainer'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'
import WalletBalanceDropdown from './WalletBalanceDropdown'

const PageTitle = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;

  > :first-child {
    margin-right: 14px;
  }
`
const Header = styled.div`
  width: 100%;
`
const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 120px;
  max-height: 120px;
  margin: 24px 0;

  & > :first-child {
    width: 320px;
    min-width: 320px;
    z-index: 2;
    margin-right: 30px;
  }

  ${media.laptop`
    height: auto;
    max-height: initial;
    flex-direction: column;
    margin: 12px 0;

    & > :first-child {
      width: auto;
      margin-right: 0px;
    }

    & > :last-child {
      margin-top: 12px;
    }
  `}
`

type OwnProps = {
  buySellPartner: 'coinify' | 'sfox'
  // FIXME: TypeScript use CoinType
  coin: 'BTC' | 'BCH' | 'ETH' | 'PAX' | 'XLM'
  // FIXME: TypeScript use SupportedCoinType
  coinModel: any
  // FIXME: TypeScript use CurrencyType
  currency: any
  empty: boolean
  pages: Array<any>
  search: string
}

type LinkStatePropsType = {
  data: any
}

type LinkDispatchPropsType = {
  fetchData: () => void
  initTxs: () => void
  loadMoreTxs: () => void
  setAddressArchived: (string) => void
}

type Props = OwnProps & LinkStatePropsType & LinkDispatchPropsType

class TransactionsContainer extends React.PureComponent<Props> {
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
      <SceneWrapper>
        <LazyLoadContainer onLazyLoad={this.handleLoadMore}>
          <Header>
            <PageTitle>
              <Icon size='36px' color={colorCode} name={icons.circleFilled} />
              <Text color='grey800' size='32px' weight={600}>
                {displayName}
              </Text>
            </PageTitle>
            <StatsContainer>
              <WalletBalanceDropdown coin={coin} coinModel={coinModel} />
              <CoinPerformance coin={coin} />
            </StatsContainer>
          </Header>
          <TransactionFilters coin={coin} />
          {empty ? (
            search ? (
              <SceneWrapper centerContent>
                <EmptyTx />
              </SceneWrapper>
            ) : (
              <SceneWrapper centerContent>
                <CoinIntroduction coin={coin} />
              </SceneWrapper>
            )
          ) : (
            pages.map((value, index) => (
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
            ))
          )}
        </LazyLoadContainer>
      </SceneWrapper>
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
      dispatch(actions.components[`${toLower(coin)}Transactions`].loadMore()),
    setAddressArchived: address =>
      dispatch(actions.core.wallet.setAddressArchived(address, true))
  }
}

const enhance = compose(
  reduxForm({
    form: model.form.WALLET_TX_SEARCH,
    initialValues: { source: 'all' }
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(TransactionsContainer)
