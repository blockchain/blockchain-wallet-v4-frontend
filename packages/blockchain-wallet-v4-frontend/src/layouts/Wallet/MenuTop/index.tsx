import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { InvitationsType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Header from './Header'

const HeaderContainer = (props: Props) => <Header {...props} />

const mapStateToProps = (state: RootState) => ({
  featureFlags: selectors.core.walletOptions
    .getFeatureFlags(state)
    .getOrElse({} as { [key in string]: boolean }),
  invitations: selectors.core.settings.getInvitations(state).getOrElse({} as InvitationsType),
  nftsEnabled: selectors.core.walletOptions.getNftExplorer(state).getOrElse(false) as boolean,
  walletDebitCardEnabled: selectors.components.debitCard.isDebitCardModuleEnabledForAccount(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  refreshActions: bindActionCreators(actions.components.refresh, dispatch),
  sessionActions: bindActionCreators(actions.session, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & { history: { push: (path: string) => void } }

export default withRouter(connector(HeaderContainer))
