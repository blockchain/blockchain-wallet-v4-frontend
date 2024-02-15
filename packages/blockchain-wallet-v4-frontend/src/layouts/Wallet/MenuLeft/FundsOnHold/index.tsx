import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCurrency } from '@core/redux/settings/selectors'
import WithdrawalLockHold from 'components/Brokerage/WithdrawalLockHold'
import { modals } from 'data/actions'
import { withdraw } from 'data/components/actions'
import { getWithdrawalLocks } from 'data/components/withdraw/selectors'
import { ModalName, WithdrawStepEnum } from 'data/types'
import { useRemote } from 'hooks'

export const FundsOnHoldContainer = () => {
  const { data, hasError, isLoading, isNotAsked } = useRemote(getWithdrawalLocks)

  const { data: walletCurrency } = useSelector(getCurrency)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(withdraw.fetchWithdrawalLock({ currency: walletCurrency }))
  }, [walletCurrency])

  const handleClick = useCallback(() => {
    dispatch(
      modals.showModal(ModalName.CUSTODY_WITHDRAW_MODAL, {
        origin: 'SideNav'
      })
    )
    dispatch(withdraw.setStep({ step: WithdrawStepEnum.ON_HOLD }))
  }, [])

  if (isLoading || isNotAsked || !data || hasError) return null

  return (
    <WithdrawalLockHold
      amount={data.totalLocked.amount}
      currency={data.totalLocked.currency}
      handleClick={handleClick}
      mode='flyout'
    />
  )
}

export default FundsOnHoldContainer
