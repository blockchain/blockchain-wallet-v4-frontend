import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'
import Settings from './template'

const SettingsContainer = (props: Props) => <Settings {...props} />

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(SettingsContainer)
