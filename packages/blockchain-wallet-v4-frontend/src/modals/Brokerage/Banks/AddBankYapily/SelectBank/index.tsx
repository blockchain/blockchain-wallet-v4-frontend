import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import DataError from 'components/DataError'
import { WalletFiatType } from 'core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Loading, LoadingTextEnum } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'

const SelectBank = (props: Props) => {
  const fetchBank = () => {
    props.brokerageActions.fetchBankLinkCredentials(
      props.walletCurrency as WalletFiatType
    )
  }
  useEffect(() => {
    fetchBank()
  }, [])

  const { data } = props

  return data.cata({
    Success: val => <Success {...val} {...props} />,
    Failure: () => <DataError onClick={fetchBank} />,
    Loading: () => <Loading text={LoadingTextEnum.GETTING_READY} />,
    NotAsked: () => <Loading text={LoadingTextEnum.GETTING_READY} />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  setYapilyBankId: (string) => void
}
export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  brokerageActions: typeof actions.components.brokerage
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(SelectBank)
