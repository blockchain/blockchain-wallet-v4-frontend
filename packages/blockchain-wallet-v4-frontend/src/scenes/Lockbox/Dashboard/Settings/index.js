import React, { PureComponent } from 'react'

import RenameDevice from './RenameDevice'
import RemoveDevice from './RemoveDevice'
import ExportXPub from './ExportXPub'
import AddDevice from './AddDevice'
import RestoreDevice from './RestoreDevice'
import UpdateDevice from './UpdateDevice'

export default class LockboxSettings extends PureComponent {
  render () {
    const { device } = this.props

    return (
      <React.Fragment>
        <RenameDevice deviceId={device.id} />
        <ExportXPub deviceId={device.id} />
        <AddDevice />
        <RestoreDevice />
        <UpdateDevice deviceId={device.id} />
        <RemoveDevice deviceId={device.id} />
      </React.Fragment>
    )
  }
}
