import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  CoinType,
  EarnEDDStatus,
  EarnRatesType,
  RemoteDataType,
  RewardsRatesType
} from '@core/types'
import { actions } from 'data'
import { Analytics, EarnProductsType, UserDataType } from 'data/types'
import { useRemote } from 'hooks'
import { useMedia } from 'services/styles'

import Loading from '../Earn.loading.template'
import EmptyState from './EmptyState'
import MobileRow from './MobileRow'
import SortableTable from './SortableTable'
import { getData } from './Table.selectors'
import { Wrapper } from './Table.styles'

const TableContainer = (props: Props) => {
  const { analyticsActions, earnActions } = props
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const isTabletL = useMedia('tabletL')

  if (error) return null
  if (isLoading || isNotAsked || !data) return <Loading />

  const { activeRewardsAccountBalance, sortedInstruments, stakingAccountBalance } = data

  const handleClick = (coin: CoinType, product: EarnProductsType) => {
    const {
      WALLET_ACTIVE_REWARDS_DETAIL_CLICKED,
      WALLET_ACTIVE_REWARDS_WARNING_CONTINUE_CLICKED,
      WALLET_REWARDS_DETAIL_CLICKED,
      WALLET_STAKING_DETAIL_CLICKED,
      WALLET_STAKING_WARNING_CONTINUE_CLICKED
    } = Analytics

    switch (product) {
      case 'Staking': {
        const balance = stakingAccountBalance[coin]?.balance
        const hasBalance = balance && Number(balance) > 0
        analyticsActions.trackEvent({
          key: hasBalance ? WALLET_STAKING_DETAIL_CLICKED : WALLET_STAKING_WARNING_CONTINUE_CLICKED,
          properties: { currency: coin }
        })
        earnActions.showStakingModal({ coin, step: hasBalance ? 'ACCOUNT_SUMMARY' : 'WARNING' })
        break
      }
      case 'Active': {
        const balance = activeRewardsAccountBalance[coin]?.balance
        const hasBalance = balance && Number(balance) > 0
        analyticsActions.trackEvent({
          key: hasBalance
            ? WALLET_ACTIVE_REWARDS_DETAIL_CLICKED
            : WALLET_ACTIVE_REWARDS_WARNING_CONTINUE_CLICKED,
          properties: { currency: coin }
        })
        earnActions.showActiveRewardsModal({
          coin,
          step: hasBalance ? 'ACCOUNT_SUMMARY' : 'WARNING'
        })
        break
      }
      case 'Passive':
      default: {
        analyticsActions.trackEvent({
          key: WALLET_REWARDS_DETAIL_CLICKED,
          properties: { currency: coin }
        })
        earnActions.showInterestModal({ coin, step: 'ACCOUNT_SUMMARY' })
        break
      }
    }
  }

  return (
    <Wrapper>
      {isTabletL ? (
        <>
          {sortedInstruments.map(({ coin, product }) => {
            return window.coins[coin] ? (
              <MobileRow
                {...data}
                {...props}
                coin={coin}
                handleClick={handleClick}
                product={product}
                key={coin + product}
              />
            ) : null
          })}
        </>
      ) : (
        <SortableTable {...data} {...props} handleClick={handleClick} />
      )}
      {sortedInstruments.length === 0 && <EmptyState />}
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type OwnPropsType = {
  activeRewardsRates: EarnRatesType
  earnEDDStatus: EarnEDDStatus
  interestRates: RewardsRatesType
  interestRatesArray: Array<number>
  isGoldTier: boolean
  stakingRates: EarnRatesType
  userData: UserDataType
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

export type Props = OwnPropsType & ConnectedProps<typeof connector>

export default connector(TableContainer)
