import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { FrequencyScreen } from 'components/Flyout'
import { SBOrderType } from 'core/types'
import { actions, selectors } from 'data'
import { getBaseAmount } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { RecurringBuyPeriods, RecurringBuyStepType } from 'data/types'

import { Props as _P } from '..'
import getData from './selectors'

const Frequency = ({ close, data, order, recurringBuyActions }: Props) => {
  useEffect(() => {
    if (!Remote.Success.is(data)) {
      recurringBuyActions.fetchPaymentInfo()
    }
  }, [data])
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  const setPeriod = (period: RecurringBuyPeriods) => {
    recurringBuyActions.setPeriod(period)
    recurringBuyActions.setStep({ step: RecurringBuyStepType.CHECKOUT_CONFIRM })
  }

  return data.cata({
    Failure: (error) => <>{error}</>,
    Loading: () => <></>,
    NotAsked: () => <></>,
    Success: (val) => (
      <>
        {order.paymentType ? (
          <FrequencyScreen
            method={order.paymentType}
            headerAction={close}
            headerMode='back'
            paymentInfo={val.paymentInfo}
            setPeriod={setPeriod}
          >
            <FormattedMessage
              id='modals.recurringbuys.get_started.buy_amount_of_currency'
              defaultMessage='Buy {amount} of {currency}'
              values={{ amount, currency }}
            />
          </FrequencyScreen>
        ) : (
          <></>
        )}
      </>
    )
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  order: selectors.components.simpleBuy.getSBOrder(state) as SBOrderType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Frequency)
