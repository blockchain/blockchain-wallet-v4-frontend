import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BeneficiariesType, BSPaymentMethodsType } from '@core/types'
import { custodial } from 'data/actions'
import { brokerage, buySell } from 'data/components/actions'
import { getFiatCurrency } from 'data/components/withdraw/selectors'
import { useRemote } from 'hooks'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

type DataType = {
  beneficiaries: BeneficiariesType
  paymentMethods: BSPaymentMethodsType
}

const LinkedWireBanks = () => {
  const { data, hasError, isLoading, isNotAsked } = useRemote(getData)
  const fiatCurrency = useSelector(getFiatCurrency)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(custodial.fetchCustodialBeneficiaries({}))
    dispatch(brokerage.fetchBankTransferAccounts())
    dispatch(buySell.fetchPaymentMethods(fiatCurrency))
  }, [])

  if (isLoading) return <Loading />
  if (hasError || isNotAsked || !data) return null
  return <Success beneficiaries={data.beneficiaries} paymentMethods={data.paymentMethods} />
}

export default LinkedWireBanks
