import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Remote } from '@core'
import { WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { custodial } from 'data/actions'
import { fetchBankTransferAccounts } from 'data/components/brokerage/slice'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'

import WithdrawLoading from '../WithdrawLoading'
import getData from './selectors'
import Success from './template.success'

const BankPicker = ({ fiatCurrency, handleClose }: Props) => {
  const dispatch = useDispatch()

  const { data, error, isLoading, isNotAsked } = useRemote((state: RootState) =>
    getData(state, { fiatCurrency })
  )

  useEffect(() => {
    if (!Remote.Success.is(data)) {
      dispatch(custodial.fetchCustodialBeneficiaries({ currency: fiatCurrency }))
      dispatch(fetchBankTransferAccounts())
    }
  }, [])

  if (error)
    return <FlyoutOopsError action='close' data-e2e='withdrawReload' handler={handleClose} />
  if (!data || isLoading || isNotAsked) return <WithdrawLoading />
  return (
    <Success
      fiatCurrency={fiatCurrency}
      bankTransferAccounts={data.bankTransferAccounts}
      beneficiaries={data.beneficiaries}
      defaultMethod={data.defaultMethod}
    />
  )
}

export type BankPickerProps = {
  fiatCurrency: WalletFiatType
}

type Props = BankPickerProps & { handleClose: () => void }

export default BankPicker
