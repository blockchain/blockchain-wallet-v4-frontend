import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import DataError from 'components/DataError'
import { SBTransactionType, WalletFiatType } from 'core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Loading, LoadingTextEnum } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'

const Connect = (props: Props) => {
  const fetchBank = () => {
    if (props.walletCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankLinkCredentials(
        props.walletCurrency as WalletFiatType
      )
    }
  }

  useEffect(fetchBank, [props.walletCurrency])

  return props.data.cata({
    Success: val => <Success {...props} {...val} />,
    Failure: () => <DataError onClick={fetchBank} />,
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD'),
  account: selectors.components.brokerage.getAccount(state),
  formValues: selectors.form.getFormValues('brokerageTx')(state) as {
    order: SBTransactionType
  }
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(Connect)
