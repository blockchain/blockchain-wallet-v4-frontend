import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { convertStandardToBase } from 'data/components/exchange/services'
import { BrokerageTxFormValuesType } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../template.loading'
import Success from './DepositConfirm'

const DepositMethods = ({ handleClose }: Props) => {
  const dispatch = useDispatch()

  const defaultMethod = useSelector(selectors.components.brokerage.getAccount)
  const formValues = useSelector(
    selectors.form.getFormValues('brokerageTx')
  ) as BrokerageTxFormValuesType

  const { data, hasError, isLoading, isNotAsked } = useRemote(
    selectors.components.brokerage.getDepositTerms
  )

  useEffect(() => {
    dispatch(actions.components.send.getLockRule)
    if (formValues?.currency && defaultMethod) {
      dispatch(
        actions.components.brokerage.fetchDepositTerms({
          amount: {
            symbol: formValues.currency,
            value: String(convertStandardToBase('FIAT', formValues.amount))
          },
          paymentMethodId: defaultMethod.id
        })
      )
    }
  }, [])

  if (isLoading || isNotAsked) return <Loading />
  if (hasError) {
    return <FlyoutOopsError action='close' data-e2e='depositTryAgain' handler={handleClose} />
  }

  return <Success depositTerms={data} defaultMethod={defaultMethod} formValues={formValues} />
}

export type Props = {
  handleClose: () => void
}

export default DepositMethods
