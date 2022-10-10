import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Remote } from '@core'
import { WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import {
  AddBankStepType,
  BankDWStepType,
  BrokerageModalOriginType,
  ModalName,
  WithdrawStepEnum
} from 'data/types'
import { useRemote } from 'hooks'

import getData from './selectors'
import Loading from './template.loading'
import Success from './template.success'

const WithdrawalMethods: Props = ({ fiatCurrency, handleClose }) => {
  const dispatch = useDispatch()
  const { data, hasError, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    if (fiatCurrency && !Remote.Success.is(data)) {
      dispatch(actions.components.buySell.fetchFiatEligible(fiatCurrency))
      dispatch(actions.components.buySell.fetchPaymentMethods(fiatCurrency))
      dispatch(actions.components.brokerage.fetchBankTransferAccounts())
    }
  }, [dispatch, fiatCurrency])

  const errorCallback = useCallback(() => {
    dispatch(actions.components.brokerage.fetchBankTransferAccounts())
  }, [dispatch])

  const bankTransferCallback = useCallback(() => {
    const ACHProvider = data?.plaidEnabled
      ? ModalName.ADD_BANK_PLAID_MODAL
      : ModalName.ADD_BANK_YODLEE_MODAL
    dispatch(actions.components.brokerage.setupBankTransferProvider())
    dispatch(
      actions.components.brokerage.showModal({
        modalType: fiatCurrency === 'USD' ? ACHProvider : ModalName.ADD_BANK_YAPILY_MODAL,
        origin: BrokerageModalOriginType.ADD_BANK_WITHDRAW
      })
    )
    dispatch(
      actions.components.brokerage.setAddBankStep({
        addBankStep: AddBankStepType.ADD_BANK
      })
    )
    dispatch(
      actions.components.withdraw.setStep({
        fiatCurrency,
        step: WithdrawStepEnum.ENTER_AMOUNT
      })
    )
  }, [data?.plaidEnabled, dispatch, fiatCurrency])

  const bankWireCallback = useCallback(() => {
    if (data?.userData.tiers.current === 2) {
      dispatch(
        actions.components.brokerage.showModal({
          modalType: 'BANK_DEPOSIT_MODAL',
          origin: BrokerageModalOriginType.WITHDRAWAL
        })
      )
      dispatch(actions.components.buySell.setFiatCurrency(fiatCurrency))
      // dispatch(actions.components.brokerage.setFiatCurrency(fiatCurrency))
      // TODO: implement Withdrawal version of wire instructions so we
      // have more control over look/feel/interactions instead of piggy packing
      // off of the deposit wire instructions
      dispatch(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.WIRE_INSTRUCTIONS
        })
      )
    } else {
      dispatch(
        actions.components.buySell.setStep({
          step: 'KYC_REQUIRED'
        })
      )
    }

    dispatch(
      actions.components.withdraw.setStep({
        fiatCurrency,
        step: WithdrawStepEnum.ENTER_AMOUNT
      })
    )
  }, [data?.userData.tiers, dispatch, fiatCurrency])

  if (hasError)
    return <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />
  if (!data || isLoading || isNotAsked) return <Loading />

  return (
    <Success
      bankTransferCallback={bankTransferCallback}
      bankWireCallback={bankWireCallback}
      handleClose={handleClose}
      paymentMethods={data.paymentMethods}
    />
  )
}

type Props = React.FC<{
  fiatCurrency: WalletFiatType
  handleClose: () => void
}>

export default WithdrawalMethods
