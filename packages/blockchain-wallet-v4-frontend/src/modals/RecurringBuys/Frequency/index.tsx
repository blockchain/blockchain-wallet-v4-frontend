import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BSOrderType, BSPaymentTypes } from '@core/types'
import DataError from 'components/DataError'
import { FrequencyScreen } from 'components/Flyout/RecurringBuy'
import { actions, selectors } from 'data'
import { getBaseAmount } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { RecurringBuyOrigins, RecurringBuyPeriods, RecurringBuyStepType } from 'data/types'
import { buyPaymentMethodSelectedPaymentTypeDictionary } from 'middleware/analyticsMiddleware/utils'

import { Loading, LoadingTextEnum } from '../../components'
import { Props as _P } from '..'
import getData from './selectors'

const Frequency = ({ data, order, recurringBuyActions }: Props) => {
  useEffect(() => {
    if (!Remote.Success.is(data)) {
      recurringBuyActions.fetchPaymentInfo()
    }
  }, [data])
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  const setPeriod = (period: RecurringBuyPeriods) => {
    recurringBuyActions.setPeriod({
      origin: RecurringBuyOrigins.RECURRING_BUYS_FREQUENCY_SCREEN,
      period
    })
    recurringBuyActions.setStep({ step: RecurringBuyStepType.CHECKOUT_CONFIRM })
  }
  const backToGetStarted = () => {
    recurringBuyActions.setStep({ step: RecurringBuyStepType.GET_STARTED })
  }

  return data.cata({
    Failure: () => <DataError message={{ message: 'RECURRING_BUY_PERIOD_FETCH' }} />,
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => (
      <>
        {order.paymentType ? (
          <FrequencyScreen
            method={
              buyPaymentMethodSelectedPaymentTypeDictionary(
                order.paymentType
              ) as unknown as BSPaymentTypes
            }
            headerAction={backToGetStarted}
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
        ) : null}
      </>
    )
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  order: selectors.components.buySell.getBSOrder(state) as BSOrderType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = _P & ConnectedProps<typeof connector>

export default connector(Frequency)
