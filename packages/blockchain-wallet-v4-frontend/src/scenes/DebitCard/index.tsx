import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { WalletOptionsType } from '@core/redux/walletOptions/types'
import { RemoteDataType } from '@core/remote/types'
import { actions, selectors } from 'data'
import { DebitCardType } from 'data/components/debitCard/types'

import DebitCard from './template'

const DebitCardContainer = (props: Props) => <DebitCard {...props} />

const mapStateToProps = (state) => ({
  cardToken: selectors.components.debitCard.getCardToken(state),
  cards: selectors.components.debitCard.getCards(state),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  lockHandler: selectors.components.debitCard.getLockHandler(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  alertActions: typeof actions.alerts
  cardToken: string
  cards: Array<DebitCardType>
  debitCardActions: typeof actions.components.debitCard
  domains: { walletHelper: string }
  lockHandler: RemoteDataType<string, boolean>
  modalActions: typeof actions.modals
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DebitCardContainer)
