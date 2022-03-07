import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Loading, LoadingTextEnum } from 'blockchain-wallet-v4-frontend/src/modals/components'
import { bindActionCreators, Dispatch } from 'redux'

import { ExtractSuccess } from '@core/types'
import { OnHold } from 'components/Flyout/Brokerage'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BrokerageTxFormValuesType } from 'data/types'

import { getData } from './selectors'

const DepositMethods = (props: Props) => {
  useEffect(() => {
    props.withdrawActions.fetchWithdrawalLock({
      currency: props.tradingCurrencies?.defaultWalletCurrency
    })
  }, [props.tradingCurrencies?.defaultWalletCurrency])

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='close' data-e2e='depositTryAgain' handler={props.handleClose} />
    ),
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => (
      <OnHold
        fiatCurrency={val.withdrawalLocks.totalLocked.currency}
        handleHeaderClick={props.handleClose}
        locks={val.withdrawalLocks.locks}
        totalLockedAmount={val.withdrawalLocks.totalLocked.amount}
      />
    )
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  formValues: selectors.form.getFormValues('brokerageTx')(state) as BrokerageTxFormValuesType,
  tradingCurrencies: selectors.modules.profile.getUserCurrencies(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

export type OwnProps = {
  handleClose: () => void
}
const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositMethods)
