import React, { PureComponent } from 'react'
import styled from 'styled-components'

import RenameDevice from './RenameDevice'
import RemoveDevice from './RemoveDevice'
import ExportXPub from './ExportXPub'
import AddDevice from './AddDevice'
import RestoreDevice from './RestoreDevice'
import UpdateDevice from './UpdateDevice'

const Wrapper = styled.div`
  width: 100%;
`

export default class LockboxSettings extends PureComponent {
  render () {
    const { device } = this.props

    return (
      <Wrapper>
        <RenameDevice deviceId={device.id} />
        <ExportXPub deviceId={device.id} />
        <AddDevice />
        <RestoreDevice />
        <UpdateDevice deviceId={device.id} />
        <RemoveDevice deviceId={device.id} />
      </Wrapper>
    )
  }
}
