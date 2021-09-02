import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { RecurringBuyDetails } from 'components/Flyout'
import { actions, selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'
import { RecurringBuyOrigins, RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'

const Success = ({ activeDetails, close: closeClick, removeClick }: Props) => {
  if (!activeDetails) return null
  const { id, nextPayment, paymentMethod, period } = activeDetails
  const detailProps = {
    closeClick,
    complete: false,
    crypto: activeDetails.destinationCurrency,
    currency: activeDetails.inputCurrency,
    id,
    nextPayment,
    paymentMethod,
    period,
    removeClick,
    standardAmount: convertBaseToStandard(activeDetails.inputCurrency, activeDetails.inputValue)
  }
  return <RecurringBuyDetails {...detailProps} />
}

const mapStateToProps = (state: RootState) => ({
  activeDetails: selectors.components.recurringBuy.getActive(state)
})

const mapDispatchToProps = (dispatch) => ({
  removeClick: () => {
    dispatch(
      actions.components.recurringBuy.setStep({
        origin: RecurringBuyOrigins.DETAILS_SCREEN,
        step: RecurringBuyStepType.REMOVE_CONFIRM
      })
    )
  }
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Success)
