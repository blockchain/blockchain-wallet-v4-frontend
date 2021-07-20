import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { path, toLower } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import {
  CoinType,
  FiatType,
  OrderType,
  SupportedWalletCurrencyType,
  TimeRange,
  WalletCurrencyType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import EmptyResults from 'components/EmptyResults'
import { SceneWrapper } from 'components/Layout'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions, model } from 'data'
import { getIntroductionText } from 'data/coins/selectors'
import { media } from 'services/styles'

import CoinIntroduction from './CoinIntroduction'
import CoinPerformance from './CoinPerformance'
import { getData } from './selectors'
import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'
import InterestTransactions from './TransactionList/template.interest'
import WalletBalanceDropdown from './WalletBalanceDropdown'

const PageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const CoinTitle = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;

  > :first-child {
    margin-right: 14px;
  }
`
const TitleActionContainer = styled.div`
  display: flex;
`
const Header = styled.div`
  width: 100%;
`
const ExplainerWrapper = styled.div`
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
const ExplainerText = styled(Text)`
  margin-top: 15px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
  margin-left: 6px;
`
const LearnMoreText = styled(Text)`
  margin-left: 3px;
  size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.blue600};
`

class TransactionsContainer extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.initTxs()
    this.props.miscActions.fetchPriceChange(
      this.props.coin as CoinType,
      this.props.currency,
      TimeRange.WEEK
    )
    this.props.brokerageActions.fetchBankTransferAccounts()
  }

  componentDidUpdate(prevProps) {
    if (path(['location', 'pathname'], prevProps) !== path(['location', 'pathname'], this.props)) {
      this.props.initTxs()
    }
  }

  handleRefresh = () => {
    this.props.fetchData()
    this.props.initTxs()
  }

  handleArchive = (address) => {
    // @ts-ignore
    if (this.props.setAddressArchived) this.props.setAddressArchived(address)
  }

  render() {
    const {
      coin,
      currency,
      hasTxResults,
      isInvited,
      isSearchEntered,
      loadMoreTxs,
      pages,
      sourceType
    } = this.props
    const { coinfig } = window.coins[coin]

    return (
      <SceneWrapper>
        <LazyLoadContainer onLazyLoad={loadMoreTxs}>
          <Header>
            <PageTitle>
              <CoinTitle>
                <Icon
                  size='36px'
                  color={coinfig.symbol as CoinType}
                  name={coinfig.symbol as CoinType}
                />
                <Text color='grey800' size='32px' weight={600}>
                  {coinfig.name}
                </Text>
              </CoinTitle>
              <TitleActionContainer>
                {!coinfig.type.isFiat && (
                  <>
                    <Button
                      nature='primary'
                      data-e2e='sellCrypto'
                      width='100px'
                      style={{ marginRight: '8px' }}
                      onClick={() => {
                        this.props.simpleBuyActions.showModal(
                          'TransactionList',
                          coin as CoinType,
                          OrderType.SELL
                        )
                      }}
                    >
                      <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
                    </Button>
                    <Button
                      nature='primary'
                      data-e2e='buyCrypto'
                      width='100px'
                      onClick={() => {
                        this.props.simpleBuyActions.showModal(
                          'TransactionList',
                          coin as CoinType,
                          OrderType.BUY
                        )
                      }}
                    >
                      <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
                    </Button>
                  </>
                )}
                {coinfig.type.isFiat && (
                  <>
                    {window.coins[coin].coinfig.type.isFiat && (
                      <Button
                        nature='primary'
                        data-e2e='depositFiat'
                        style={{ minWidth: 'auto' }}
                        onClick={() => {
                          if (!this.props.brokerageActions) return
                          if (!this.props.simpleBuyActions) return
                          if (isInvited || coin === 'USD') {
                            this.props.brokerageActions.handleDepositFiatClick(
                              coin as WalletFiatType
                            )
                          } else {
                            this.props.simpleBuyActions.handleSBDepositFiatClick(
                              coin as WalletFiatType,
                              'TransactionList'
                            )
                          }
                        }}
                      >
                        <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />
                      </Button>
                    )}
                    {window.coins[coin].coinfig.type.isFiat && (
                      <Button
                        nature='primary'
                        data-e2e='withdrawFiat'
                        style={{ marginLeft: '8px', minWidth: 'auto' }}
                        onClick={() => {
                          if (!this.props.brokerageActions) return
                          this.props.brokerageActions.handleWithdrawClick(coin as WalletFiatType)
                        }}
                      >
                        <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />
                      </Button>
                    )}
                  </>
                )}
              </TitleActionContainer>
            </PageTitle>
            <ExplainerWrapper>
              <ExplainerText>{getIntroductionText(coin)}</ExplainerText>
            </ExplainerWrapper>
            <StatsContainer>
              <WalletBalanceDropdown coin={coin} />
              {!coinfig.type.isFiat && <CoinPerformance coin={coin} />}
            </StatsContainer>
          </Header>
          {(hasTxResults || isSearchEntered) && !coinfig.type.isFiat && (
            <TransactionFilters coin={coin as CoinType} />
          )}
          {!hasTxResults && isSearchEntered && (
            <SceneWrapper centerContent>
              <EmptyResults />
            </SceneWrapper>
          )}
          {!hasTxResults && !isSearchEntered && (
            <SceneWrapper centerContent>
              <CoinIntroduction coin={coin as CoinType} />
            </SceneWrapper>
          )}
          {hasTxResults && sourceType && sourceType === 'INTEREST' && <InterestTransactions />}
          {hasTxResults &&
            (!sourceType || sourceType !== 'INTEREST') &&
            pages.map((value) => (
              <TransactionList
                coin={coin}
                coinTicker={coinfig.symbol}
                currency={currency}
                data={value}
                key={coinfig.symbol}
                onArchive={this.handleArchive}
                onLoadMore={loadMoreTxs}
                onRefresh={this.handleRefresh}
                sourceType={sourceType}
              />
            ))}
        </LazyLoadContainer>
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state, ownProps: OwnProps): LinkStatePropsType =>
  getData(state, ownProps.coin, ownProps.coinfig)

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  const { coin, coinfig } = ownProps
  const baseActions = {
    brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
    miscActions: bindActionCreators(actions.core.data.misc, dispatch),
    simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
    withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
  }
  if (coinfig.type.erc20Address) {
    return {
      ...baseActions,
      fetchData: () => dispatch(actions.core.data.eth.fetchErc20Data(coin)),
      initTxs: () => dispatch(actions.components.ethTransactions.initializedErc20(coin)),
      loadMoreTxs: () => dispatch(actions.components.ethTransactions.loadMoreErc20(coin))
    }
  }
  if (coinfig.type.isFiat) {
    return {
      ...baseActions,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fetchData: () => {},
      initTxs: () =>
        dispatch(actions.components.fiatTransactions.initialized(coin as WalletFiatType)),
      loadMoreTxs: () =>
        dispatch(actions.components.fiatTransactions.loadMore(coin as WalletFiatType))
    }
  }
  return {
    ...baseActions,
    fetchData: () => dispatch(actions.core.data[toLower(coin)].fetchData()),
    initTxs: () => dispatch(actions.components[`${toLower(coin)}Transactions`].initialized()),
    loadMoreTxs: () => dispatch(actions.components[`${toLower(coin)}Transactions`].loadMore()),
    setAddressArchived: (address) => dispatch(actions.core.wallet.setAddressArchived(address, true))
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: WalletCurrencyType
  coinfig: SupportedWalletCurrencyType['coinfig']
}

export type SuccessStateType = {
  currency: FiatType
  hasTxResults: boolean
  isInvited: boolean
  isSearchEntered: boolean
  pages: Array<any>
  sourceType: string
}

// data is not remote
type LinkStatePropsType = SuccessStateType

type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

const enhance = compose<any>(
  reduxForm({
    form: model.form.WALLET_TX_SEARCH,
    initialValues: { source: 'all' }
  }),
  connector
)

export default enhance(TransactionsContainer)
