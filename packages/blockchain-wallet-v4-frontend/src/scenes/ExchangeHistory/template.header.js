import { Button, Icon } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'
import React from 'react'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  width: 100%;
`

const SupportButton = styled(Button)`
  margin-left: auto;
  border-radius: 8px;
`

const ExchangeHeader = ({ showHelpModal }) => {
  return (
    <HeaderWrapper>
      <SceneHeader>
        <IconBackground>
          <Icon name='arrow-switch-thick' color='blue600' size='24px' />
        </IconBackground>
        <SceneHeaderText>
          <FormattedMessage id='scenes.swap.title' defaultMessage='Swap' />
        </SceneHeaderText>
        <SupportButton height='42px' nature='light' onClick={showHelpModal}>
          <FormattedMessage
            id='scenes.exchange.menutop.need_help'
            defaultMessage='Need Help?'
          />
        </SupportButton>
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
