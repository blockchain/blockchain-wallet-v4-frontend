import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { WalletFiatType } from '@core/types'
import DataError from 'components/DataError'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { isNabuError } from 'services/errors'

import { Loading, LoadingTextEnum } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'

const SelectBank = (props: Props) => {
  const fetchBank = () => {
    props.brokerageActions.fetchBankLinkCredentials(props.tradingCurrency as WalletFiatType)
  }
  useEffect(() => {
    fetchBank()
  }, [])

  const { data } = props

  return data.cata({
    Failure: (error) => {
      if (isNabuError(error)) {
        return <GenericNabuErrorFlyout error={error} onDismiss={props.handleClose} />
      }
      return <DataError onClick={fetchBank} />
    },
    Loading: () => <Loading text={LoadingTextEnum.GETTING_READY} />,
    NotAsked: () => <Loading text={LoadingTextEnum.GETTING_READY} />,
    Success: (val) => <Success {...val} {...props} />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  tradingCurrency: selectors.modules.profile
    .getTradingCurrency(state)
    .getOrFail('could not get trading currency')
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  setYapilyBankId: (string) => void
}
export type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
  buySellActions: typeof actions.components.buySell
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(SelectBank)
