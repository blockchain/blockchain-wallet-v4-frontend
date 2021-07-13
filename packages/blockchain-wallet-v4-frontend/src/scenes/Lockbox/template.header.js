import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'

const HeaderWrapper = styled.div`
  width: 100%;
`

const LockboxHeader = () => {
  return (
    <HeaderWrapper>
      <SceneHeader>
        <IconBackground>
          <Icon name='hardware' color='blue600' size='21px' />
        </IconBackground>
        <SceneHeaderText>
          <FormattedMessage
            id='scenes.hardware.title'
            defaultMessage='Hardware'
          />
        </SceneHeaderText>
      </SceneHeader>
      <SceneSubHeaderText>
        <FormattedMessage
          id='scenes.hardware.subheader'
          defaultMessage='Trade, send and receive from your offline hardware wallet.'
        />
      </SceneSubHeaderText>
    </HeaderWrapper>
  )
}

export default LockboxHeader
