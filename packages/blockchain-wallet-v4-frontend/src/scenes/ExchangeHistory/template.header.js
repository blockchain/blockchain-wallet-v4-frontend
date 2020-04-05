import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'
import React from 'react'
import styled from 'styled-components'

const HeaderWrapper = styled.div``

const ExchangeHeader = () => {
  return (
    <HeaderWrapper>
      <SceneHeader>
        <IconBackground>
          <Icon name='arrow-switch-thick' color='blue600' size='24px' />
        </IconBackground>
        <SceneHeaderText>
          <FormattedMessage id='scenes.swap.title' defaultMessage='Swap' />
        </SceneHeaderText>
      </SceneHeader>
      <SceneSubHeaderText>
        <FormattedMessage
          id='scenes.swap.subheader'
          defaultMessage='Exchange any cryptocurrency for another crypto.'
        />
      </SceneSubHeaderText>
    </HeaderWrapper>
  )
}

export default ExchangeHeader
