import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { brokerage, buySell } from 'data/components/actions'
import { getTradingCurrency } from 'data/modules/profile/selectors'
import { useRemote } from 'hooks'

import getData from './selectors'
import Loading from './template.loading'
import Success from './template.success'

const LinkedBanks = () => {
  const { data, hasError, isLoading, isNotAsked } = useRemote(getData)
  const tradingCurrency = useSelector(getTradingCurrency).getOrElse('USD')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(brokerage.fetchBankTransferAccounts())
    dispatch(buySell.fetchPaymentMethods(tradingCurrency))
  }, [])

  if (isLoading || isNotAsked) return <Loading />
  if (hasError || !data) return null
  return <Success bankAccounts={data.bankAccounts} paymentMethods={data.paymentMethods} />
}

export default LinkedBanks
