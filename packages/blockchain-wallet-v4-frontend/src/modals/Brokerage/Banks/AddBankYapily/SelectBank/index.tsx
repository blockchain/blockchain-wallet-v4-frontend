import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import DataError from 'components/DataError'
import { WalletFiatType } from 'core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Loading, LoadingTextEnum } from '../../../components'
import { getData } from './selectors'
import Success from './template.success'

const SelectBank = (props: Props) => {
  useEffect(() => {
    props.brokerageActions.fetchBankLinkCredentials(
      props.fiatCurrency as WalletFiatType
    )
  }, [])

  const { data } = props

  return data.cata({
    Success: val => <Success {...val} {...props} />,
    Failure: () => <DataError onClick={() => {}} />,
    Loading: () => <Loading text={LoadingTextEnum.GETTING_READY} />,
    NotAsked: () => <Loading text={LoadingTextEnum.GETTING_READY} />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'GBP'
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  // handleClose: () => void
}
export type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(SelectBank)
