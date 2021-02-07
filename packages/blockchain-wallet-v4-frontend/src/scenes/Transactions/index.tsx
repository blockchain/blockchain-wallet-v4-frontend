import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { path, toLower } from 'ramda'
import { reduxForm } from 'redux-form'
import React from 'react'
import styled from 'styled-components'

import { actions, model } from 'data'
import { Button, Icon, Link, Text } from 'blockchain-info-components'
import {
  CoinType,
  CoinTypeEnum,
  FiatType,
  FiatTypeEnum,
  SupportedFiatType,
  SupportedWalletCurrencyType,
  WalletCurrencyType,
  WalletFiatEnum,
  WalletFiatType
} from 'core/types'
import { getIntroductionText } from 'coins/selectors'
import { media } from 'services/styles'
import { SceneWrapper } from 'components/Layout'
import EmptyResults from 'components/EmptyResults'
import LazyLoadContainer from 'components/LazyLoadContainer'

import { getData } from './selectors'
import CoinIntroduction from './CoinIntroduction'
import CoinPerformance from './CoinPerformance'
import InterestTransactions from './TransactionList/template.interest'
import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'
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
  color: ${props => props.theme.grey600};
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
  margin-left: 6px;
`
const LearnMoreText = styled(Text)`
  margin-left: 3px;
  size: 16px;
  font-weight: 500;
  color: ${props => props.theme.blue600};
