import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { FrequencyScreen } from 'components/Flyout'
import { SBOrderType } from 'core/types'
import { actions, selectors } from 'data'
import { getBaseAmount } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { RecurringBuyPeriods, RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'

const Frequency = ({ close, order, recurringBuyActions }: Props) => {
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  const setPeriod = (period: RecurringBuyPeriods) => {
    recurringBuyActions.setPeriod(period)
    recurringBuyActions.setStep({ step: RecurringBuyStepType.CHECKOUT_CONFIRM })
  }

  return (
    <FrequencyScreen headerAction={close} headerMode='back' setPeriod={setPeriod}>
      <FormattedMessage
        id='modals.recurringbuys.get_started.buy_amount_of_currency'
        defaultMessage='Buy {amount} of {currency}'
        values={{ amount, currency }}
      />
    </FrequencyScreen>
  )
}

const mapStateToProps = (state: RootState) => ({
  order: selectors.components.simpleBuy.getSBOrder(state) as SBOrderType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Frequency)
