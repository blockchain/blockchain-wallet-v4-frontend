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
  SupportedWalletCurrenciesType
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
import IneligibiltyWarning from './IneligibilityCard'
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
const ContainerStyled = styled(Container)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100%;
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`
const LearnMoreText = styled(Text)`
  margin-left: 3px;
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.theme.blue600};
`
const DisclaimerText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const SubheaderSeparator = styled.div`
  display: flex;
  flex-grow: 2;
`

class Interest extends React.PureComponent<Props, StateType> {
  state = { isGoldTier: true }

  componentDidMount () {
    this.props.interestActions.fetchInterestInstruments()
    this.props.interestActions.fetchInterestRate()
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
      userData: { tiers: { current: 0 } } as UserDataType
    } as SuccessStateType)
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
            id='scenes.interest.subheader_store'
            defaultMessage='Store crypto and watch it grow.'
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
          <SubheaderSeparator />
          <DisclaimerText>
            <TooltipHost id='scenes.interest.legaldisclaimer'>
              <Icon name='info' size='12px' color='blue600' />
              <Text
                size='12px'
                color='blue600'
                weight={500}
                style={{ margin: '-2px 0 0 5px' }}
              >
                <FormattedMessage
                  id='scenes.interest.legaldiscalimer'
                  defaultMessage='Legal disclaimer'
                />
              </Text>
            </TooltipHost>
          </DisclaimerText>
        </SceneSubHeaderText>
        {data.cata({
          Success: val => (
            <LazyLoadWrapper onLazyLoad={this.onFetchMoreTransactions}>
              <ContainerStyled>
                <IntroCard {...val} {...this.props} isGoldTier={isGoldTier} />
                {isGoldTier &&
                  val.instruments.map(instrument => {
                    return (
                      <SummaryCard
                        {...val}
                        {...this.props}
                        isGoldTier={isGoldTier}
                        coin={instrument}
                      />
                    )
                  })}
              </ContainerStyled>
              <IneligibiltyWarning {...val} {...this.props} />
              <TransactionList />
            </LazyLoadWrapper>
          ),
          Failure: () => null,
          Loading: () => <SkeletonRectangle width='275px' height='275px' />,
          NotAsked: () => <SkeletonRectangle width='275px' height='275px' />
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
  instruments: Array<CoinType>
  interestRate: InterestRateType
  interestRateArray: Array<number>
  supportedCoins: SupportedWalletCurrenciesType
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
