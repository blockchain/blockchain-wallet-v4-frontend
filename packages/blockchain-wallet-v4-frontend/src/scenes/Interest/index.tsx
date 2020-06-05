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
import {
  Icon,
  Link,
  SkeletonRectangle,
  Text,
  TooltipHost
} from 'blockchain-info-components'
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
const LegalText = styled(Text)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 1200px;
  margin-top: 50px;
`
const Legal = () => {
  return (
    <LegalText>
      <TooltipHost id='scenes.interest.legaldisclaimer'>
        <Icon name='info' size='12px' color='blue600' />
        <Text
          size='12px'
          color='blue600'
          weight={500}
          style={{ marginLeft: '5px' }}
          cursor='default'
        >
          <FormattedMessage
            id='scenes.interest.legaldiscalimer'
            defaultMessage='Legal disclaimer'
          />
        </Text>
      </TooltipHost>
    </LegalText>
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
              </Container>
              <Legal />
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
