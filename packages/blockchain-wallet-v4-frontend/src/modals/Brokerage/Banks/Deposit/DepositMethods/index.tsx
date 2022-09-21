import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
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
  const addNew = useSelector((state: RootState) => state.components.brokerage.addNew)

  useEffect(() => {
    if (fiatCurrency) {
      dispatch(actions.components.buySell.fetchFiatEligible(fiatCurrency))
      dispatch(actions.components.brokerage.fetchBankTransferAccounts())
    }

    dispatch(actions.components.brokerage.setupBankTransferProvider())

    if (fiatCurrency) {
      dispatch(actions.components.buySell.fetchPaymentMethods(fiatCurrency))
    }
  }, [dispatch, fiatCurrency])

  const errorCallback = useCallback(() => {
    dispatch(actions.components.brokerage.fetchBankTransferAccounts())
  }, [dispatch])

  const addBankCallback = useCallback(() => {
    /* If I'm on the deposit method screen and I came from the user
        clicking the "add new" button I want to show the add bank 
        modal else I want to go to the enter amount screen
    */
    if (addNew && data) {
      dispatch(
        actions.components.brokerage.showModal({
          modalType: `ADD_BANK_${data.bankCredentials.partner}_MODAL`,
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
    } else {
      dispatch(
        actions.components.brokerage.setDWStep({
          dwStep: BankDWStepType.ENTER_AMOUNT
        })
      )
    }
  }, [addNew, data, dispatch])

  if (error)
    return <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />

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
