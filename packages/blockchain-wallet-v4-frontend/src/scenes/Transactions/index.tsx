import { actions, model } from 'data'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import { path, toLower } from 'ramda'
import { reduxForm } from 'redux-form'
import { SceneWrapper } from 'components/Layout'
import CoinIntroduction from './CoinIntroduction'
import EmptyTx from 'components/EmptyTx'
import LazyLoadContainer from 'components/LazyLoadContainer'
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
  width: 100%;
  margin: 24px 0;
`
// const BalanceContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex-basis: 33%;
//   padding: 12px;
//   border: 1px solid ${props => props.theme.grey100};
//   border-radius: 8px;
// `
// const ChartContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex-basis: 66%;
//   margin-left: 35px;
//   padding: 12px;
//   border: 1px solid ${props => props.theme.grey100};
//   border-radius: 8px;
// `
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
              {/* <ChartContainer>
                <Text color='grey400' weight={500} size='16px'>
                  Current Price
                </Text>
              </ChartContainer> */}
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
