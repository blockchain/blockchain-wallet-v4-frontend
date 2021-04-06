import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

// import { getFormValues } from 'redux-form'
import {
  SBOrderType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Loading from '../template.loading'
import { getData } from './selectors'
import Failure from './template.failure'
import Success from './template.success'

const Authorize = (props: Props) => {
  return props.data.cata({
    Success: val => <Success {...props} {...val} />,
    Failure: () => <Failure />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.core.settings.getCurrency(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Authorize)
