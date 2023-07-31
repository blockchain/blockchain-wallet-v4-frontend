import React, { memo, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { actions } from 'data'
import { useRemote } from 'hooks'

import ActiveRewardsBanner from './ActiveRewardsBanner'
import { AppleAndGooglePayBanner } from './AppleAndGooglePayBanner'
import BSOrderBanner from './BSOrderBanner'
import BuyCrypto from './BuyCrypto'
import CoinRename from './CoinRename'
import CompleteYourProfile from './CompleteYourProfile'
import ContinueToGold from './ContinueToGold'
import FinishKyc from './FinishKyc'
import KycResubmit from './KycResubmit'
import NewCurrency from './NewCurrency'
import RecurringBuys from './RecurringBuys'
import RewardsBanner from './RewardsBanner'
import Sanctions from './Sanctions'
import { getData } from './selectors'
import ServicePriceUnavailable from './ServicePriceUnavailable'
import StakingBanner from './StakingBanner'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
`

const BANNER_DICT = {
  activeRewards: <ActiveRewardsBanner />,
  appleAndGooglePay: <AppleAndGooglePayBanner />,
  buyCrypto: <BuyCrypto />,
  coinRename: <CoinRename />,
  completeYourProfile: <CompleteYourProfile />,
  continueToGold: <ContinueToGold />,
  earnRewards: <RewardsBanner />,
  finishKyc: <FinishKyc />,
  newCurrency: <NewCurrency />,
  recurringBuys: <RecurringBuys />,
  resubmit: <KycResubmit />,
  sanctions: <Sanctions />,
  sbOrder: <BSOrderBanner />,
  servicePriceUnavailable: <ServicePriceUnavailable />,
  staking: <StakingBanner />
}

const Banners = (props: Props) => {
  const { buySellActions, interestActions } = props
  const { data, hasError, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    interestActions.fetchInterestEligible()
    interestActions.fetchStakingEligible()
    interestActions.fetchActiveRewardsEligible()
    if (data && data.userData.tiers?.current > 0) {
      // we need such to distinguish is profile completed
      buySellActions.fetchCards(false)
      buySellActions.fetchPaymentMethods(data.fiatCurrency)
      buySellActions.fetchBalance({ skipLoading: true })
      // TODO move this away from BS
      buySellActions.fetchLimits({ currency: data.fiatCurrency })
    }
  }, [])

  if (!data || hasError || isNotAsked || isLoading) return null

  const { bannerToShow } = data

  if (!bannerToShow) return null

  return <BannerWrapper>{BANNER_DICT[bannerToShow]}</BannerWrapper>
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(memo(Banners))
