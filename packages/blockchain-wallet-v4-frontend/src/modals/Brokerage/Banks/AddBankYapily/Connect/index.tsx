import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import DataError from 'components/DataError'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { isNabuError } from 'services/errors'

import { Loading, LoadingTextEnum } from '../../../../components'
import getData from './selectors'
import Success from './template.success'

const Connect = (props: Props) => {
  const fetchBank = useCallback(() => {
    if (props.tradingCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankLinkCredentials(props.tradingCurrency)
    }
    props.brokerageActions.fetchBankTransferUpdate(props.yapilyBankId)
  }, [props.yapilyBankId])

  useEffect(() => {
    // Clears any previous accounts so there is no cached qrcode on the UI
    props.brokerageActions.setBankDetails({ account: undefined })
    fetchBank()
  }, [fetchBank, props.brokerageActions, props.tradingCurrency])

  return props.data.cata({
    Failure: (error) => {
      if (isNabuError(error)) {
        return <GenericNabuErrorFlyout error={error} onDismiss={props.handleClose} />
      }
      return <DataError onClick={fetchBank} />
    },
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => <Success {...props} {...val} />
  })
}

const mapStateToProps = (state: RootState) => ({
  account: selectors.components.brokerage.getAccount(state),
  data: getData(state),
  tradingCurrency: selectors.modules.profile
    .getTradingCurrency(state)
    .getOrFail('could not get trading currency')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  yapilyBankId: string
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(Connect)
