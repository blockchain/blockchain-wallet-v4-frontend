import React, { ChangeEvent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, EarnTabsType } from 'data/types'
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

const Earn = ({ analyticsActions, earnActions }) => {
  const [isGoldTier, setIsGoldTier] = useState<boolean>(true)
  const earnTab: EarnTabsType = useSelector((state: RootState) => state.components.interest.earnTab)
  const showAvailableAssets: boolean = useSelector(
    (state: RootState) => state.components.interest.showAvailableAssets
  )

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

  const handleTabClick = (tab: string) => {
    earnActions.setEarnTab({ tab })
  }

  const handleAssetClick = (status: boolean) => {
    earnActions.setShowAvailableAssets({ status })
  }

  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    earnActions.setSearchValue({ value: e.target.value })
  }, 800)

  useEffect(() => {
    earnActions.fetchEarnInstruments()
    earnActions.fetchInterestRates()
    earnActions.fetchRewardsBalance()
    earnActions.fetchStakingBalance()
    earnActions.fetchEDDStatus()
    earnActions.fetchInterestEligible()
    earnActions.fetchStakingEligible()

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

    const { earnEDDStatus, interestRates, interestRatesArray, stakingRates, userData } = data
    return (
      <Table
        earnEDDStatus={earnEDDStatus}
        interestRates={interestRates}
        interestRatesArray={interestRatesArray}
        isGoldTier={isGoldTier}
        stakingRates={stakingRates}
        userData={userData}
      />
    )
  }

  return (
    <CustomSceneWrapper $isGoldTier={isGoldTier}>
      <EarnHeader />
      <Learn />
      <Message isGoldTier={isGoldTier} />
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

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  idvActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  earnActions: typeof actions.components.interest
  idvActions: typeof actions.components.identityVerification
}

export type Props = ConnectedProps<typeof connector>

export default connector(Earn)
