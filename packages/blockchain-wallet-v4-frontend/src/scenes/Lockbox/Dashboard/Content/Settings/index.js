import React, { PureComponent } from 'react'
import styled from 'styled-components'

import DeviceName from './DeviceName/index'
import DeviceStatus from './DeviceStatus/index'
import ExportXPub from './ExportXPub/index'
import SetupNewDevice from './SetupNewDevice/index'
import RestoreLockboxDevice from './RestoreLockboxDevice/index'
import FirmwareUpdate from './FIrmwareUpdate/index'

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