`

class TransactionsContainer extends React.PureComponent<Props> {
  componentDidMount () {
    this.props.initTxs()
    this.props.miscActions.fetchPriceChange(
      this.props.coin as CoinType,
      this.props.currency,
      'week'
    )
    this.props.brokerageActions.fetchBankTransferAccounts()
  }

  componentDidUpdate (prevProps) {
    if (
      path(['location', 'pathname'], prevProps) !==
      path(['location', 'pathname'], this.props)
    ) {
      this.props.initTxs()
    }
  }

  handleRefresh = () => {
    this.props.fetchData()
    this.props.initTxs()
  }

  handleArchive = address => {
    this.props.setAddressArchived && this.props.setAddressArchived(address)
  }

  render () {
    const {
      coin,
      coinModel,
      currency,
      hasTxResults,
      isCoinErc20,
      isSearchEntered,
      loadMoreTxs,
      pages,
      sourceType
    } = this.props
    const { colorCode, coinTicker, displayName, icons } = coinModel
    return (
      <SceneWrapper>
        <LazyLoadContainer onLazyLoad={loadMoreTxs}>
          <Header>
            <PageTitle>
              <CoinTitle>
                <Icon size='36px' color={colorCode} name={icons.circleFilled} />
                <Text color='grey800' size='32px' weight={600}>
                  {displayName}
                </Text>
              </CoinTitle>
              <TitleActionContainer>
                {coin in CoinTypeEnum && (
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
                          'SELL'
                        )
                      }}
                    >
                      <FormattedMessage
                        id='buttons.sell'
                        defaultMessage='Sell'
                      />
                    </Button>
                    <Button
                      nature='primary'
                      data-e2e='buyCrypto'
                      width='100px'
                      onClick={() => {
                        this.props.simpleBuyActions.showModal(
                          'TransactionList',
                          coin as CoinType,
                          'BUY'
                        )
                      }}
                    >
                      <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
                    </Button>
                  </>
                )}
                {coin in WalletFiatEnum && (
                  <>
                    {(coinModel as SupportedFiatType).availability.deposit && (
                      <Button
                        nature='primary'
                        data-e2e='depositFiat'
                        style={{ minWidth: 'auto' }}
                        onClick={() => {
                          if (!this.props.simpleBuyActions) return
                          this.props.simpleBuyActions.handleSBDepositFiatClick(
                            coin as WalletFiatType,
                            'TransactionList'
                          )
                        }}
                      >
                        <FormattedMessage
                          id='buttons.deposit'
                          defaultMessage='Deposit'
                        />
                      </Button>
                    )}
                    {(coinModel as SupportedFiatType).availability
                      .withdrawal && (
                      <Button
                        nature='primary'
                        data-e2e='withdrawFiat'
                        style={{ minWidth: 'auto', marginLeft: '8px' }}
                        onClick={() => {
                          if (!this.props.withdrawActions) return
                          this.props.withdrawActions.showModal(
                            coin as WalletFiatType
                          )
                        }}
                      >
                        <FormattedMessage
                          id='buttons.withdraw'
                          defaultMessage='Withdraw'
                        />
                      </Button>
                    )}
                  </>
                )}
              </TitleActionContainer>
            </PageTitle>
            <ExplainerWrapper>
              <ExplainerText>
                {getIntroductionText(coin)}
                {!(coin in FiatTypeEnum) && (
                  <LearnMoreLink href={coinModel.learnMoreLink} target='_blank'>
                    <LearnMoreText size='16px'>
                      <FormattedMessage
                        id='buttons.learn_more'
                        defaultMessage='Learn More'
                      />
                    </LearnMoreText>
                  </LearnMoreLink>
                )}
              </ExplainerText>
            </ExplainerWrapper>
            <StatsContainer>
              <WalletBalanceDropdown
                coin={coin}
                coinModel={coinModel}
                isCoinErc20={isCoinErc20}
              />
              {coin in CoinTypeEnum && (
                <CoinPerformance coin={coin} coinModel={coinModel} />
              )}
            </StatsContainer>
          </Header>
          {(hasTxResults || isSearchEntered) && coin in CoinTypeEnum && (
            <TransactionFilters coin={coin as CoinType} />
          )}
          {!hasTxResults ? (
            isSearchEntered ? (
              <SceneWrapper centerContent>
                <EmptyResults />
              </SceneWrapper>
            ) : (
              <SceneWrapper centerContent>
                <CoinIntroduction coin={coin as CoinType} />
              </SceneWrapper>
            )
          ) : sourceType && sourceType === 'INTEREST' ? (
            <InterestTransactions />
          ) : (
            pages.map((value, index) => (
              <TransactionList
                coin={coin}
                coinTicker={coinTicker}
                currency={currency}
                data={value}
                key={index}
                onArchive={this.handleArchive}
                onLoadMore={loadMoreTxs}
                onRefresh={this.handleRefresh}
                sourceType={sourceType}
              />
            ))
          )}
        </LazyLoadContainer>
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state, ownProps): LinkStatePropsType =>
  // @ts-ignore
  getData(state, ownProps.coin, ownProps.isCoinErc20)

const mapDispatchToProps = (dispatch: Dispatch, ownProps) => {
  const { coin, isCoinErc20 } = ownProps
  if (isCoinErc20) {
    return {
      fetchData: () => dispatch(actions.core.data.eth.fetchErc20Data(coin)),
      initTxs: () =>
        dispatch(actions.components.ethTransactions.initializedErc20(coin)),
      loadMoreTxs: () =>
        dispatch(actions.components.ethTransactions.loadMoreErc20(coin)),
      miscActions: bindActionCreators(actions.core.data.misc, dispatch),
      simpleBuyActions: bindActionCreators(
        actions.components.simpleBuy,
        dispatch
      ),
      brokerageActions: bindActionCreators(
        actions.components.brokerage,
        dispatch
      )
    }
  }
  if (coin in WalletFiatEnum) {
    return {
      fetchData: () => {},
      loadMoreTxs: () =>
        dispatch(actions.components.fiatTransactions.loadMore(coin)),
      initTxs: () =>
        dispatch(actions.components.fiatTransactions.initialized(coin)),
      miscActions: bindActionCreators(actions.core.data.misc, dispatch),
      simpleBuyActions: bindActionCreators(
        actions.components.simpleBuy,
        dispatch
      ),
      withdrawActions: bindActionCreators(
        actions.components.withdraw,
        dispatch
      ),
      brokerageActions: bindActionCreators(
        actions.components.brokerage,
        dispatch
      )
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
    miscActions: bindActionCreators(actions.core.data.misc, dispatch),
    setAddressArchived: address =>
      dispatch(actions.core.wallet.setAddressArchived(address, true)),
    simpleBuyActions: bindActionCreators(
      actions.components.simpleBuy,
      dispatch
    ),
    brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: WalletCurrencyType
  isCoinErc20: boolean
}

export type SuccessStateType = {
  coinModel: SupportedWalletCurrencyType
  currency: FiatType
  hasTxResults: boolean
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
