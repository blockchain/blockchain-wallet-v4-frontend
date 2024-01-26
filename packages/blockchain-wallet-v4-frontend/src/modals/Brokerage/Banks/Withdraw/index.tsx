import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { getUserKYCState } from 'data/modules/profile/selectors'
import { ModalName, WithdrawStepEnum } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { BROKERAGE_INELIGIBLE } from '../../../components'
import Rejected from '../../../components/Rejected'
import { ModalPropsType } from '../../../types'
import BankPicker from './BankPicker'
import ConfirmWithdraw from './ConfirmWithdraw'
import Loading from './ConfirmWithdraw/template.loading'
import EnterAmount from './EnterAmount'
import OnHold from './OnHold'
import WithdrawalDetails from './WithdrawalDetails'
import WithdrawalMethods from './WithdrawalMethods'

const INELIGIBLE_ERROR = { message: BROKERAGE_INELIGIBLE }

const Withdraw = ({ close, position, total, userClickedOutside }: ModalPropsType) => {
  const beneficiary = useSelector(selectors.components.withdraw.getBeneficiary)
  const fiatCurrency = useSelector(selectors.components.withdraw.getFiatCurrency)
  const step = useSelector(selectors.components.withdraw.getStep)
  const kycState = useSelector(getUserKYCState).getOrElse('NONE')

  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close()
    }, duration)
  }

  const isUserRejectedOrExpired = kycState === 'REJECTED' || kycState === 'EXPIRED'
  if (isUserRejectedOrExpired) {
    return (
      <Flyout
        position={position}
        userClickedOutside={userClickedOutside}
        total={total}
        onClose={handleClose}
        isOpen={show}
        data-e2e='custodyWithdrawModal'
      >
        <Rejected handleClose={handleClose} />
      </Flyout>
    )
  }
  return (
    <Flyout
      position={position}
      userClickedOutside={userClickedOutside}
      total={total}
      onClose={handleClose}
      isOpen={show}
      data-e2e='custodyWithdrawModal'
    >
      <FlyoutChild>
        {step === WithdrawStepEnum.LOADING && <Loading />}
        {step === WithdrawStepEnum.ENTER_AMOUNT && (
          <EnterAmount
            fiatCurrency={fiatCurrency}
            beneficiary={beneficiary}
            handleClose={handleClose}
          />
        )}
        {step === WithdrawStepEnum.WITHDRAWAL_METHODS && (
          <WithdrawalMethods fiatCurrency={fiatCurrency} handleClose={handleClose} />
        )}
        {step === WithdrawStepEnum.BANK_PICKER && (
          <BankPicker
            fiatCurrency={fiatCurrency}
            beneficiary={beneficiary}
            handleClose={handleClose}
          />
        )}
        {step === WithdrawStepEnum.CONFIRM_WITHDRAW && (
          <ConfirmWithdraw
            beneficiary={beneficiary}
            fiatCurrency={fiatCurrency}
            handleClose={handleClose}
          />
        )}
        {step === WithdrawStepEnum.WITHDRAWAL_DETAILS && (
          <WithdrawalDetails fiatCurrency={fiatCurrency} handleClose={handleClose} />
        )}
        {step === WithdrawStepEnum.INELIGIBLE && <DataError message={INELIGIBLE_ERROR} />}
        {step === WithdrawStepEnum.ON_HOLD && <OnHold handleClose={handleClose} />}
      </FlyoutChild>
    </Flyout>
  )
}

export default ModalEnhancer(ModalName.CUSTODY_WITHDRAW_MODAL, { transition: duration })(Withdraw)
