import React, { PureComponent } from 'react'
import styled from 'styled-components'
import RenameDevice from './RenameDevice'
import RemoveDevice from './RemoveDevice'
import ExportXPub from './ExportXPub'
import AddDevice from './AddDevice'
import RestoreDevice from './RestoreDevice'
import UpdateDevice from './UpdateDevice'
import InstallApps from './InstallApps'

const SettingsContainer = styled.div`
  padding: 0px 15px;
`

export default class LockboxSettings extends PureComponent {
  render () {
    const { deviceIndex } = this.props

    return (
      <SettingsContainer>
        <RenameDevice deviceIndex={deviceIndex} />
        <UpdateDevice deviceIndex={deviceIndex} />
        <AddDevice />
        <RestoreDevice />
        <ExportXPub deviceIndex={deviceIndex} />
        <RemoveDevice deviceIndex={deviceIndex} />
        <InstallApps deviceIndex={deviceIndex} />
      </SettingsContainer>
    )
  }
}
