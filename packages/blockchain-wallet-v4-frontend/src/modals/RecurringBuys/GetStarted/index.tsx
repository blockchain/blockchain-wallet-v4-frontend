import React, { useCallback } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Exchange } from 'blockchain-wallet-v4/src'
import { RecurringBuyGettingStarted } from 'components/Flyout'
import { SBOrderType } from 'core/types'
import { selectors } from 'data'
import { getCounterAmount, getCounterCurrency } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'

const GetStartedContainer = ({ close, order, recurringBuyActions }: Props) => {
  const nextStep = useCallback(
    () =>
      recurringBuyActions.setStep({
        step: RecurringBuyStepType.FREQUENCY
      }),
    [RecurringBuyStepType.FREQUENCY]
  )
  const { outputCurrency } = order
  const amount = `${Exchange.getSymbol(getCounterCurrency(order))}${getCounterAmount(order)}`
  const gettingStartedProps = { amount, close, nextStep, outputCurrency }

  return <RecurringBuyGettingStarted {...gettingStartedProps} />
}

const mapStateToProps = (state: RootState) => ({
  order: selectors.components.simpleBuy.getSBOrder(state) as SBOrderType
})

const connector = connect(mapStateToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(GetStartedContainer)
