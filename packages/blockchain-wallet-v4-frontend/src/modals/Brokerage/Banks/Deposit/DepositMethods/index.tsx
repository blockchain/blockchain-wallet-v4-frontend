import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { Loading, LoadingTextEnum } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'

const DepositMethods = (props) => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.buySellActions.fetchFiatEligible(props.fiatCurrency)
      props.brokerageActions.fetchBankTransferAccounts()
    }

    if (props.fiatCurrency) {
      props.buySellActions.fetchPaymentMethods(props.fiatCurrency)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.brokerageActions, props.buySellActions, props.fiatCurrency])

  const errorCallback = useCallback(() => {
    props.brokerageActions.fetchBankTransferAccounts()
  }, [props.brokerageActions])

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />
    ),
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => <Success {...val} {...props} />
  })
}

const mapStateToProps = (state: RootState) => ({
  addNew: state.components.brokerage.addNew,
  data: getData(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(DepositMethods)
