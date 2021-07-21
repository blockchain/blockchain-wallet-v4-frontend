import React, { useCallback } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { FlyoutHeader } from 'blockchain-info-components'
import { RootState } from 'data/rootReducer'
import { actions, selectors } from 'data'
import { SBOrderType } from 'core/types'

import { getBaseAmount } from 'data/components/simpleBuy/model'
import { RecurringBuyPeriods, RecurringBuyStepType } from 'data/types'

import { getPeriodTitleText, getPeriodSubTitleText, OptionRightActionRow } from './model'
import { Props as _P } from '..'

const Frequency = ({ close, order, recurringBuyActions }: Props) => {
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  // ONE_TIME is not a recurring buy option so take it out before displaying
  const periods = Object.values(RecurringBuyPeriods).filter((p) => p !== RecurringBuyPeriods.ONE_TIME)
  const setPeriod = (period: RecurringBuyPeriods) => () => {
    recurringBuyActions.setPeriod(period)
    recurringBuyActions.setStep({ step: RecurringBuyStepType.CHECKOUT_CONFIRM })
  }

  return (
    <>
      <FlyoutHeader
        data-e2e="closeRecurringBuyModalFrequencyStep"
        mode="back"
        onClick={close}
      >
        <FormattedMessage
          id='modals.recurringbuys.get_started.buy_amount_of_currency'
          defaultMessage='Buy {amount} of {currency}'
          values={{ amount, currency }} />
      </FlyoutHeader>
      {periods.map((period) => (
        <OptionRightActionRow
          key={period}
          onClick={setPeriod(period)}
        >
          <>
            {getPeriodTitleText(period)}
            {getPeriodSubTitleText(period)}
          </>
        </OptionRightActionRow>
      ))}
    </>
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
