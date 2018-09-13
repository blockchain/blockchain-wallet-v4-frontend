import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import RenameDevice from './RenameDevice'
import RemoveDevice from './RemoveDevice'
import ExportXPub from './ExportXPub'
import AddDevice from './AddDevice'
import RestoreDevice from './RestoreDevice'
import UpdateDevice from './UpdateDevice'

const SettingsContainer = styled.div`
  padding: 0px 15px;
`

class LockboxSettings extends React.PureComponent {
  componentDidMount () {
    this.props.formActions.destroy('lockboxTransactions')
  }

  render () {
    const { device } = this.props

    return (
      <SettingsContainer>
        <RenameDevice deviceId={device.device_id} />
        <UpdateDevice deviceId={device.device_id} />
        <AddDevice />
        <RestoreDevice />
        <ExportXPub deviceId={device.device_id} />
        <RemoveDevice deviceId={device.device_id} />
      </SettingsContainer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LockboxSettings)
