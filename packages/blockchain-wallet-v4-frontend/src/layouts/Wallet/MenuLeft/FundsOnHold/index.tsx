import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { FiatType } from '@core/types'
import WithdrawalLockHold from 'components/Brokerage/WithdrawalLockHold'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { WithdrawStepEnum } from 'data/types'

import getData from './selectors'

export const FundsOnHoldContainer = (props: Props) => {
  useEffect(() => {
    props.withdrawActions.fetchWithdrawalLock(props.walletCurrency)
  }, [props.walletCurrency])

  const handleClick = useCallback(() => {
    props.modalActions.showModal('CUSTODY_WITHDRAW_MODAL', {
      origin: 'SideNav'
    })
    props.withdrawActions.setStep({
      step: WithdrawStepEnum.ON_HOLD
    })
  }, [])

  return props.data.cata({
    Failure: () => null,
    Loading: () => null,
    NotAsked: () => null,
    Success: (val) => (
      <WithdrawalLockHold
        {...val.withdrawalLocks.totalLocked}
        handleClick={handleClick}
        mode='flyout'
      />
    )
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  tradingCurrencies: selectors.modules.profile.getUserCurrencies(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD') as FiatType
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>
export type Props = ConnectedProps<typeof connector>

export default connector(FundsOnHoldContainer)
