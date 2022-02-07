import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BSOrderType, WalletFiatType } from '@core/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Loading, LoadingTextEnum } from '../../components'
import getData from './selectors'
import Success from './template.success'

const Connect = (props: Props) => {
  const fetchBank = () => {
    if (props.walletCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankLinkCredentials(props.walletCurrency as WalletFiatType)
    }
  }
  useEffect(() => {
    const { id } = props.order
    if (id) {
      props.buySellActions.pollOrder(id)
    }
  }, [props.order])

  useEffect(fetchBank, [props.walletCurrency])

  return props.data.cata({
    Failure: () => <DataError onClick={fetchBank} />,
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => <Success {...props} {...val} />
  })
}

const mapStateToProps = (state: RootState) => ({
  account: selectors.components.brokerage.getAccount(state),
  data: getData(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  order: BSOrderType
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(Connect)
