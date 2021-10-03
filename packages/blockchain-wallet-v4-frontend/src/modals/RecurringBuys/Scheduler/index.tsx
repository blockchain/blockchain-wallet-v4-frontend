import React, { useEffect } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit'

import { SBPaymentMethodType } from 'core/types'
import { actions, selectors } from 'data'
import { RecurringBuyPeriods } from 'data/types'

import Success from './template.success'

const SchedulerContainer = (props: Props) => {
  const dispatch = useDispatch()
  const { isAvailableMethod } = props
  useEffect(() => {
    if (!props.isAvailableMethod) {
      dispatch(actions.form.change('simpleBuyCheckout', 'period', RecurringBuyPeriods.ONE_TIME))
    }
  }, [isAvailableMethod])

  return <Success {...props} />
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  availableMethods: selectors.components.recurringBuy.availableMethods(state),
  hasAvailablePeriods: selectors.components.recurringBuy.hasAvailablePeriods(ownProps.method)(
    state
  ),
  isAvailableMethod: selectors.components.recurringBuy.isAvailableMethod(
    ownProps.period,
    ownProps.method
  )(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  children: React.ReactNode
  method?: SBPaymentMethodType
  onClick: () => void
  period: RecurringBuyPeriods
}
export type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(SchedulerContainer)
