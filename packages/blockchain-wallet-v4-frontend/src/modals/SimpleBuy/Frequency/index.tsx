import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { RemoteDataType, SBPaymentMethodType } from 'blockchain-wallet-v4/src/types'
import { FrequencyScreen } from 'components/Flyout'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { RecurringBuyPeriods } from 'data/types'

import getData from './selectors'

class Frequency extends PureComponent<Props> {
  constructor(props) {
    super(props)
    this.handleFrequencySelection = this.handleFrequencySelection.bind(this)
  }

  componentDidMount() {
    this.props.recurringBuyActions.fetchPaymentInfo()
  }

  handleFrequencySelection = (period?: RecurringBuyPeriods) => {
    this.props.formActions.change('simpleBuyCheckout', 'period', period)
    this.props.backToEnterAmount()
  }

  render() {
    return this.props.data.cata({
      Failure: (error) => <></>,
      Loading: () => <></>,
      NotAsked: () => <></>,
      Success: (val) => {
        const method = (this.props.method && this.props.method.type) || val.defaultMethod?.type
        if (method) {
          return (
            <FrequencyScreen
              headerAction={this.props.backToEnterAmount}
              headerMode='back'
              method={method}
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
  formActions: bindActionCreators(actions.form, dispatch),
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  backToEnterAmount: () => void
  handleClose: () => void
  method?: SBPaymentMethodType
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Frequency)
