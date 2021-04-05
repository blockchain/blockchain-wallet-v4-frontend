import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import {
  SkeletonRectangle,
  TabMenu,
  TabMenuItem,
  Text
} from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import {
  CoinType,
  InterestRateType,
  RemoteDataType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { Container } from 'components/Box'
import { SceneWrapper } from 'components/Layout'
import { actions } from 'data'
import { UserDataType } from 'data/types'

import IneligibilityCard from './IneligibilityCard'
import IntroCard from './IntroCard'
import { getData } from './selectors'
import SummaryCard from './SummaryCard'
import InterestHeader from './template.header'

const ContainerStyled = styled(Container)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100%;
`
const TabRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 26px;
`

class Interest extends React.PureComponent<Props, StateType> {
  state = { isGoldTier: true }

  componentDidMount() {
    this.props.interestActions.fetchInterestInstruments()
    this.props.interestActions.fetchInterestRate()
    this.props.interestActions.fetchInterestBalance()
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !Remote.Success.is(prevProps.data) &&
      Remote.Success.is(this.props.data)
    ) {
      this.checkUserData()
    }
  }

  checkUserData = () => {
    const data = this.props.data.getOrElse({
      userData: { tiers: { current: 0 } } as UserDataType
    } as SuccessStateType)
    const tier = data.userData.tiers ? data.userData.tiers.current : 0
    const isGoldTier = tier >= 2
    this.setState({ isGoldTier })
  }

  render() {
    const { isGoldTier } = this.state
    const { data } = this.props
    return (
      <SceneWrapper>
        <InterestHeader />
        {isGoldTier && (
          <TabRow>
            <TabMenu>
              <LinkContainer to='/interest' exact>
                <TabMenuItem data-e2e='interestTabMenuAccounts'>
                  <FormattedMessage
                    id='scenes.interest.tab.accounts'
                    defaultMessage='Accounts'
                  />
                </TabMenuItem>
              </LinkContainer>
              <LinkContainer to='/interest/history'>
                <TabMenuItem data-e2e='interestTabMenuHistory'>
                  <FormattedMessage
                    id='scenes.interest.tab.history'
                    defaultMessage='Transaction History'
                  />
                </TabMenuItem>
              </LinkContainer>
            </TabMenu>
          </TabRow>
        )}
        {data.cata({
          Success: val => (
            <>
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
                        key={instrument}
                      />
                    )
                  })}
              </ContainerStyled>
              <IneligibilityCard {...val} {...this.props} />
            </>
          ),
          Failure: () => (
            <Text size='16px' weight={500}>
              Oops. Something went wrong. Please refresh and try again.
            </Text>
          ),
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
