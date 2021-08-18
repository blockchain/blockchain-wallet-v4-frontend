import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { RecurringBuyRemoveConfirm } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RecurringBuyRegisteredList, RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'

const Success = ({ activeDetails, close, goBack, removeClick }: Props) => {
  if (!activeDetails) return null
  return (
    <RecurringBuyRemoveConfirm
      goBack={goBack}
      close={close}
      activeDetails={activeDetails}
      removeClick={removeClick}
    />
  )
}

const mapStateToProps = (state: RootState) => ({
  activeDetails: selectors.components.recurringBuy.getActive(state)
})

const mapDispatchToProps = (dispatch) => ({
  goBack: () => {
    const step = { step: RecurringBuyStepType.DETAILS }
    dispatch(actions.components.recurringBuy.setStep(step))
  },
  removeClick: (id: RecurringBuyRegisteredList['id']) => {
    dispatch(actions.components.recurringBuy.removeRecurringBuy(id))
  }
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Success)
