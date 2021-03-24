import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import DataError from 'components/DataError'
import { WalletFiatType } from 'core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Loading, LoadingTextEnum } from '../../../components'
import { getData } from './selectors'
import Success from './template.success'

const Connect = (props: Props) => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankLinkCredentials(
        props.fiatCurrency as WalletFiatType
      )

      // props.brokerageActions.fetchBankTransferUpdate()
    }
  }, [])
  return props.data.cata({
    Success: val => <Success {...props} {...val} />,
    Failure: () => <DataError onClick={() => {}} />,
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'GBP'
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = ConnectedProps<typeof connector>

export default connector(Connect)
