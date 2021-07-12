import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { OBEntityType, SBCheckoutFormValuesType, RecurringBuyPeriods } from 'data/types'

import { LoadingUpdating as Loading } from '../../components'
import { getData } from './selectors'
// import Failure from './template.error'
import Success from './template.success'

const GetStartedContainer = (props: Props) => {
  return (
    <>
      <>{props.rbFormValues?.frequency}</>
      <>{props.sbFormValues?.amount}</>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  rbFormValues: selectors.form.getFormValues('recurringBuyScheduler')(state) as
    | { frequency: RecurringBuyPeriods }
    | undefined,
  sbFormValues: selectors.form.getFormValues('simpleBuyCheckout')(state) as
    | SBCheckoutFormValuesType
    | undefined,
})

const connector = connect(mapStateToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(GetStartedContainer)
