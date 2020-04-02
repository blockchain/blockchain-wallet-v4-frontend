import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText,
  SceneWrapper
} from 'components/Layout'
import React from 'react'

const Exchange = ({ onSignup }) => (
  <SceneWrapper>
    <SceneHeader>
      <IconBackground>
        <Icon name='blockchain-logo' color='blue600' size='24px' />
      </IconBackground>
      <SceneHeaderText>
        <FormattedMessage
          id='scenes.exchange.blockchain'
          defaultMessage='Exchange'
        />
      </SceneHeaderText>
    </SceneHeader>
    <SceneSubHeaderText>
      <FormattedMessage
        id='scenes.exchange.subheader'
        defaultMessage='We built our own exchange that defines speed, reliability and liquidity. Upgrade your trading.'
      />
    </SceneSubHeaderText>
  </SceneWrapper>
)

export default Exchange
