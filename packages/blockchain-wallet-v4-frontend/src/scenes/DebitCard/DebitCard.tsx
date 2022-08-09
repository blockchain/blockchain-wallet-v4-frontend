import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux'

import { WalletOptionsType } from '@core/redux/walletOptions/types'
import { actions, selectors } from 'data'
import { UserDataType } from 'data/modules/profile/types'

import DebitCard from './DebitCard.template'

const DebitCardContainer = (props: Props) => {
  if (!props.walletDebitCardEnabled) return <Redirect to='/home' />

  return <DebitCard {...props} />
}

const mapStateToProps = (state) => ({
  cardToken: selectors.components.debitCard.getCardToken(state),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  lockHandler: selectors.components.debitCard.getLockHandler(state),
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType),
  walletDebitCardEnabled: selectors.components.debitCard.isDebitCardModuleEnabledForAccount(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  alertActions: typeof actions.alerts
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DebitCardContainer)
