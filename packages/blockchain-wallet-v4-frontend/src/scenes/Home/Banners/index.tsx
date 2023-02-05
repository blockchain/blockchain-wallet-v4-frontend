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

const Banners = (props: Props) => {
  const { buySellActions, interestActions } = props
  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    buySellActions.fetchSDDEligibility()
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

  if (!data || error || isNotAsked || isLoading) return null

  const { bannerToShow } = data

  switch (bannerToShow) {
    case 'resubmit':
      return (
        <BannerWrapper>
          <KycResubmit />
        </BannerWrapper>
      )
    case 'activeRewards':
      return (
        <BannerWrapper>
          <ActiveRewardsBanner />
        </BannerWrapper>
      )
    case 'staking':
      return (
        <BannerWrapper>
          <StakingBanner />
        </BannerWrapper>
      )
    case 'appleAndGooglePay':
      return (
        <BannerWrapper>
          <AppleAndGooglePayBanner />
        </BannerWrapper>
      )
    case 'finishKyc':
      return (
        <BannerWrapper>
          <FinishKyc />
        </BannerWrapper>
      )
    case 'servicePriceUnavailable':
      return (
        <BannerWrapper>
          <ServicePriceUnavailable />
        </BannerWrapper>
      )
    case 'sbOrder':
      return (
        <BannerWrapper>
          <BSOrderBanner />
        </BannerWrapper>
      )
    case 'coinRename':
      return (
        <BannerWrapper>
          <CoinRename />
        </BannerWrapper>
      )
    case 'newCurrency':
      return (
        <BannerWrapper>
          <NewCurrency />
        </BannerWrapper>
      )
    case 'buyCrypto':
      return (
        <BannerWrapper>
          <BuyCrypto />
        </BannerWrapper>
      )
    case 'continueToGold':
      return (
        <BannerWrapper>
          <ContinueToGold />
        </BannerWrapper>
      )
    case 'completeYourProfile':
      return (
        <BannerWrapper>
          <CompleteYourProfile />
        </BannerWrapper>
      )
    case 'recurringBuys':
      return (
        <BannerWrapper>
          <RecurringBuys />
        </BannerWrapper>
      )
    case 'sanctions':
      return (
        <BannerWrapper>
          <Sanctions />
        </BannerWrapper>
      )
    case 'earnRewards':
      return (
        <BannerWrapper>
          <RewardsBanner />
        </BannerWrapper>
      )
    default:
      return null
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(memo(Banners))
