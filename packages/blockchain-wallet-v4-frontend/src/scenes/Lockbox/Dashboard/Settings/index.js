import React, { PureComponent } from 'react'
import styled from 'styled-components'

import DeviceName from './DeviceName'
import DeviceStatus from './DeviceStatus'
import ExportXPub from './ExportXPub'
import SetupNewDevice from './SetupNewDevice'
import RestoreLockboxDevice from './RestoreLockboxDevice'
import FirmwareUpdate from './FIrmwareUpdate'

const Wrapper = styled.div`
  width: 100%;
`

export default class LockboxSettings extends PureComponent {
  render () {
    const { deviceId } = this.props
    return (
      <Wrapper>
        <DeviceName deviceId={deviceId} />
        <DeviceStatus deviceId={deviceId} />
        <ExportXPub deviceId={deviceId} />
        <SetupNewDevice />
        <RestoreLockboxDevice />
        <FirmwareUpdate deviceId={deviceId} />
      </Wrapper>
    )
  }
}
