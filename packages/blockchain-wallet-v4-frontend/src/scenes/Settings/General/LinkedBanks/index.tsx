import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BSPaymentMethodsType } from '@core/types'
import { brokerage, buySell } from 'data/components/actions'
import { getTradingCurrency } from 'data/modules/profile/selectors'
import { BankTransferAccountType } from 'data/types'
import { useRemote } from 'hooks'

import getData from './selectors'
import Loading from './template.loading'
import Success from './template.success'

type DataType = {
  bankAccounts: BankTransferAccountType[]
  paymentMethods: BSPaymentMethodsType
}

const LinkedBanks = () => {
  const { data, hasError, isLoading, isNotAsked } = useRemote(getData)
  const tradingCurrency = useSelector(getTradingCurrency).getOrElse('USD')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(brokerage.fetchBankTransferAccounts())
    dispatch(buySell.fetchPaymentMethods(tradingCurrency))
  }, [])

  if (hasError) return <></>
  if (isLoading || isNotAsked) return <Loading />
  if (!data) return <></>
  return <Success tradingCurrency={tradingCurrency} {...(data as DataType)} />
}

export default LinkedBanks
