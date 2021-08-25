import React, { useEffect } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'

import { SBPaymentMethodType } from 'core/types'
import { actions, selectors } from 'data'
import { RecurringBuyPeriods } from 'data/types'

import Success from './template.success'

const SchedulerContainer = (props: Props) => {
  const dispatch = useDispatch()
  const { method } = props

  useEffect(() => {
    if (!props.availableMethod) {
      dispatch(actions.form.change('simpleBuyCheckout', 'period', RecurringBuyPeriods.ONE_TIME))
    }
  }, [method, props.availableMethod])

  if (props.availableMethod) {
    return <Success {...props} />
  }

  return null
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  availableMethod: selectors.components.recurringBuy.isAvailableMethod(
    ownProps.period,
    ownProps.method
  )(state)
})

const connector = connect(mapStateToProps)

type OwnProps = {
  children: React.ReactNode
  method?: SBPaymentMethodType
  onClick: () => void
  period: RecurringBuyPeriods
}
export type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(SchedulerContainer)
