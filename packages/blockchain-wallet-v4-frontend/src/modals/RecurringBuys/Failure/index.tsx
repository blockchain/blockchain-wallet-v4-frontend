import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit'

import { actions, selectors } from 'data'
import { RecurringBuyStepType } from 'data/types'
import DataError from 'components/DataError'

const Failure = (props: Props) => {
  return (<DataError onClick={() => {
      props.recurringBuyActions.setStep({ step: RecurringBuyStepType.GET_STARTED })
  }} />)
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Failure)
