import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { SettingsHeading } from '../..'

const Updated = styled(Text)`
  max-width: 280px;
  color: #98a1b2;
`

export const Currency = () => {
  return (
    <>
      <SettingsHeading>Local currency</SettingsHeading>
      <Updated>Updated Tue May 31 2022 11:44:04 GMT+0100 (British Summer Time)</Updated>
    </>
  )
}
