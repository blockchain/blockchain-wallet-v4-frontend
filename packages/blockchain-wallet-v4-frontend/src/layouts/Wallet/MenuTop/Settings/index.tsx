import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import Settings from './template'

const SettingsContainer = (props: Props) => <Settings {...props} />

const mapStateToProps = (state) => ({
  walletConnectEnabled: selectors.core.walletOptions.getWalletConnectEnabled(state).getOrElse(false)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sessionActions: bindActionCreators(actions.session, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(SettingsContainer)
