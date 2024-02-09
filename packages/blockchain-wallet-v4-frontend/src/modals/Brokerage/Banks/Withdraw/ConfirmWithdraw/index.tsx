import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { BeneficiaryType, WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import { withdraw } from 'data/components/actions'
import { getFeeForCurrency } from 'data/components/withdraw/selectors'
import { RootState } from 'data/rootReducer'
import { WithdrawStepEnum } from 'data/types'
import { useRemote } from 'hooks'

import WithdrawLoading from '../WithdrawLoading'
import Success from './template.success'

const ConfirmWithdraw = ({ beneficiary, fiatCurrency }: ConfirmWithdrawProps) => {
  const dispatch = useDispatch()

  const { data, error, isLoading, isNotAsked } = useRemote((state: RootState) =>
    getFeeForCurrency(state, fiatCurrency)
  )

  useEffect(() => {
    if (isNotAsked) {
      dispatch(withdraw.fetchWithdrawalFees({}))
    }
  }, [])

  const onClickBack = () => {
    dispatch(
      actions.components.withdraw.setStep({
        beneficiary,
        fiatCurrency,
        step: WithdrawStepEnum.ENTER_AMOUNT
      })
    )
  }

  if (isLoading || isNotAsked || !data) return <WithdrawLoading />
  if (error)
    return <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={onClickBack} />

  return (
    <Success
      fees={data}
      beneficiary={beneficiary}
      fiatCurrency={fiatCurrency}
      onClickBack={onClickBack}
    />
  )
}

export type ConfirmWithdrawProps = {
  beneficiary?: BeneficiaryType
  fiatCurrency: WalletFiatType
}

export default ConfirmWithdraw
