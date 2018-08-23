import React, { PureComponent } from 'react'
import styled from 'styled-components'

import DeviceName from './DeviceName'
import DeviceStatus from './DeviceStatus'
import ExportXPub from './ExportXPub'
import SetupNewDevice from './SetupNewDevice'
import RestoreLockboxDevice from './RestoreLockboxDevice'
import FirmwareUpdate from './FIrmwareUpdate'

const AdvancedContainer = styled.div`
  margin-top: 0 !important;
`

export default class LockboxSettings extends PureComponent {
  render () {
    const { deviceId } = this.props
    return (
      <AdvancedContainer>
        <DeviceName deviceId={deviceId} />
        <DeviceStatus deviceId={deviceId} />
        <ExportXPub deviceId={deviceId} />
        <SetupNewDevice />
        <RestoreLockboxDevice />
        <FirmwareUpdate deviceId={deviceId} />
      </AdvancedContainer>
    )
  }
}
