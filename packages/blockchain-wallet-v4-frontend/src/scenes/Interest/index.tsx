import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import {
  CoinType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { Container } from 'components/Box'
import { Icon, Link, SkeletonRectangle, Text } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText,
  SceneWrapper
} from 'components/Layout'
import { Remote } from 'core'
import { UserDataType } from 'data/types'
import LazyLoadContainer from 'components/LazyLoadContainer'

import { getData } from './selectors'
import IntroCard from './IntroCard'
import SummaryCard from './SummaryCard'
import TransactionList from './TransactionList'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`
const LearnMoreText = styled(Text)`
  margin-left: 3px;
  size: 16px;
  font-weight: 500;
  color: ${props => props.theme.blue600};
`
const LegalTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 250px;
  margin-top: 8px;
`
const LegalText = styled(Text)`
  font-size: 11px;
  line-height: 14px;
  margin-bottom: 10px;
  font-weight: 400;
  color: ${props => props.theme['grey500']};
`
const Legal = () => {
  return (
    <LegalTextWrapper>
      <LegalText>
        <FormattedMessage
          id='scenes.interest.legal.one'
          defaultMessage='Digital/virtual currencies are not bank deposits, are not legal tender, are not backed by the government, and accounts and value balances are not subject to US Federal Deposit Insurance Corporation or Securities InvestorProtection Corporation or any other non-US governmental or government-backed protections.'
        />
      </LegalText>
      <LegalText>
        <FormattedMessage
          id='scenes.interest.legal.two'
          defaultMessage='Legislative and regulatory changes or actions at the US State, Federal, or international level may adversely affect the use, transfer, exchange, and value of digital/virtual currencies.'
        />
      </LegalText>
    </LegalTextWrapper>
  )
}

class Interest extends React.PureComponent<Props, StateType> {
  state = { isGoldTier: true }

  componentDidMount () {
    this.props.interestActions.fetchInterestRate()
    this.props.interestActions.fetchInterestEligible()
    this.props.interestActions.fetchInterestBalance()
  }

  componentDidUpdate (prevProps: Props) {
    if (
      !Remote.Success.is(prevProps.data) &&
      Remote.Success.is(this.props.data)
    ) {
      this.checkUserData()
    }
  }

  componentWillUnmount () {
    // clear transactions related data on exit
    this.props.interestActions.fetchInterestTransactionsSuccess([], true)
    this.props.interestActions.setTransactionsNextPage(null)
  }

  checkUserData = () => {
    const data = this.props.data.getOrElse({
      userData: { tiers: { current: 0 } }
    })
    const tier = data.userData.tiers ? data.userData.tiers.current : 0
    const isGoldTier = tier >= 2
    this.setState({ isGoldTier })
  }

  onFetchMoreTransactions = () => {
    this.props.interestActions.fetchInterestTransactions(false)
  }

  render () {
    const { isGoldTier } = this.state
    const { data } = this.props
    return (
      <SceneWrapper>
        <SceneHeader>
          <IconBackground>
            <Icon color='blue600' name='percentage' size='24px' />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage
              id='scenes.interest.interestaccount'
              defaultMessage='Interest Account'
            />
          </SceneHeaderText>
        </SceneHeader>
        <SceneSubHeaderText>
          <FormattedMessage
            id='scenes.interest.subheader'
            defaultMessage='Deposit crypto and watch it grow.'
          />
          <LearnMoreLink
            href='https://support.blockchain.com/hc/en-us/categories/360003244552-Interest-Account'
            target='_blank'
          >
            <LearnMoreText size='16px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </SceneSubHeaderText>
        {data.cata({
          Success: val => (
            <LazyLoadWrapper onLazyLoad={this.onFetchMoreTransactions}>
              <Container>
                <IntroCard {...val} {...this.props} isGoldTier={isGoldTier} />
                {isGoldTier && (
                  <SummaryCard
                    {...val}
                    {...this.props}
                    isGoldTier={isGoldTier}
                  />
                )}
                <Legal />
              </Container>
              <TransactionList />
            </LazyLoadWrapper>
          ),
          Failure: () => null,
          Loading: () => <SkeletonRectangle width='330px' height='250px' />,
          NotAsked: () => <SkeletonRectangle width='330px' height='250px' />
        })}
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  idvActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type StateType = {
  isGoldTier: boolean
}
export type SuccessStateType = {
  coin: CoinType
  interestRate: InterestRateType
  supportedCoins: SupportedCoinsType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type LinkDispatchPropsType = {
  idvActions: typeof actions.components.identityVerification
  interestActions: typeof actions.components.interest
}

export type Props = ConnectedProps<typeof connector>

export default connector(Interest)
