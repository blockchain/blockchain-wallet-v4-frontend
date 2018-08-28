import React, { PureComponent } from 'react'
import styled from 'styled-components'

import DeviceName from './DeviceName'
import RemoveDevice from './RemoveDevice'
import ExportXPub from './ExportXPub'
import SetupNewDevice from './SetupNewDevice'
import RestoreLockboxDevice from './RestoreLockboxDevice'
import FirmwareUpdate from './FirmwareUpdate'

const Wrapper = styled.div`
  width: 100%;
`

export default class LockboxSettings extends PureComponent {
  render () {
    const { device } = this.props

    return (
      <Wrapper>
        <DeviceName deviceId={device.id} />
        <RemoveDevice deviceId={device.id} />
        <ExportXPub deviceId={device.id} />
        <SetupNewDevice />
        <RestoreLockboxDevice />
        <FirmwareUpdate deviceId={device.id} />
      </Wrapper>
    )
  }
}
