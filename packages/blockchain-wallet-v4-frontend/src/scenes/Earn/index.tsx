import React, { ChangeEvent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link, Text } from 'blockchain-info-components'
import { getData as getUserCountry } from 'components/Banner/selectors'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, EarnTabsType, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import { debounce } from 'utils/helpers'

import Loading from './Earn.loading.template'
import { CustomSceneWrapper, EarnContainer, Overlay } from './Earn.model'
import getData from './Earn.selectors'
import EarnHeader from './Earn.template.header'
import EarnFilter from './Filter'
import Learn from './Learn'
import Message from './Message'
import Table from './Table'

const EARN_INTRO_VIEWED = 'earnIntroViewed'

const Earn = () => {
  const [isGoldTier, setIsGoldTier] = useState<boolean>(true)
  const earnTab: EarnTabsType = useSelector((state: RootState) => state.components.interest.earnTab)
  const showAvailableAssets: boolean = useSelector(
    (state: RootState) => state.components.interest.showAvailableAssets
  )
  const dispatch = useDispatch()
  const analyticsActions = bindActionCreators(actions.analytics, dispatch)
  const earnActions = bindActionCreators(actions.components.interest, dispatch)
  const modalActions = bindActionCreators(actions.modals, dispatch)
  const hasViewedOnboarding = localStorage.getItem(EARN_INTRO_VIEWED)

  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  const checkUserData = () => {
    const tier = data?.userData?.tiers ? data.userData.tiers.current : 0
    setIsGoldTier(tier >= 2)
  }

  const handleHistoryClick = () => {
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_TRANSACTION_HISTORY_CLICKED,
      properties: {}
    })
  }

  const handleTabClick = (tab: EarnTabsType) => {
    earnActions.setEarnTab({ tab })
  }

  const handleAssetClick = (status: boolean) => {
    earnActions.setShowAvailableAssets({ status })
  }

  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    earnActions.setSearchValue({ value: e.target.value })
  }, 800)

  const isUserFromUK = useSelector(getUserCountry)?.country === 'GB'

  useEffect(() => {
    // this also calls rates
    earnActions.fetchEarnInstruments()
    earnActions.fetchRewardsBalance()
    earnActions.fetchStakingBalance()
    earnActions.fetchActiveRewardsBalance()
    earnActions.fetchEDDStatus()
    earnActions.fetchInterestEligible()
    earnActions.fetchStakingEligible()
    earnActions.fetchActiveRewardsEligible()

    if (!hasViewedOnboarding) {
      modalActions.showModal(ModalName.EARN_ONBOARDING, { origin: 'EarnPage' })
    }

    return () => {
      earnActions.setSearchValue({ value: '' })
      earnActions.setEarnTab({ tab: 'All' })
    }
  }, [])

  useEffect(() => {
    checkUserData()
  }, [data])

  const renderComponent = () => {
    if (error) {
      return (
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='copy.oops.message'
            defaultMessage='Oops. Something went wrong. Please refresh and try again.'
          />
        </Text>
      )
    }

    if (!data || isLoading || isNotAsked) {
      return <Loading />
    }

    const {
      activeRewardsRates,
      earnEDDStatus,
      interestRates,
      interestRatesArray,
      stakingRates,
      userData
    } = data

    return (
      <>
        {isUserFromUK && (
          <Text weight={500} size='14px' italic style={{ marginBottom: 16 }}>
            APYs are always indicative based on past performance and are not guaranteed. Find out
            more about Staking and Rewards as well as the risks{' '}
            <Link
              size='14px'
              href='https://support.blockchain.com/hc/en-us/articles/10857163796380-Staking-and-Rewards-what-are-the-risks'
              target='_blank'
            >
              here
            </Link>
            .
          </Text>
        )}
        <Table
          activeRewardsRates={activeRewardsRates}
          earnEDDStatus={earnEDDStatus}
          interestRates={interestRates}
          interestRatesArray={interestRatesArray}
          isGoldTier={isGoldTier}
          stakingRates={stakingRates}
          userData={userData}
        />
      </>
    )
  }

  return (
    <CustomSceneWrapper $isGoldTier={isGoldTier}>
      <EarnHeader />
      <Learn />
      <Message />
      <EarnContainer>
        {!isGoldTier && <Overlay />}
        <EarnFilter
          earnTab={earnTab}
          handleAssetClick={handleAssetClick}
          handleHistoryClick={handleHistoryClick}
          handleSearch={handleSearch}
          handleTabClick={handleTabClick}
          showAvailableAssets={showAvailableAssets}
        />
        {renderComponent()}
      </EarnContainer>
    </CustomSceneWrapper>
  )
}

export default Earn
