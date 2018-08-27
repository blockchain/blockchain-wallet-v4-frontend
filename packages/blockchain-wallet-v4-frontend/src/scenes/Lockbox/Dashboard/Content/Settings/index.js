import React, { PureComponent } from 'react'
import styled from 'styled-components'

import DeviceName from './DeviceName/index'
import DeviceStatus from './DeviceStatus/index'
import ExportXPub from './ExportXPub/index'
import SetupNewDevice from './SetupNewDevice/index'
import RestoreLockboxDevice from './RestoreLockboxDevice/index'
import FirmwareUpdate from './FIrmwareUpdate/index'

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
