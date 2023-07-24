import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { getFormValues } from 'redux-form'

import { Remote } from '@core'
import { BSTransactionStateEnum, FiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BrokerageTxFormValuesType } from 'data/types'

import { Loading, LoadingTextEnum } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'
import TimedOut from './template.timedOut'

const DepositStatus = (props: Props) => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.buySellActions.fetchPaymentMethods(props.fiatCurrency)
      props.buySellActions.fetchFiatEligible(props.fiatCurrency)
      props.brokerageActions.fetchBankTransferAccounts()
    }
  }, [])

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='close' data-e2e='depositTryAgain' handler={props.handleClose} />
    ),
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) =>
      props.formValues?.order?.state === BSTransactionStateEnum.CLEARED ||
      props.formValues?.order?.state === BSTransactionStateEnum.COMPLETE ||
      props.formValues?.order?.state === BSTransactionStateEnum.COMPLETED ||
      props.formValues?.order?.state === BSTransactionStateEnum.MANUAL_REVIEW ? (
        <Success {...val} {...props} />
      ) : props.formValues?.retryTimeout ? (
        <TimedOut {...props} />
      ) : (
        <FlyoutOopsError action='close' data-e2e='depositTryAgain' handler={props.handleClose} />
      )
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state) || 'USD',
  formValues: getFormValues('brokerageTx')(state) as BrokerageTxFormValuesType
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}

export type FailurePropsType = {
  fiatCurrency: FiatType
}

export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositStatus)
