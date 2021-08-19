import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutHeader,
  OptionRightActionRow,
  Text
} from 'blockchain-info-components'
import { SBOrderType } from 'core/types'
import { actions, selectors } from 'data'
import { getBaseAmount } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { RecurringBuyPeriods, RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'
import { getPeriodSubTitleText, getPeriodTitleText } from './model'

const Frequency = ({ close, order, recurringBuyActions }: Props) => {
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  // ONE_TIME is not a recurring buy option so take it out before displaying
  const periods = Object.values(RecurringBuyPeriods).filter(
    (p) => p !== RecurringBuyPeriods.ONE_TIME
  )
  const setPeriod = (period: RecurringBuyPeriods) => () => {
    recurringBuyActions.setPeriod(period)
    recurringBuyActions.setStep({ step: RecurringBuyStepType.CHECKOUT_CONFIRM })
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='closeRecurringBuyModalFrequencyStep' mode='back' onClick={close}>
        <FormattedMessage
          id='modals.recurringbuys.get_started.buy_amount_of_currency'
          defaultMessage='Buy {amount} of {currency}'
          values={{ amount, currency }}
        />
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        {periods.map((period) => (
          <OptionRightActionRow key={period} onClick={setPeriod(period)}>
            <>
              <Text weight={600} size='16px' color='grey900'>
                {getPeriodTitleText(period)}
              </Text>
              <Text weight={500} size='14px' color='grey600'>
                {getPeriodSubTitleText(period)}
              </Text>
            </>
          </OptionRightActionRow>
        ))}
      </FlyoutContent>
    </FlyoutContainer>
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
