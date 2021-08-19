import React, { useCallback } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { SBOrderType } from 'core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'
import Success from './template.success'

const GetStartedContainer = (props: Props) => {
  const nextStep = useCallback(
    () =>
      props.recurringBuyActions.setStep({
        step: RecurringBuyStepType.FREQUENCY
      }),
    [RecurringBuyStepType.FREQUENCY]
  )

  return <Success nextStep={nextStep} {...props} />
}

const mapStateToProps = (state: RootState) => ({
  order: selectors.components.simpleBuy.getSBOrder(state) as SBOrderType
})

const connector = connect(mapStateToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(GetStartedContainer)
