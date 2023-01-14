import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import { AddBankStepType, BankDWStepType, BrokerageModalOriginType } from 'data/types'
import { useRemote } from 'hooks'

import { Loading, LoadingTextEnum } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'

type Props = {
  fiatCurrency: WalletFiatType
  handleClose: () => void
}

const DepositMethods = ({ fiatCurrency, handleClose }: Props) => {
  const dispatch = useDispatch()
  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    if (fiatCurrency) {
      dispatch(actions.components.buySell.fetchPaymentMethods(fiatCurrency))
    }
  }, [dispatch, fiatCurrency])

  const errorCallback = useCallback(() => {
    dispatch(actions.components.brokerage.fetchBankTransferAccounts())
  }, [dispatch])

  const addBankCallback = useCallback(() => {
    dispatch(
      actions.components.brokerage.showModal({
        modalType: fiatCurrency === 'USD' ? `ADD_BANK_PLAID_MODAL` : 'ADD_BANK_YAPILY_MODAL',
        origin: BrokerageModalOriginType.ADD_BANK_DEPOSIT
      })
    )
    dispatch(
      actions.components.brokerage.setAddBankStep({
        addBankStep: AddBankStepType.ADD_BANK
      })
    )
    dispatch(
      actions.components.brokerage.setDWStep({
        dwStep: BankDWStepType.ENTER_AMOUNT
      })
    )
  }, [dispatch, fiatCurrency])

  if (error) {
    return <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />
  }

  if (isLoading || isNotAsked || !data) return <Loading text={LoadingTextEnum.LOADING} />

  return (
    <Success
      handleClose={handleClose}
      paymentMethods={data.paymentMethods}
      addBankCallback={addBankCallback}
    />
  )
}

export default DepositMethods
