import React from 'react'
import { useSelector } from 'react-redux'

import DataError from 'components/DataError'
import { getBankTransferAccounts } from 'data/components/brokerage/selectors'
import { getBuyQuote } from 'data/components/buySell/selectors'
import { useRemote } from 'hooks'

import Success from './Authorize.success'

const Authorize = ({ handleClose }: { handleClose: () => void }) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getBuyQuote)
  const bankAccounts = useSelector(getBankTransferAccounts).getOrElse([])

  if (error) return <DataError message={{ message: error }} />
  if (isLoading || isNotAsked || !data) return null
  return <Success bankAccounts={bankAccounts} quote={data} handleClose={handleClose} />
}

export default Authorize
