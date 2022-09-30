import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { InterestEDDStatus, RemoteDataType, RewardsRatesType, StakingRatesType } from '@core/types'
import { TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics, EarnInstrumentsType, UserDataType } from 'data/types'

import Loading from './Earn.loading.template'
import { CustomSceneWrapper, EarnContainer, Overlay, TabRow } from './Earn.model'
import getData from './Earn.selectors'
import InterestHeader from './Earn.template.header'
import EarnTable from './EarnTable'
import NotGoldTierMessage from './NotGoldTierMessage'

class Earn extends React.PureComponent<Props, StateType> {
  constructor(props) {
    super(props)
    this.state = { isGoldTier: true }
  }

  componentDidMount() {
    this.props.earnActions.fetchEarnInstruments()
    this.props.earnActions.fetchInterestRates()
    this.props.earnActions.fetchRewardsBalance()
    this.props.earnActions.fetchStakingBalance()
    this.props.earnActions.fetchEDDStatus()
    this.props.earnActions.fetchInterestEligible()
    this.props.earnActions.fetchStakingEligible()
  }

  componentDidUpdate(prevProps: Props) {
    if (!Remote.Success.is(prevProps.data) && Remote.Success.is(this.props.data)) {
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

  handleHistoryClick = () => {
    this.props.analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_TRANSACTION_HISTORY_CLICKED,
      properties: {}
    })
  }

  render() {
    const { isGoldTier } = this.state
    const { data } = this.props
    return (
      <CustomSceneWrapper $isGoldTier={isGoldTier}>
        <InterestHeader />
        {!isGoldTier && <NotGoldTierMessage />}
        <EarnContainer>
          {!isGoldTier && <Overlay />}
          <TabRow>
            <TabMenu>
              <LinkContainer to='/earn' exact>
                <TabMenuItem data-e2e='interestTabMenuAccounts' width='130px'>
                  <FormattedMessage id='copy.all' defaultMessage='All' />
                </TabMenuItem>
              </LinkContainer>
              <LinkContainer to='/earn/history' onClick={this.handleHistoryClick}>
                <TabMenuItem data-e2e='interestTabMenuHistory' width='130px'>
                  <FormattedMessage id='copy.history' defaultMessage='History' />
                </TabMenuItem>
              </LinkContainer>
            </TabMenu>
          </TabRow>
          {data.cata({
            Failure: () => (
              <Text size='16px' weight={500}>
                Oops. Something went wrong. Please refresh and try again.
              </Text>
            ),
            Loading: () => <Loading />,
            NotAsked: () => <Loading />,
            Success: (val) => <EarnTable isGoldTier={isGoldTier} {...val} {...this.props} />
          })}
        </EarnContainer>
      </CustomSceneWrapper>
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  idvActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type StateType = {
  isGoldTier: boolean
}
export type SuccessStateType = {
  interestEDDStatus: InterestEDDStatus
  interestRates: RewardsRatesType
  interestRatesArray: Array<number>
  sortedInstruments: EarnInstrumentsType
  stakingRates: StakingRatesType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  earnActions: typeof actions.components.interest
  idvActions: typeof actions.components.identityVerification
}

export type Props = ConnectedProps<typeof connector>

export default connector(Earn)
