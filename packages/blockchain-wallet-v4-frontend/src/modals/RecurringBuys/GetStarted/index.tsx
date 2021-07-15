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
import { SBOrderType } from 'core/types'
import { Props as _P } from '../'

const GetStartedContainer = (props: Props) => {
  return (
    <Success {...props} />
  )
}

const mapStateToProps = (state: RootState) => ({
  rbFormValues: selectors.form.getFormValues('recurringBuyScheduler')(state) as
    | { frequency: RecurringBuyPeriods }
    | undefined,
  order: selectors.components.simpleBuy.getSBOrder(state) as SBOrderType
})

const connector = connect(mapStateToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(GetStartedContainer)
