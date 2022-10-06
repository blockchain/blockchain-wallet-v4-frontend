import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { CoinType, FiatType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { EarnStepMetaData, ModalName, StakingStep } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import AccountSummary from './AccountSummary'
import DepositForm from './DepositForm'
import DepositSuccess from './DepositSuccess'
import Warning from './Warning'

const Staking = ({
  close,
  coin,
  fetchInterestEDDStatus,
  position,
  step,
  total,
  userClickedOutside,
  walletCurrency
}: Props) => {
  const [show, setShow] = useState<boolean>(false)
  const [showSupply, setShowSupply] = useState<boolean>(false)

  useEffect(() => {
    setShow(true)
    fetchInterestEDDStatus()
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close(ModalName.STAKING_MODAL)
    }, duration)
  }

  return (
    <Flyout
      position={position}
      isOpen={show}
      userClickedOutside={userClickedOutside}
      onClose={handleClose}
      data-e2e='interestModal'
      total={total}
    >
      {step.name === 'WARNING' && (
        <FlyoutChild>
          <Warning handleClose={handleClose} coin={coin} />
        </FlyoutChild>
      )}
      {step.name === 'DEPOSIT' && (
        <FlyoutChild>
          <DepositForm coin={coin} setShowSupply={setShowSupply} walletCurrency={walletCurrency} />
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
            walletCurrency={walletCurrency}
            showSupply={showSupply}
          />
        </FlyoutChild>
      )}
    </Flyout>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  coin: selectors.components.interest.getCoinType(state),
  step: selectors.components.interest.getStakingStep(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInterestEDDStatus: () => dispatch(actions.components.interest.fetchEDDStatus()),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  coin: CoinType
  step: {
    data: EarnStepMetaData
    name: StakingStep
  }
  walletCurrency: FiatType
}

type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(modalEnhancer(ModalName.STAKING_MODAL, { transition: duration }), connector)

export default enhance(Staking)
