import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { FiatType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import NoBalance from '../NoBalance'
import AccountSummary from './AccountSummary'
import DepositForm from './DepositForm'
import DepositSuccess from './DepositSuccess'
import Warning from './Warning'
import Withdrawal from './WithdrawalForm'
import WithdrawalRequested from './WithdrawalRequested'

const ActiveRewards = ({ close, position, total, userClickedOutside }: ModalPropsType) => {
  const dispatch = useDispatch()
  const earnActions = bindActionCreators(actions.components.interest, dispatch)
  const coin = useSelector((state: RootState) => selectors.components.interest.getCoinType(state))
  const step = useSelector((state: RootState) =>
    selectors.components.interest.getActiveRewardsStep(state)
  )
  const isActiveRewardsWithdrawalEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions
        .getActiveRewardsWithdrawalEnabled(state)
        .getOrElse(false) as boolean
  )
  const walletCurrency = useSelector(
    (state: RootState) => selectors.core.settings.getCurrency(state).getOrElse('USD') as FiatType
  )
  const [show, setShow] = useState<boolean>(false)
  const [showSupply, setShowSupply] = useState<boolean>(false)

  useEffect(() => {
    setShow(true)
    earnActions.fetchEDDStatus()
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close(ModalName.ACTIVE_REWARDS_MODAL)
    }, duration)
  }

  return (
    <Flyout
      position={position}
      isOpen={show}
      userClickedOutside={userClickedOutside}
      onClose={handleClose}
      data-e2e='activeRewardsModal'
      total={total}
    >
      {step.name === 'WARNING' && (
        <FlyoutChild>
          <Warning handleClose={handleClose} coin={coin} />
        </FlyoutChild>
      )}
      {step.name === 'NO_BALANCE' && (
        <FlyoutChild>
          <NoBalance handleClose={handleClose} walletCurrency={walletCurrency} />
        </FlyoutChild>
      )}
      {step.name === 'DEPOSIT' && (
        <FlyoutChild>
          <DepositForm coin={coin} />
        </FlyoutChild>
      )}
      {step.name === 'DEPOSIT_SUCCESS' && (
        <FlyoutChild>
          <DepositSuccess coin={coin} handleClose={handleClose} />
        </FlyoutChild>
      )}
      {step.name === 'ACCOUNT_SUMMARY' && (
        <FlyoutChild>
          <AccountSummary
            handleClose={handleClose}
            stepMetadata={step.data}
            coin={coin}
            showSupply={showSupply}
          />
        </FlyoutChild>
      )}
      {step.name === 'WITHDRAWAL' && isActiveRewardsWithdrawalEnabled && (
        <FlyoutChild>
          <Withdrawal handleClose={handleClose} />
        </FlyoutChild>
      )}
      {step.name === 'WITHDRAWAL_REQUESTED' && isActiveRewardsWithdrawalEnabled && (
        <FlyoutChild>
          <WithdrawalRequested coin={coin} handleClose={handleClose} />
        </FlyoutChild>
      )}
    </Flyout>
  )
}

const enhance = modalEnhancer(ModalName.ACTIVE_REWARDS_MODAL, { transition: duration })

export default enhance(ActiveRewards)
