import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import Settings from './template'

const SettingsContainer = (props: Props) => <Settings {...props} />

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(SettingsContainer)
