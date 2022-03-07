import React, { useCallback } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Exchange } from '@core'
import { BSOrderType } from '@core/types'
import { GettingStarted } from 'components/Flyout/RecurringBuy'
import { selectors } from 'data'
import { getCounterAmount, getCounterCurrency } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { RecurringBuyOrigins, RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'

const GetStartedContainer = ({ close, order, recurringBuyActions }: Props) => {
  const nextStep = useCallback(() => {
    recurringBuyActions.setStep({
      step: RecurringBuyStepType.FREQUENCY
    })
    recurringBuyActions.viewed()
  }, [RecurringBuyStepType.FREQUENCY])
  const closeCallback = useCallback(() => {
    close()
    recurringBuyActions.suggestionSkipped(RecurringBuyOrigins.BUY_CONFIRMATION)
  }, [])

  const { outputCurrency } = order
  const amount = `${Exchange.getSymbol(getCounterCurrency(order))}${getCounterAmount(order)}`
  const gettingStartedProps = { amount, close: closeCallback, nextStep, outputCurrency }

  return <GettingStarted {...gettingStartedProps} />
}

const mapStateToProps = (state: RootState) => ({
  order: selectors.components.buySell.getBSOrder(state) as BSOrderType
})

const connector = connect(mapStateToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(GetStartedContainer)
