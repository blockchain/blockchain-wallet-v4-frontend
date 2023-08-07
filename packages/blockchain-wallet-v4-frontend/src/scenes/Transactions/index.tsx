import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { NavLink } from 'react-router-dom'
import { isEmpty, path, toLower } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  CoinType,
  EarnEligibleType,
  FiatType,
  OrderType,
  TimeRange,
  WalletFiatType
} from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import EmptyResults from 'components/EmptyResults'
import { SceneWrapper } from 'components/Layout'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions, model, selectors } from 'data'
import { getIntroductionText } from 'data/coins/selectors'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

import CoinIntroduction from './CoinIntroduction'
import CoinPerformance from './CoinPerformance'
import RecurringBuys from './RecurringBuys'
import { getData } from './selectors'
import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'
import InterestTransactions from './TransactionList/template.interest'
import WalletBalanceDropdown from './WalletBalanceDropdown'

const PageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  ${media.mobile`
    flex-direction: column;
  `}
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

  & > a {
    text-decoration: none;
    margin-right: 8px;
  }

  ${media.mobile`
    margin-top: 8px;
    width: 100%;
  `}
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

const StyledButton = styled(Button)`
  &:not(:last-child) {
    margin-right: 8px;
  }

  ${media.mobile`
    flex: 1;
  `}
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
    this.props.recurringBuyActions.fetchRegisteredList()
    this.props.interestActions.fetchActiveRewardsEligible()
    this.props.interestActions.fetchInterestEligible()
    this.props.interestActions.fetchStakingEligible()
    this.props.interestActions.fetchActiveRewardsRates()
    this.props.interestActions.fetchInterestRates()
    this.props.interestActions.fetchStakingRates()
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
    if (this.props.setAddressArchived) this.props.setAddressArchived(address)
  }

  render() {
    const {
      analyticsActions,
      computedMatch,
      currency,
      hasTxResults,
      interestEligible,
      isGoldTier,
      isInvited,
      isSearchEntered,
      loadMoreTxs,
      pages,
      sourceType,
      stakingEligible
    } = this.props
    const { coin } = computedMatch.params
    const { coinfig } = window.coins[coin]
    const interestEligibleCoin =
      !isEmpty(interestEligible) && interestEligible[coin] && interestEligible[coin]?.eligible
    const stakingEligibleCoin =
      !isEmpty(stakingEligible) && stakingEligible[coin] && stakingEligible[coin]?.eligible
    const isEarnButtonEnabled = isGoldTier && (interestEligibleCoin || stakingEligibleCoin)
    const isEarnSourceType = sourceType && (sourceType === 'INTEREST' || sourceType === 'STAKING')

    return (
      <SceneWrapper>
        <LazyLoadContainer triggerDistance={200} onLazyLoad={loadMoreTxs}>
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
                {coinfig.type.name !== 'FIAT' && (
                  <>
                    <StyledButton
                      nature='primary'
                      data-e2e='buyCrypto'
                      width='100px'
                      onClick={() => {
                        this.props.analyticsActions.trackEvent({
                          key: Analytics.COIN_VIEW_BUY_CLICKED,
                          properties: {}
                        })

                        this.props.buySellActions.showModal({
                          cryptoCurrency: coin as CoinType,
                          orderType: OrderType.BUY,
                          origin: 'TransactionList'
                        })
                      }}
                    >
                      <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
                    </StyledButton>
                    {isEarnButtonEnabled && (
                      <NavLink to='/earn' data-e2e='vistEarnPage'>
                        <StyledButton
                          width='100px'
                          nature='primary'
                          data-e2e='earnInterest'
                          onClick={() => {
                            analyticsActions.trackEvent({
                              key: Analytics.COINVIEW_EARN_REWARDS_BUTTON_CLICKED,
                              properties: {
                                currency: coin,
                                device: 'WEB',
                                platform: 'WALLET'
                              }
                            })
                          }}
                        >
                          <FormattedMessage
                            id='scenes.interest.summarycard.earnOnly'
                            defaultMessage='Earn'
                          />
                        </StyledButton>
                      </NavLink>
                    )}
                    <StyledButton
                      nature='light'
                      data-e2e='sellCrypto'
                      width='100px'
                      onClick={() => {
                        this.props.analyticsActions.trackEvent({
                          key: Analytics.COIN_VIEW_SELL_CLICKED,
                          properties: {}
                        })

                        this.props.buySellActions.showModal({
                          cryptoCurrency: coin as CoinType,
                          orderType: OrderType.SELL,
                          origin: 'TransactionList'
                        })
                      }}
                    >
                      <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
                    </StyledButton>
                  </>
                )}
                {coinfig.type.name === 'FIAT' && (
                  <>
                    {window.coins[coin].coinfig.type.name === 'FIAT' && (
                      <Button
                        nature='primary'
                        data-e2e='depositFiat'
                        style={{ minWidth: 'auto' }}
                        onClick={() => {
                          if (!this.props.brokerageActions) return
                          if (!this.props.buySellActions) return
                          if (isInvited || coin === 'USD') {
                            this.props.brokerageActions.handleDepositFiatClick(
                              coin as WalletFiatType
                            )
                          } else {
                            this.props.buySellActions.handleDepositFiatClick({
                              coin: coin as WalletFiatType,
                              origin: 'TransactionList'
                            })
                          }
                        }}
                      >
                        <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />
                      </Button>
                    )}
                    {window.coins[coin].coinfig.type.name === 'FIAT' && (
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
              <WalletBalanceDropdown key={coin} coin={coin} />
              {coinfig.type.name !== 'FIAT' && <CoinPerformance coin={coin} />}
            </StatsContainer>
          </Header>
          <RecurringBuys coin={coin as CoinType} />
          {(hasTxResults || isSearchEntered) && coinfig.type.name !== 'FIAT' && (
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
          {hasTxResults && isEarnSourceType && <InterestTransactions sourceType={sourceType} />}
          {hasTxResults &&
            (!sourceType || !isEarnSourceType) &&
            pages.map((value, i) => (
              <TransactionList
                coin={coin}
                coinTicker={coinfig.symbol}
                currency={currency}
                data={value}
                // eslint-disable-next-line react/no-array-index-key
                key={`${coin}${i}`}
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

const mapStateToProps = (state, ownProps: OwnProps): LinkStatePropsType => getData(state, ownProps)

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  const { coin } = ownProps.computedMatch.params
  const { coinfig } = window.coins[coin]
  const baseActions = {
    analyticsActions: bindActionCreators(actions.analytics, dispatch),
    brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
    buySellActions: bindActionCreators(actions.components.buySell, dispatch),
    interestActions: bindActionCreators(actions.components.interest, dispatch),
    miscActions: bindActionCreators(actions.core.data.misc, dispatch),
    recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch),
    withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
  }
  if (selectors.core.data.coins.getErc20Coins().includes(coin)) {
    return {
      ...baseActions,
      fetchData: () => dispatch(actions.core.data.eth.fetchErc20Data(coin)),
      initTxs: () => dispatch(actions.components.ethTransactions.initializedErc20(coin)),
      loadMoreTxs: () => dispatch(actions.components.ethTransactions.loadMoreErc20(coin))
    }
  }
  if (
    selectors.core.data.coins.getCustodialCoins().includes(coin) ||
    selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(coin)
  ) {
    return {
      ...baseActions,
      fetchData: () => {},
      initTxs: () => dispatch(actions.components.coinTransactions.initialized(coin)),
      loadMoreTxs: () => dispatch(actions.components.coinTransactions.loadMore(coin))
    }
  }
  if (coinfig.type.name === 'FIAT') {
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

export type OwnProps = RouteComponentProps

export type SuccessStateType = {
  currency: FiatType
  hasTxResults: boolean
  interestEligible: EarnEligibleType
  isInvited: boolean
  isSearchEntered: boolean
  pages: Array<any>
  sourceType: string
  stakingEligible: EarnEligibleType
}

// data is not remote
type LinkStatePropsType = SuccessStateType

type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

const enhance = compose<React.ComponentType>(
  reduxForm({
    form: model.form.WALLET_TX_SEARCH,
    initialValues: { source: 'all' }
  }),
  connector
)

export default enhance(TransactionsContainer)
