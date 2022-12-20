import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { ExtractSuccess } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { convertStandardToBase } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'
import { BrokerageTxFormValuesType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const DepositMethods = (props: Props) => {
  useEffect(() => {
    props.sendActions.getLockRule()
    if (props.formValues?.currency && props.defaultMethod) {
      props.brokerageActions.fetchDepositTerms({
        amount: {
          symbol: props.formValues.currency,
          value: String(convertStandardToBase('FIAT', props.formValues.amount))
        },
        paymentMethodId: props.defaultMethod.id
      })
    }
  }, [])

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='close' data-e2e='depositTryAgain' handler={props.handleClose} />
    ),
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...val} {...props} />
  })
}

const mapStateToProps = (state: RootState) => ({
  availableToTradeWithdraw: selectors.core.walletOptions
    .getFeatureFlagAvailableToTradeWithdraw(state)
    .getOrElse(false) as boolean,
  data: getData(state),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  fiatCurrency: selectors.core.settings.getCurrency(state),
  formValues: selectors.form.getFormValues('brokerageTx')(state) as BrokerageTxFormValuesType
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

export type OwnProps = {
  handleClose: () => void
}
const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositMethods)
