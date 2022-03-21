import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { BSPaymentMethodType, BSPaymentTypes, RemoteDataType } from '@core/types'
import DataError from 'components/DataError'
import { FrequencyScreen } from 'components/Flyout/RecurringBuy'
import { actions, model } from 'data'
import { RootState } from 'data/rootReducer'
import { RecurringBuyOrigins, RecurringBuyPeriods } from 'data/types'
import { buyPaymentMethodSelectedPaymentTypeDictionary } from 'middleware/analyticsMiddleware/utils'

import { Loading, LoadingTextEnum } from '../../components'
import getData from './selectors'

const { FORM_BS_CHECKOUT } = model.components.buySell

class Frequency extends PureComponent<Props> {
  componentDidMount() {
    this.props.recurringBuyActions.fetchPaymentInfo()
  }

  handleFrequencySelection = (period: RecurringBuyPeriods) => {
    this.props.formActions.change(FORM_BS_CHECKOUT, 'period', period)
    this.props.backToEnterAmount()
    this.props.recurringBuyActions.setPeriod({
      origin: RecurringBuyOrigins.SIMPLE_BUY_FREQUENCY_SCREEN,
      period
    })
  }

  render() {
    return this.props.data.cata({
      Failure: () => <DataError message={{ message: 'RECURRING_BUY_PERIOD_FETCH' }} />,
      Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
      NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
      Success: (val) => {
        const method = (this.props.method && this.props.method.type) || val.defaultMethod?.type
        if (method) {
          return (
            <FrequencyScreen
              headerAction={this.props.backToEnterAmount}
              headerMode='back'
              method={
                buyPaymentMethodSelectedPaymentTypeDictionary(method) as unknown as BSPaymentTypes
              }
              paymentInfo={val.paymentInfo}
              setPeriod={this.handleFrequencySelection}
            />
          )
        }
        return null
      }
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  backToEnterAmount: () => void
  handleClose: () => void
  method?: BSPaymentMethodType
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Frequency)
